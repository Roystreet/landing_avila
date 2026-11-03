// Lógica de "Sube el Ávila": runner de tres carriles cuesta arriba hasta el Pico Naiguatá.
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import {
  createRenderer,
  createRng,
  damp,
  disposeScene,
  easeInOutCubic,
  easeOutBack,
  GameLoop,
  prefersReducedMotion,
  ShakeRig,
  TweenManager,
  type Rng,
} from "@/components/lab/engine/core"
import { labAudio } from "@/components/lab/engine/audio"
import { buildWorld, groundY, LANE_X, TRACK_LENGTH, type SummitWorld } from "@/components/lab/games/summit/world"
import {
  buildBoulder,
  buildBug,
  buildCoffee,
  buildCommit,
  CommitField,
  buildDeadline,
  buildHiker,
  buildMeeting,
  setLabel,
  Sparks,
  type Hiker,
  type Obstacle,
  type ObstacleKind,
  type Pickup,
} from "@/components/lab/games/summit/entities"
import type { Language } from "@/components/providers/language-provider"
import { loadNatureKit } from "@/components/lab/games/summit/assets"

export const ALT_START = 950
export const ALT_SUMMIT = 2765
export const MAX_HEALTH = 100

// Daño por tipo de choque frontal; un roce lateral solo quita un poco y te devuelve al carril
const DAMAGE: Record<ObstacleKind, number> = { bug: 25, meeting: 25, boulder: 40, deadline: 40 }
const GRAZE_DAMAGE = 8
const COFFEE_HEAL = 35
const STREAK_HEAL = 10
const LOW_HEALTH = 30
// Margen a favor del jugador: las cajas de choque son algo menores que el modelo
const FORGIVE_X = 0.12
const FORGIVE_TOP = 0.08
const PLAYER_HALF_W = 0.27
const PLAYER_HALF_D = 0.22
const PLAYER_HEIGHT = 1.62

export type Phase = "intro" | "playing" | "paused" | "won" | "lost"

export type HudSnapshot = {
  phase: Phase
  progress: number
  altitude: number
  commits: number
  health: number
  speed: number
  bonus: number
  elapsed: number
}

export type GameEvent =
  | { type: "milestone"; name: string }
  | { type: "hit"; kind: ObstacleKind }
  | { type: "commit"; combo: number }
  | { type: "coffee" }
  | { type: "phase"; phase: Phase }
  | { type: "near-miss" }
  | { type: "graze"; kind: ObstacleKind }
  | { type: "streak-heal" }
  | { type: "loading"; progress: number }
  | { type: "ready" }

const TEXT = {
  es: {
    bug: "bug",
    boulder: "cambio de alcance",
    deadline: "deadline",
    meeting: "reunión de 5 min",
    coffee: "+35 energía",
    milestones: [
      { at: 0.25, name: "Sabas Nieves", sub: "Vas bien" },
      { at: 0.5, name: "No te apures", sub: "Mitad del camino" },
      { at: 0.75, name: "Fila Maestra", sub: "Ya casi" },
      { at: 1, name: "Pico Naiguatá", sub: "Cumbre" },
    ],
  },
  en: {
    bug: "bug",
    boulder: "scope change",
    deadline: "deadline",
    meeting: "quick 5-min sync",
    coffee: "+35 energy",
    milestones: [
      { at: 0.25, name: "Sabas Nieves", sub: "Looking good" },
      { at: 0.5, name: "No te apures", sub: "Halfway there" },
      { at: 0.75, name: "Fila Maestra", sub: "Almost there" },
      { at: 1, name: "Pico Naiguatá", sub: "Summit" },
    ],
  },
}

type Intent = "left" | "right" | "jump"

export class SummitGame {
  private readonly ctx: ReturnType<typeof createRenderer>
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2600)
  private composer: EffectComposer | null = null
  private bloom: UnrealBloomPass | null = null
  private readonly loop: GameLoop
  private readonly tweens = new TweenManager()
  private readonly shake = new ShakeRig()
  private readonly reduced = prefersReducedMotion()
  private rng: Rng = createRng(42)
  private world!: SummitWorld
  private hiker!: Hiker
  private sparks = new Sparks(500)
  private moon!: THREE.DirectionalLight

  private obstacles: Obstacle[] = []
  private pickups: Pickup[] = []
  private commitField = new CommitField(48)
  private coffees: (Pickup & { label: THREE.Sprite })[] = []

  private phase: Phase = "intro"
  private lang: Language
  private distance = 0
  private speed = 0
  private laneIndex = 1
  private x = 0
  private y = 0
  private vy = 0
  private grounded = true
  private jumpBuffer = 0
  private coyote = 0
  private health = MAX_HEALTH
  private bonus = 0
  private laneFrom = 1
  private prevX = 0
  private prevPz = 0
  private slowmo = 0
  private disposed = false
  private ready = false
  private heartbeat = 0
  private commits = 0
  private combo = 0
  private comboTimer = 0
  private invuln = 0
  private hitstop = 0
  private fovPunch = 0
  private runTime = 0
  private nextSpawn = 60
  private milestoneIndex = 0
  private stride = 0
  private lean = 0
  private endTimer = 0
  private camYaw = 0
  private lastHud = 0
  private portrait = false
  private intents: Intent[] = []

  constructor(
    container: HTMLElement,
    lang: Language,
    private readonly onHud: (s: HudSnapshot) => void,
    private readonly onEvent: (e: GameEvent) => void,
  ) {
    this.lang = lang
    this.ctx = createRenderer(container)
    const { renderer } = this.ctx
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMappingExposure = 1.15
    this.shake.enabled = !this.reduced

    this.scene.fog = new THREE.FogExp2(0x0c1428, 0.0105)
    this.scene.background = new THREE.Color(0x05070d)
    this.buildScene()

    if (!this.ctx.coarse) {
      this.composer = new EffectComposer(renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.6, 0.82)
      this.composer.addPass(this.bloom)
      this.composer.addPass(new OutputPass())
    }

    this.ctx.onResize((w, h) => {
      this.camera.aspect = w / h
      this.portrait = w / h < 0.85
      this.camera.updateProjectionMatrix()
      this.composer?.setSize(w, h)
      this.bloom?.setSize(w, h)
    })

    this.loop = new GameLoop((dt, elapsed) => this.tick(dt, elapsed))
    this.resetRun()
    this.placeCamera(1, 0)
    this.loop.start()
    // Modelos CC0 de Kenney: el juego se ve con el bosque procedural hasta que llegan
    loadNatureKit((k) => !this.disposed && this.onEvent({ type: "loading", progress: k }))
      .then((kit) => {
        if (!this.disposed) this.world.applyKit(kit, this.ctx.coarse)
      })
      .catch(() => undefined)
      .finally(() => {
        this.ready = true
        if (!this.disposed) this.onEvent({ type: "ready" })
      })
    if (process.env.NODE_ENV !== "production") (window as unknown as { __summit?: SummitGame }).__summit = this
  }

  /** Solo para pruebas locales: salta a un punto del sendero. */
  debugJump(progress: number) {
    this.distance = progress * TRACK_LENGTH
    this.nextSpawn = this.distance + 40
    this.milestoneIndex = TEXT[this.lang].milestones.findIndex((m) => m.at > progress)
  }

  // ---------- Construcción ----------
  private buildScene() {
    const t = TEXT[this.lang]
    this.world = buildWorld(this.scene, t.milestones)

    const hemi = new THREE.HemisphereLight(0x7f9be0, 0x22301f, 0.95)
    this.scene.add(hemi)
    this.moon = new THREE.DirectionalLight(0xb4c8ff, 1.6)
    this.moon.castShadow = true
    this.moon.shadow.mapSize.set(this.ctx.coarse ? 1024 : 2048, this.ctx.coarse ? 1024 : 2048)
    const sc = this.moon.shadow.camera
    sc.left = -14
    sc.right = 14
    sc.top = 14
    sc.bottom = -14
    sc.near = 1
    sc.far = 80
    this.moon.shadow.bias = -0.0006
    this.moon.shadow.normalBias = 0.03
    this.scene.add(this.moon, this.moon.target)

    this.hiker = buildHiker()
    this.scene.add(this.hiker.root)
    this.scene.add(this.sparks.points)

    for (let i = 0; i < 6; i += 1) this.obstacles.push(buildBug(t.bug))
    for (let i = 0; i < 4; i += 1) this.obstacles.push(buildBoulder(t.boulder))
    for (let i = 0; i < 3; i += 1) this.obstacles.push(buildDeadline(t.deadline))
    for (let i = 0; i < 3; i += 1) this.obstacles.push(buildMeeting(t.meeting))
    this.obstacles.forEach((o) => this.scene.add(o.group))
    this.scene.add(this.commitField.object)
    for (let i = 0; i < 48; i += 1) {
      this.pickups.push(buildCommit())
    }
    for (let i = 0; i < 2; i += 1) {
      const c = buildCoffee(t.coffee)
      this.coffees.push(c)
      this.scene.add(c.group)
    }
  }

  setLang(lang: Language) {
    if (lang === this.lang) return
    this.lang = lang
    const t = TEXT[lang]
    for (const o of this.obstacles) setLabel(o.label, t[o.kind])
    for (const c of this.coffees) setLabel(c.label, t.coffee)
  }

  // ---------- Control ----------
  input(intent: Intent) {
    if (this.phase !== "playing") return
    this.intents.push(intent)
  }

  isReady() {
    return this.ready
  }

  start() {
    labAudio.unlock()
    labAudio.startAmbient("night")
    this.resetRun()
    this.setPhase("playing")
    labAudio.play("whoosh")
  }

  pause() {
    if (this.phase !== "playing") return
    this.setPhase("paused")
  }

  resume() {
    if (this.phase !== "paused") return
    this.setPhase("playing")
  }

  private setPhase(phase: Phase) {
    this.phase = phase
    this.onEvent({ type: "phase", phase })
    this.emitHud(true)
  }

  private resetRun() {
    this.rng = createRng(20260 + Math.floor(Math.random() * 1000))
    this.distance = 0
    this.speed = 10
    this.laneIndex = 1
    this.x = 0
    this.y = 0
    this.vy = 0
    this.grounded = true
    this.health = MAX_HEALTH
    this.bonus = 0
    this.laneFrom = 1
    this.prevX = 0
    this.prevPz = 0
    this.slowmo = 0
    this.commits = 0
    this.combo = 0
    this.invuln = 0
    this.hitstop = 0
    this.runTime = 0
    this.nextSpawn = 55
    this.milestoneIndex = 0
    this.endTimer = 0
    this.camYaw = 0
    this.intents = []
    this.tweens.clear()
    this.shake.reset()
    this.hiker.body.rotation.set(0, 0, 0)
    this.hiker.body.position.set(0, 0, 0)
    this.hiker.head.rotation.set(0, 0, 0)
    this.hiker.body.visible = true
    this.world.beaconLight.intensity = 40
    if (this.bloom) this.bloom.strength = 0.75
    for (const o of this.obstacles) this.release(o)
    for (const p of [...this.pickups, ...this.coffees]) {
      p.active = false
      p.group.visible = false
    }
  }

  // ---------- Generación ----------
  private acquire(kind: ObstacleKind) {
    return this.obstacles.find((o) => o.kind === kind && !o.active)
  }

  private release(o: Obstacle) {
    o.active = false
    o.group.visible = false
    o.hit = false
  }

  private spawnObstacle(kind: ObstacleKind, z: number, lane: number, freeLane = 1) {
    const o = this.acquire(kind)
    if (!o) return
    o.active = true
    o.hit = false
    o.passed = false
    o.minGap = Infinity
    o.group.visible = true
    o.z = z
    o.prevZ = z
    o.lane = lane
    o.vx = 0
    o.vz = 0
    o.group.rotation.set(0, 0, 0)
    o.knock = { vx: 0, vy: 0, vz: 0, spin: 0, y: 0 }
    o.label.visible = true
    if (kind === "bug") {
      // Cruza el sendero de lado a lado
      const fromLeft = this.rng.chance(0.5)
      o.x = fromLeft ? -3.6 : 3.6
      o.vx = (fromLeft ? 1 : -1) * this.rng.range(1.4, 2.2)
      o.group.rotation.y = fromLeft ? -Math.PI / 2 : Math.PI / 2
    } else if (kind === "boulder") {
      o.x = LANE_X[lane]
      o.vz = this.rng.range(5, 7.5)
    } else if (kind === "deadline") {
      o.lanes = [0, 1, 2].filter((l) => l !== freeLane)
      o.x = (LANE_X[o.lanes[0]] + LANE_X[o.lanes[1]]) / 2
    } else {
      o.x = 0
    }
    o.group.position.set(o.x, groundY(z), z)
  }

  private spawnCommit(x: number, y: number, z: number) {
    const p = this.pickups.find((c) => !c.active)
    if (!p) return
    p.active = true
    p.taken = false
    p.group.visible = true
    p.x = x
    p.y = y
    p.z = z
    p.t = this.rng.next() * 6
    p.group.scale.setScalar(1)
  }

  private spawnCoffee(z: number, lane: number) {
    const c = this.coffees.find((k) => !k.active)
    if (!c) return
    c.active = true
    c.taken = false
    c.group.visible = true
    c.x = LANE_X[lane]
    c.y = 0.25
    c.z = z
    c.group.scale.setScalar(1)
  }

  /** Coloca el siguiente patrón: la dificultad sube con el avance y respira tras cada hito. */
  private spawnPattern(z: number) {
    const progress = this.distance / TRACK_LENGTH
    const r = this.rng
    const lane = r.int(0, 2)
    const roll = r.next()
    const late = progress > 0.45
    const later = progress > 0.7
    let length = 14

    if (progress < 0.06) {
      // Calentamiento: solo commits para aprender a cambiar de carril
      for (let i = 0; i < 5; i += 1) this.spawnCommit(LANE_X[lane], 0.6, z - i * 2.4)
      return 16
    }

    if (roll < 0.22) {
      this.spawnObstacle("bug", z, lane)
      this.spawnCommit(LANE_X[(lane + 1) % 3], 0.6, z)
      length = 13
    } else if (roll < 0.42) {
      this.spawnObstacle("boulder", z - 8, lane)
      for (let i = 0; i < 4; i += 1) this.spawnCommit(LANE_X[(lane + 2) % 3], 0.6, z - i * 2.4)
      if (later) this.spawnObstacle("boulder", z - 20, (lane + 1) % 3)
      length = later ? 22 : 16
    } else if (roll < 0.62) {
      const free = r.int(0, 2)
      this.spawnObstacle("deadline", z, 0, free)
      for (let i = 0; i < 3; i += 1) this.spawnCommit(LANE_X[free], 0.6, z + 2 - i * 2)
      if (late && r.chance(0.5)) this.spawnObstacle("bug", z - 7, free)
      length = late ? 18 : 15
    } else if (roll < 0.8) {
      this.spawnObstacle("meeting", z, 1)
      // Arco de commits sobre el tronco: premia el salto bien medido
      for (let i = 0; i < 5; i += 1) {
        const k = (i - 2) / 2
        this.spawnCommit(LANE_X[lane], 0.7 + (1 - k * k) * 1.1, z + (i - 2) * 1.6)
      }
      length = 15
    } else {
      for (let i = 0; i < 6; i += 1) {
        const l = Math.max(0, Math.min(2, lane + Math.round(Math.sin(i * 0.9))))
        this.spawnCommit(LANE_X[l], 0.6, z - i * 2.2)
      }
      if (late) this.spawnObstacle("bug", z - 10, (lane + 1) % 3)
      length = 15
    }
    if (this.health < 80 && r.chance(this.health < 50 ? 0.2 : 0.1)) this.spawnCoffee(z - length * 0.6, r.int(0, 2))
    const density = THREE.MathUtils.lerp(1.35, 0.85, progress)
    return length * density
  }

  // ---------- Bucle ----------
  private tick(rawDt: number, elapsed: number) {
    if (this.hitstop > 0) this.hitstop -= rawDt
    if (this.slowmo > 0) this.slowmo -= rawDt
    const dt = this.hitstop > 0 ? rawDt * 0.06 : this.slowmo > 0 ? rawDt * 0.45 : rawDt

    // La linterna es la barra de vida dentro del mundo: se apaga y parpadea con poca energía
    const lamp = this.health / MAX_HEALTH
    const flicker = this.health < LOW_HEALTH && this.phase === "playing" ? (Math.sin(elapsed * 23) > 0.6 ? 0.35 : 1) : 1
    this.hiker.headlamp.intensity = (18 + 42 * lamp) * flicker
    this.hiker.lampGlow.material.opacity = (0.35 + 0.65 * lamp) * flicker
    if (this.phase === "playing" && this.health < LOW_HEALTH) {
      this.heartbeat -= rawDt
      if (this.heartbeat <= 0) {
        labAudio.play("heartbeat")
        this.heartbeat = 0.85
      }
    }

    // Niebla por pisos: selva nublada más espesa, cumbre despejada sobre el mar de nubes
    const prog = Math.min(1, this.distance / TRACK_LENGTH)
    const mist = THREE.MathUtils.smoothstep(prog, 0.3, 0.42) * (1 - THREE.MathUtils.smoothstep(prog, 0.6, 0.72))
    const fog = this.scene.fog as THREE.FogExp2
    fog.density = THREE.MathUtils.lerp(0.0105 - prog * 0.003, 0.019, mist)
    fog.color.setRGB(0.047 + mist * 0.05, 0.078 + mist * 0.06, 0.157 + mist * 0.07)

    if (this.phase === "playing") this.updatePlaying(dt)
    else if (this.phase === "won" || this.phase === "lost") this.updateEnding(dt)
    else this.animateIdle(rawDt, elapsed)

    this.updateEntities(this.phase === "paused" ? 0 : dt, elapsed)
    this.world.update(this.phase === "paused" ? 0 : rawDt, elapsed, -this.distance)
    this.commitField.sync(this.pickups)
    this.sparks.update(this.phase === "paused" ? 0 : rawDt)
    this.tweens.update(rawDt)

    const pz = -this.distance
    this.moon.position.set(this.x - 24, groundY(pz) + 32, pz + 6)
    this.moon.target.position.set(this.x, groundY(pz), pz - 4)

    if (this.phase === "playing") this.placeCamera(rawDt, elapsed)
    this.shake.apply(this.camera, rawDt, 0.3, 0.04)
    this.fovPunch *= Math.exp(-rawDt / 0.22)
    const baseFov = this.portrait ? 72 : 55
    this.camera.fov = baseFov + this.fovPunch
    this.camera.updateProjectionMatrix()

    if (this.composer) this.composer.render()
    else this.ctx.renderer.render(this.scene, this.camera)

    if (elapsed - this.lastHud > 0.1) {
      this.lastHud = elapsed
      this.emitHud()
    }
  }

  private updatePlaying(dt: number) {
    this.runTime += dt
    this.prevPz = -this.distance
    const progress = this.distance / TRACK_LENGTH
    const targetSpeed = THREE.MathUtils.lerp(10.5, 17.5, Math.min(1, progress * 1.1))
    this.speed = damp(this.speed, targetSpeed, 1.5, dt)
    this.distance += this.speed * dt

    // Intenciones del jugador
    while (this.intents.length) {
      const it = this.intents.shift()!
      if (it === "left" && this.laneIndex > 0) {
        this.laneFrom = this.laneIndex
        this.laneIndex -= 1
        labAudio.play("whoosh", this.rng.next())
        this.lean = 1
      } else if (it === "right" && this.laneIndex < 2) {
        this.laneFrom = this.laneIndex
        this.laneIndex += 1
        labAudio.play("whoosh", this.rng.next())
        this.lean = -1
      } else if (it === "jump") {
        this.jumpBuffer = 0.14
      }
    }
    this.lean = damp(this.lean, 0, 8, dt)
    this.prevX = this.x
    this.x = damp(this.x, LANE_X[this.laneIndex], 16, dt)

    // Salto con buffer y tiempo de gracia
    this.coyote = this.grounded ? 0.08 : this.coyote - dt
    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= dt
      if (this.coyote > 0) {
        this.vy = 7.6
        this.grounded = false
        this.coyote = 0
        this.jumpBuffer = 0
        labAudio.play("jump", this.rng.next())
        this.squash(1.18)
      }
    }
    if (!this.grounded) {
      this.vy -= 23 * dt
      this.y += this.vy * dt
      if (this.y <= 0) {
        this.y = 0
        this.vy = 0
        this.grounded = true
        labAudio.play("land", this.rng.next())
        this.squash(0.86)
        this.shake.add(0.08)
      }
    }

    // Generación por delante del jugador
    while (this.nextSpawn < this.distance + 95 && this.nextSpawn < TRACK_LENGTH - 30) {
      this.nextSpawn += this.spawnPattern(-this.nextSpawn)
    }

    // Hitos
    const ms = TEXT[this.lang].milestones
    if (this.milestoneIndex < ms.length - 1 && progress >= ms[this.milestoneIndex].at) {
      this.onEvent({ type: "milestone", name: ms[this.milestoneIndex].name })
      labAudio.play("milestone")
      this.milestoneIndex += 1
      // Respiro tras cada hito
      this.nextSpawn = Math.max(this.nextSpawn, this.distance + 110)
    }

    this.invuln = Math.max(0, this.invuln - dt)
    this.comboTimer -= dt
    if (this.comboTimer <= 0) this.combo = 0

    this.collide()
    this.animateHiker(dt)

    if (this.distance >= TRACK_LENGTH) this.win()
  }

  /** Caja de choque del obstáculo en el mundo (sin contar la roca, que es esfera). */
  private obstacleBox(o: Obstacle) {
    switch (o.kind) {
      case "bug":
        return { minX: o.x - 0.42, maxX: o.x + 0.42, top: 0.55, halfD: 0.5 }
      case "meeting":
        return { minX: -3.3, maxX: 3.3, top: 0.56, halfD: 0.3 }
      case "deadline":
        return { minX: LANE_X[o.lanes[0]] - 0.95, maxX: LANE_X[o.lanes[o.lanes.length - 1]] + 0.95, top: 2.4, halfD: 0.2 }
      default:
        return { minX: o.x - 0.78, maxX: o.x + 0.78, top: 1.66, halfD: 0.78 }
    }
  }

  /**
   * Colisión barrida: compara el tramo recorrido en este cuadro (jugador y obstáculo)
   * para que a 17 m/s nada se atraviese entre cuadros. La roca usa esfera; el resto, cajas.
   */
  private collide() {
    const pz = -this.distance
    const feet = this.y
    for (const o of this.obstacles) {
      if (!o.active || o.hit) continue
      const box = this.obstacleBox(o)
      const relPrev = this.prevPz - o.prevZ
      const relNow = pz - o.z
      const sweepMin = Math.min(relPrev, relNow) - PLAYER_HALF_D
      const sweepMax = Math.max(relPrev, relNow) + PLAYER_HALF_D
      const zOverlap = sweepMax > -box.halfD && sweepMin < box.halfD

      const minX = box.minX + FORGIVE_X
      const maxX = box.maxX - FORGIVE_X
      const xNow = this.x + PLAYER_HALF_W > minX && this.x - PLAYER_HALF_W < maxX
      const xPrev = this.prevX + PLAYER_HALF_W > minX && this.prevX - PLAYER_HALF_W < maxX
      const clearsTop = feet > box.top - FORGIVE_TOP

      // Registro de la distancia mínima para premiar los "por poco"
      if (zOverlap || Math.abs(relNow) < box.halfD + 1.2) {
        const gapX = this.x < minX ? minX - (this.x + PLAYER_HALF_W) : this.x > maxX ? this.x - PLAYER_HALF_W - maxX : 0
        const gapY = clearsTop ? feet - box.top : 0
        const gap = Math.max(gapX, gapY)
        if (xNow && !clearsTop) o.minGap = 0
        else o.minGap = Math.min(o.minGap, gap)
      }
      // El obstáculo ya quedó atrás: ¿fue por poco?
      if (!o.passed && relNow < -box.halfD - 0.6) {
        o.passed = true
        if (o.minGap < 0.45 && o.minGap > 0) this.nearMiss(o)
        continue
      }

      if (!zOverlap || clearsTop || this.invuln > 0) continue
      if (o.kind === "boulder") {
        // Esfera contra la caja del jugador
        const cy = o.knock.y + 0.88
        const cz = o.z
        const px = THREE.MathUtils.clamp(o.x, this.x - PLAYER_HALF_W, this.x + PLAYER_HALF_W)
        const py = THREE.MathUtils.clamp(cy, feet, feet + PLAYER_HEIGHT)
        const pzc = THREE.MathUtils.clamp(cz, Math.min(pz, this.prevPz) - PLAYER_HALF_D, Math.max(pz, this.prevPz) + PLAYER_HALF_D)
        const d2 = (px - o.x) ** 2 + (py - cy) ** 2 + (pzc - cz) ** 2
        if (d2 > 0.7 * 0.7) continue
      } else if (!xNow) continue

      // Entró de lado (cambiando de carril) en vez de chocar de frente
      const fromSide = !xPrev && this.laneFrom !== this.laneIndex && Math.abs(relPrev) < box.halfD + PLAYER_HALF_D
      if (fromSide) this.graze(o)
      else this.takeHit(o)
    }

    // Coleccionables: esfera de recogida e imán suave hacia el carril del jugador
    for (const p of this.pickups) {
      if (!p.active || p.taken) continue
      const dz = p.z - pz
      if (dz < 3 && dz > -1 && Math.abs(p.x - this.x) < 1.3) p.x = damp(p.x, this.x, 6, 1 / 60)
      const dx = p.x - this.x
      const dy = p.y - (feet + 0.9)
      if (dx * dx + dy * dy * 0.5 + dz * dz < 0.85 * 0.85) this.collectCommit(p)
    }
    for (const c of this.coffees) {
      if (!c.active || c.taken) continue
      const dz = c.z - pz
      if (Math.abs(dz) < 0.9 && Math.abs(c.x - this.x) < 0.8 && feet < 1.2) this.collectCoffee(c)
    }
  }

  private setHealth(value: number) {
    this.health = THREE.MathUtils.clamp(value, 0, MAX_HEALTH)
    this.emitHud(true)
  }

  private takeHit(o: Obstacle) {
    o.hit = true
    o.passed = true
    this.setHealth(this.health - DAMAGE[o.kind])
    this.invuln = 1.3
    this.combo = 0
    this.hitstop = this.reduced ? 0 : 0.085
    this.shake.add(0.5)
    if (!this.reduced) this.fovPunch = 7
    this.speed *= 0.72
    labAudio.play("hit", this.rng.next())
    const at = new THREE.Vector3(this.x, groundY(-this.distance) + 0.8, -this.distance - 0.4)
    this.sparks.burst(at, 0xff4d5e, this.reduced ? 10 : 40, 4.5, this.rng.next)
    // El obstáculo sale despedido
    if (o.kind === "bug" || o.kind === "boulder") {
      o.knock = { vx: (o.x - this.x || 1) * 3 + (this.rng.next() - 0.5) * 4, vy: 6, vz: -4, spin: 10, y: 0 }
      o.label.visible = false
    }
    this.onEvent({ type: "hit", kind: o.kind })
    if (this.health <= 0) this.lose()
  }

  /** Roce lateral: rebota al carril de origen con poco daño. */
  private graze(o: Obstacle) {
    this.laneIndex = this.laneFrom
    this.lean = this.laneIndex > this.laneFrom ? -1.4 : 1.4
    this.setHealth(this.health - GRAZE_DAMAGE)
    this.invuln = 0.45
    this.combo = 0
    this.shake.add(0.22)
    labAudio.play("error", this.rng.next())
    this.sparks.burst(new THREE.Vector3((this.x + o.x) / 2, groundY(-this.distance) + 0.7, -this.distance), 0xffc46b, this.reduced ? 6 : 18, 3, this.rng.next)
    this.onEvent({ type: "graze", kind: o.kind })
    if (this.health <= 0) this.lose()
  }

  private nearMiss(o: Obstacle) {
    this.bonus += 25
    if (!this.reduced) this.slowmo = 0.16
    labAudio.play("combo", 0.8)
    this.sparks.burst(new THREE.Vector3(o.x, groundY(o.z) + 0.6, o.z), 0xdbe7ff, this.reduced ? 4 : 14, 2.2, this.rng.next)
    this.onEvent({ type: "near-miss" })
  }

  private collectCommit(p: Pickup) {
    p.taken = true
    this.commits += 1
    this.combo = this.comboTimer > 0 ? this.combo + 1 : 1
    this.comboTimer = 1.2
    labAudio.play(this.combo >= 5 && this.combo % 5 === 0 ? "combo" : "pickup", Math.min(1, 0.3 + this.combo * 0.06))
    this.sparks.burst(new THREE.Vector3(p.x, groundY(p.z) + p.y, p.z), 0x8fb5ff, this.reduced ? 6 : 16, 2.5, this.rng.next)
    this.shake.add(0.04)
    const startY = p.y
    this.tweens.tween(
      0.28,
      (v) => {
        p.y = startY + v * 1.4
        // Crece y se encoge al desaparecer
        p.group.scale.setScalar(v < 0.35 ? 1 + v * 2 : Math.max(0, 1.7 * (1 - (v - 0.35) / 0.65)))
      },
      { onComplete: () => ((p.active = false), (p.group.visible = false)) },
    )
    this.onEvent({ type: "commit", combo: this.combo })
    if (this.commits % 15 === 0 && this.health < MAX_HEALTH) {
      this.setHealth(this.health + STREAK_HEAL)
      this.onEvent({ type: "streak-heal" })
    }
  }

  private collectCoffee(c: Pickup) {
    c.taken = true
    this.setHealth(this.health + COFFEE_HEAL)
    labAudio.play("milestone")
    this.sparks.burst(new THREE.Vector3(c.x, groundY(c.z) + 0.5, c.z), 0xffc46b, this.reduced ? 8 : 26, 3, this.rng.next)
    this.tweens.tween(0.35, (v) => c.group.scale.setScalar(1 + v * 0.8 - v * v * 1.8), {
      onComplete: () => ((c.active = false), (c.group.visible = false)),
    })
    this.onEvent({ type: "coffee" })
  }

  private squash(sy: number) {
    const body = this.hiker.body
    const xz = 1 / Math.sqrt(sy)
    this.tweens.tween(
      0.2,
      (v) => {
        body.scale.set(xz + (1 - xz) * v, sy + (1 - sy) * v, xz + (1 - xz) * v)
      },
      { easing: easeOutBack },
    )
  }

  private win() {
    this.distance = TRACK_LENGTH
    this.setPhase("won")
    labAudio.play("win")
    this.endTimer = 0
    const summit = new THREE.Vector3(0, groundY(-TRACK_LENGTH) + 2, -TRACK_LENGTH - 6)
    const burst = () => this.sparks.burst(summit, 0xdbe7ff, this.reduced ? 20 : 90, 7, this.rng.next, 1.4)
    burst()
    this.tweens.tween(0.01, () => undefined, { delay: 0.5, onComplete: burst })
    this.tweens.tween(2.4, (v) => (this.world.beaconLight.intensity = 40 + v * 50), { easing: easeInOutCubic })
    if (this.bloom) this.tweens.tween(1.5, (v) => (this.bloom!.strength = 0.75 - v * 0.3))
  }

  private lose() {
    this.setPhase("lost")
    labAudio.play("lose")
    labAudio.stopAmbient()
    this.endTimer = 0
  }

  private updateEnding(dt: number) {
    this.endTimer += dt
    const pz = -this.distance
    const h = this.hiker
    if (this.phase === "lost") {
      // Se sienta a recuperar el aliento
      h.body.rotation.x = damp(h.body.rotation.x, 0.25, 5, dt)
      h.body.position.y = damp(h.body.position.y, -0.35, 5, dt)
      h.legs.forEach((l) => (l.rotation.x = damp(l.rotation.x, 1.35, 6, dt)))
      h.knees.forEach((k) => (k.rotation.x = damp(k.rotation.x, -1.5, 6, dt)))
      h.arms.forEach((a) => (a.rotation.x = damp(a.rotation.x, 0.5, 6, dt)))
      h.elbows.forEach((e) => (e.rotation.x = damp(e.rotation.x, 1.2, 6, dt)))
      h.poles.forEach((p) => (p.rotation.x = damp(p.rotation.x, -0.9, 6, dt)))
      h.head.rotation.x = damp(h.head.rotation.x, 0.35, 4, dt)
      this.y = damp(this.y, 0, 8, dt)
    } else {
      // Celebra en la cumbre
      const k = this.endTimer
      h.elbows.forEach((e) => (e.rotation.x = damp(e.rotation.x, 0.15, 6, dt)))
      h.poles.forEach((p) => (p.rotation.x = damp(p.rotation.x, 2.6, 6, dt)))
      h.knees.forEach((kn) => (kn.rotation.x = damp(kn.rotation.x, -0.1, 6, dt)))
      h.head.rotation.x = damp(h.head.rotation.x, -0.25, 4, dt)
      h.arms.forEach((a, i) => {
        a.rotation.x = damp(a.rotation.x, 2.85, 6, dt)
        a.rotation.z = (i ? -1 : 1) * (0.25 + Math.sin(k * 6) * 0.08)
      })
      h.legs.forEach((l) => (l.rotation.x = damp(l.rotation.x, 0, 6, dt)))
      h.body.position.y = Math.abs(Math.sin(k * 5)) * 0.18 * Math.max(0, 1 - k / 3)
      this.x = damp(this.x, 0, 3, dt)
    }
    h.root.position.set(this.x, groundY(pz) + this.y, pz)

    // Grúa de cámara: se eleva y gira para mostrar Caracas abajo
    // Al ganar se ubica detrás y a la derecha: el excursionista, la luz de la cumbre y Caracas abajo
    this.camYaw = damp(this.camYaw, this.phase === "won" ? 0.95 : 0.6, 0.8, dt)
    const radius = this.phase === "won" ? 8.5 : 6
    const height = this.phase === "won" ? 3.4 : 2.8
    const target = new THREE.Vector3(this.x, groundY(pz) + 1.2, pz)
    const desired = new THREE.Vector3(target.x + Math.sin(this.camYaw) * radius, target.y + height, target.z + Math.cos(this.camYaw) * radius)
    this.camera.position.lerp(desired, 1 - Math.exp(-2.5 * dt))
    this.camera.lookAt(this.phase === "won" ? target.clone().add(new THREE.Vector3(-2.5, -0.6, -2.5)) : target)
  }

  private animateIdle(dt: number, elapsed: number) {
    // Modo vitrina detrás de la tarjeta de inicio: la cámara orbita al excursionista
    const pz = -this.distance
    this.hiker.root.position.set(this.x, groundY(pz) + this.y, pz)
    if (this.phase === "intro") {
      this.stride += dt * 2
      this.animateLimbs(0.25, this.stride)
      const a = Math.sin(elapsed * 0.15) * 0.6 + 0.4
      const target = new THREE.Vector3(0, groundY(pz) + 1.3, pz - 2)
      this.camera.position.set(Math.sin(a) * 6.5, target.y + 1.6 + Math.sin(elapsed * 0.3) * 0.3, pz + Math.cos(a) * 6.5)
      this.camera.lookAt(target)
    }
  }

  private animateLimbs(amount: number, phase: number) {
    const h = this.hiker
    const s = Math.sin(phase)
    const c = Math.cos(phase)
    h.legs[0].rotation.x = s * amount * 1.7
    h.legs[1].rotation.x = -s * amount * 1.7
    // La rodilla se dobla al recoger la pierna hacia adelante
    h.knees[0].rotation.x = -0.12 - Math.max(0, c) * amount * 2.6
    h.knees[1].rotation.x = -0.12 - Math.max(0, -c) * amount * 2.6
    h.arms[0].rotation.x = -s * amount * 1.3
    h.arms[1].rotation.x = s * amount * 1.3
    h.arms[0].rotation.z = -0.12
    h.arms[1].rotation.z = 0.12
    for (let i = 0; i < 2; i += 1) {
      h.elbows[i].rotation.x = 0.45 + amount * 0.5
      // Bastón casi vertical, inclinado hacia atrás: se "planta" con cada paso
      h.poles[i].rotation.x = -(h.arms[i].rotation.x + h.elbows[i].rotation.x) - 0.25
    }
    h.head.rotation.x = 0.05 + Math.sin(phase * 2) * 0.03
  }

  private animateHiker(dt: number) {
    const h = this.hiker
    const pz = -this.distance
    this.stride += dt * this.speed * 0.95
    if (this.grounded) {
      this.animateLimbs(0.5, this.stride)
      h.body.position.y = Math.abs(Math.sin(this.stride)) * 0.08
    } else {
      // Pose de salto: rodillas arriba
      h.legs[0].rotation.x = damp(h.legs[0].rotation.x, 1.0, 14, dt)
      h.knees[0].rotation.x = damp(h.knees[0].rotation.x, -1.3, 14, dt)
      h.legs[1].rotation.x = damp(h.legs[1].rotation.x, -0.45, 14, dt)
      h.knees[1].rotation.x = damp(h.knees[1].rotation.x, -0.7, 14, dt)
      h.arms.forEach((a) => (a.rotation.x = damp(a.rotation.x, 0.9, 12, dt)))
      h.poles.forEach((p, i) => (p.rotation.x = damp(p.rotation.x, -(h.arms[i].rotation.x + h.elbows[i].rotation.x) - 0.6, 12, dt)))
    }
    h.body.rotation.x = -0.12 - this.speed * 0.006
    h.body.rotation.z = this.lean * 0.18
    h.root.position.set(this.x, groundY(pz) + this.y, pz)
    const blob = h.root.getObjectByName("blob")!
    blob.position.y = -this.y + 0.03
    blob.scale.setScalar(Math.max(0.4, 1 - this.y * 0.35))
    // Parpadeo mientras dura la invulnerabilidad
    h.body.visible = this.invuln <= 0 || Math.floor(this.invuln * 14) % 2 === 0
  }

  private updateEntities(dt: number, elapsed: number) {
    const pz = -this.distance
    for (const o of this.obstacles) {
      if (!o.active) continue
      o.prevZ = o.z
      if (o.hit && (o.kind === "bug" || o.kind === "boulder")) {
        o.knock.vy -= 20 * dt
        o.x += o.knock.vx * dt
        o.knock.y += o.knock.vy * dt
        o.z += o.knock.vz * dt
        o.group.rotation.x += o.knock.spin * dt
        o.group.rotation.z += o.knock.spin * 0.6 * dt
      } else if (o.kind === "bug") {
        o.x += o.vx * dt
        if (Math.abs(o.x) > 3.7) {
          o.vx *= -1
          o.group.rotation.y = o.vx > 0 ? -Math.PI / 2 : Math.PI / 2
        }
        // Marcha alterna en trípode: tres patas avanzan mientras las otras tres empujan
        o.legs?.forEach((leg, i) => {
          const phase = elapsed * 16 + (i % 2 === 0 ? 0 : Math.PI)
          leg.rotation.y = Math.sin(phase) * 0.4
          leg.rotation.x = Math.max(0, Math.cos(phase)) * 0.25
        })
      } else if (o.kind === "boulder") {
        // Solo rueda cuando el jugador se acerca, para que el aviso sea legible
        if (o.z - pz > -55) {
          o.z += o.vz * dt
          if (o.spin) o.spin.rotation.x -= (o.vz / 0.9) * dt
          if (this.rng.next() < 0.3) this.sparks.burst(new THREE.Vector3(o.x, groundY(o.z) + 0.1, o.z), 0x8a7a66, 1, 1.2, this.rng.next, 0.4)
        }
      } else if (o.kind === "deadline") {
        const warn = o.group.getObjectByName("warnGlow") as THREE.Sprite
        warn.material.opacity = 0.5 + Math.sin(elapsed * 10) * 0.5
      }
      const bob = o.kind === "bug" && !o.hit ? Math.abs(Math.sin(elapsed * 16)) * 0.03 : 0
      o.group.position.set(o.x, groundY(o.z) + o.knock.y + bob, o.z)
      // La etiqueta se lee de lejos y se desvanece al acercarse para no tapar al jugador
      const ahead = pz - o.z
      const fade = THREE.MathUtils.smoothstep(ahead, 3, 9) * (1 - THREE.MathUtils.smoothstep(ahead, 70, 90))
      o.label.material.opacity = fade
      o.label.visible = fade > 0.02 && !o.hit
      if (o.z > pz + 12 || o.knock.y < -20) this.release(o)
    }
    for (const p of this.pickups) {
      if (!p.active) continue
      p.t += dt
      p.group.position.set(p.x, groundY(p.z) + p.y + Math.sin(p.t * 3) * 0.08, p.z)
      p.group.rotation.y = p.t * 2.4
      if (p.z > pz + 10) {
        p.active = false
        p.group.visible = false
      }
    }
    for (const c of this.coffees) {
      if (!c.active) continue
      c.t += dt
      c.group.position.set(c.x, groundY(c.z) + c.y + Math.sin(c.t * 2.5) * 0.08, c.z)
      c.group.rotation.y = Math.sin(c.t) * 0.5
      for (let i = 0; i < 3; i += 1) {
        const puff = c.group.getObjectByName(`steam${i}`)!
        puff.position.y = 0.7 + ((c.t * 0.5 + i / 3) % 1) * 0.6
      }
      if (c.z > pz + 10) {
        c.active = false
        c.group.visible = false
      }
    }
  }

  private placeCamera(dt: number, _elapsed: number) {
    const pz = -this.distance
    const back = this.portrait ? 7.4 : 5.6
    const up = this.portrait ? 3.8 : 2.8
    const desired = new THREE.Vector3(this.x * 0.55, groundY(pz + back) + up + this.y * 0.35, pz + back)
    const k = dt >= 1 ? 1 : 1 - Math.exp(-8 * dt)
    this.camera.position.lerp(desired, k)
    this.camera.rotation.set(0, 0, 0)
    const look = new THREE.Vector3(this.x * 0.3, groundY(pz - 14) + 0.6, pz - 14)
    this.camera.lookAt(look)
  }

  private emitHud(force = false) {
    if (!force && this.phase !== "playing") return
    const progress = Math.min(1, this.distance / TRACK_LENGTH)
    this.onHud({
      phase: this.phase,
      progress,
      altitude: Math.round(ALT_START + (ALT_SUMMIT - ALT_START) * progress),
      commits: this.commits,
      health: this.health,
      bonus: this.bonus,
      speed: this.speed,
      elapsed: this.runTime,
    })
  }

  stats() {
    const progress = Math.min(1, this.distance / TRACK_LENGTH)
    const altitude = Math.round(ALT_START + (ALT_SUMMIT - ALT_START) * progress)
    const won = this.phase === "won"
    const score = altitude - ALT_START + this.commits * 10 + this.bonus + (won ? 500 + Math.round(this.health * 4.5) : 0)
    const ms = TEXT[this.lang].milestones
    const reached = [...ms].reverse().find((m) => progress >= m.at)
    return { altitude, commits: this.commits, time: this.runTime, health: Math.round(this.health), score, won, reached: reached?.name ?? null }
  }

  dispose() {
    this.disposed = true
    this.loop.stop()
    labAudio.stopAmbient()
    this.composer?.dispose()
    disposeScene(this.scene)
    this.ctx.dispose()
  }
}
