// Motor del Sprint de entrega: reglas, entidades, efectos y cámara.
// React solo dibuja el HUD; aquí vive el estado del juego.
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import {
  GameLoop,
  LAB_COLORS,
  ShakeRig,
  TweenManager,
  createRenderer,
  createRng,
  damp,
  disposeScene,
  easeOutBack,
  easeOutCubic,
  type Rng,
} from "@/components/lab/engine/core"
import { labAudio } from "@/components/lab/engine/audio"
import {
  BELT_START_Z,
  DIR_ANGLE,
  JUNCTION_Z,
  PAD_POS,
  TOP_Y,
  buildWorld,
  createBugMesh,
  createMaterials,
  createPieces,
  createTaskMesh,
  type Materials,
  type Pieces,
  type World,
} from "./models"
import { BUG_HEX, HOTFIX_HEX, KIND_DIR, KIND_HEX, drawKanban, drawSign, type Dir, type TaskKind } from "./textures"

export const SPRINT_SECONDS = 60
const MAX_STABILITY = 3
const LASER_COOLDOWN = 0.85
const CHUTE_SPEED = 6.5
const MIN_GAP = 1.5
const ITEM_SCALE = 1.15

export type SprintHud = {
  time: number
  score: number
  mult: number
  stability: number
  laser: number
  dir: Dir
  urgent: boolean
}

export type SprintEventCode = "combo" | "regression" | "escaped" | "hotfix" | "firstBug" | "lastTen" | "breather"
export type SprintEvent = { code: SprintEventCode; value?: number }

export type SprintResult = {
  reason: "time" | "crash"
  score: number
  delivered: number
  wrong: number
  escaped: number
  squashed: number
  maxMult: number
  maxStreak: number
  accuracy: number
}

type Callbacks = {
  onHud: (hud: SprintHud) => void
  onEvent: (e: SprintEvent) => void
  onEnd: (r: SprintResult) => void
  onAutoPause: () => void
}

type Mode = "attract" | "play" | "ending" | "over"

type TaskMesh = ReturnType<typeof createTaskMesh>
type BugMesh = ReturnType<typeof createBugMesh>

type Item = {
  id: number
  kind: TaskKind | "bug"
  hotfix: boolean
  task?: TaskMesh
  bug?: BugMesh
  root: THREE.Group
  active: boolean
  state: "belt" | "chute" | "resolved"
  z: number
  dir: Dir
  s: number
  phase: number
}

const DIRS: Dir[] = ["left", "center", "right"]
const SIGN_LABELS = {
  es: { left: "WEB", center: "MÓVIL", right: "CLOUD", portal: "BACKLOG" },
  en: { left: "WEB", center: "MOBILE", right: "CLOUD", portal: "BACKLOG" },
}
const SIGN_KEYS: Record<Dir, string> = { left: "←", center: "↓", right: "→" }

export class SprintEngine {
  private readonly gfx: ReturnType<typeof createRenderer>
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)
  private composer: EffectComposer | null = null
  private readonly loop: GameLoop
  private readonly tweens = new TweenManager()
  private readonly shake = new ShakeRig()
  private readonly mats: Materials
  private readonly pieces: Pieces
  private readonly world: World
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2()
  private rng: Rng
  private readonly fxRng = createRng(7)

  // estado
  private mode: Mode = "attract"
  private items: Item[] = []
  private nextId = 1
  private timeLeft = SPRINT_SECONDS
  private elapsedPlay = 0
  private spawnTimer = 0.6
  private lastSpawned: Item | null = null
  private dir: Dir = "center"
  private score = 0
  private streak = 0
  private maxStreak = 0
  private mult = 1
  private maxMult = 1
  private stability = MAX_STABILITY
  private delivered = 0
  private wrong = 0
  private escaped = 0
  private squashed = 0
  private laserCd = 0
  private beltSpeed = 1.2
  private timeScale = 1
  private hitstop = 0
  private endTimer = 0
  private firstBugShown = false
  private lastTenShown = false
  private lastTick = 99
  private breatherShown = new Set<number>()
  private paused = false
  private ledTimer = 0
  private lastHud = ""

  // cámara
  private readonly camTarget = new THREE.Vector3(0, 0, -3.1)
  private readonly camBase = new THREE.Vector3()
  private sway = 0

  // efectos
  private readonly particles: THREE.InstancedMesh
  private readonly pPos: Float32Array
  private readonly pVel: Float32Array
  private readonly pLife: Float32Array
  private readonly pMax: Float32Array
  private readonly pSize: Float32Array
  private pCursor = 0
  private pActive = 0
  private readonly rings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = []
  private ringCursor = 0
  private readonly nextRing: THREE.Mesh
  private readonly laserBeam: THREE.Mesh
  private readonly laserMat: THREE.MeshBasicMaterial
  private readonly wrongMat: THREE.MeshStandardMaterial

  // reutilizables
  private readonly v1 = new THREE.Vector3()
  private readonly v2 = new THREE.Vector3()
  private readonly m4 = new THREE.Matrix4()
  private readonly q1 = new THREE.Quaternion()
  private readonly c1 = new THREE.Color()
  private readonly up = new THREE.Vector3(0, 1, 0)
  private readonly hitTargets: THREE.Object3D[] = []

  private padBase: Record<Dir, { rim: number; light: number; screen: number }>
  private reduced: boolean
  private lang: "es" | "en"
  private overlay: HTMLElement
  private container: HTMLElement
  private size = { w: 1, h: 1 }
  private pads = { top: 72, bottom: 40 }

  constructor(
    container: HTMLElement,
    overlay: HTMLElement,
    private readonly cb: Callbacks,
    opts: { lang: "es" | "en"; reduced: boolean },
  ) {
    this.container = container
    this.overlay = overlay
    this.lang = opts.lang
    this.reduced = opts.reduced
    this.shake.enabled = !opts.reduced
    this.rng = createRng(Date.now() & 0xffff)

    this.gfx = createRenderer(container)
    const { renderer, coarse } = this.gfx
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMappingExposure = 1.3

    this.scene.background = new THREE.Color(LAB_COLORS.night)
    this.scene.fog = new THREE.Fog(LAB_COLORS.night, 26, 60)

    // Luces: llave fría, relleno del cielo nocturno y contraluz azul
    this.scene.add(new THREE.HemisphereLight(0x9fb8ff, 0x1a2236, 1.05))
    const key = new THREE.DirectionalLight(0xe4ecff, 2.1)
    key.position.set(5, 13, 7)
    key.castShadow = true
    key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048)
    key.shadow.camera.left = -9
    key.shadow.camera.right = 9
    key.shadow.camera.top = 12
    key.shadow.camera.bottom = -9
    key.shadow.camera.far = 40
    key.shadow.bias = -0.0005
    key.shadow.normalBias = 0.02
    key.target.position.set(0, 0, -3)
    this.scene.add(key, key.target)
    const rim = new THREE.DirectionalLight(LAB_COLORS.accent, 1.2)
    rim.position.set(-6, 5, -14)
    this.scene.add(rim)

    this.mats = createMaterials()
    this.pieces = createPieces()
    const L = SIGN_LABELS[this.lang]
    this.world = buildWorld(this.mats, { left: L.left, center: L.center, right: L.right }, L.portal, coarse, this.lang)
    this.scene.add(this.world.root)
    this.padBase = {
      left: { rim: 0.9, light: this.world.padLights.left.intensity, screen: 0.65 },
      center: { rim: 0.9, light: this.world.padLights.center.intensity, screen: 0.65 },
      right: { rim: 0.9, light: this.world.padLights.right.intensity, screen: 0.2 },
    }
    this.wrongMat = new THREE.MeshStandardMaterial({ color: 0x3a0a12, emissive: BUG_HEX, emissiveIntensity: 1.4, roughness: 0.5 })

    // Partículas instanciadas
    const N = this.reduced ? 90 : 240
    this.particles = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.09, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
      N,
    )
    this.particles.frustumCulled = false
    this.pPos = new Float32Array(N * 3)
    this.pVel = new Float32Array(N * 3)
    this.pLife = new Float32Array(N)
    this.pMax = new Float32Array(N)
    this.pSize = new Float32Array(N)
    this.m4.makeScale(0, 0, 0)
    for (let i = 0; i < N; i += 1) {
      this.particles.setMatrixAt(i, this.m4)
      this.particles.setColorAt(i, this.c1.set(0xffffff))
    }
    this.scene.add(this.particles)

    // Ondas de impacto
    const ringGeo = new THREE.RingGeometry(0.62, 0.74, 48)
    for (let i = 0; i < 8; i += 1) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })
      const mesh = new THREE.Mesh(ringGeo, mat)
      mesh.rotation.x = -Math.PI / 2
      mesh.visible = false
      this.scene.add(mesh)
      this.rings.push({ mesh, mat })
    }

    // Anillo que marca la próxima tarea
    this.nextRing = new THREE.Mesh(
      new THREE.RingGeometry(0.74, 0.86, 48),
      new THREE.MeshBasicMaterial({ color: 0xdce6ff, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }),
    )
    this.nextRing.rotation.x = -Math.PI / 2
    this.nextRing.visible = false
    this.scene.add(this.nextRing)

    // Rayo de la torreta QA
    this.laserMat = new THREE.MeshBasicMaterial({ color: 0xff8a95, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
    this.laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8, 1, true), this.laserMat)
    this.laserBeam.visible = false
    this.scene.add(this.laserBeam)

    for (const d of DIRS) this.hitTargets.push(this.world.dockHit[d])

    // Bloom sutil solo en escritorio
    if (!coarse) {
      this.composer = new EffectComposer(renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.55, 0.86))
      this.composer.addPass(new OutputPass())
    }

    this.gfx.onResize((w, h) => {
      this.size = { w, h }
      this.composer?.setSize(w, h)
      this.layout()
    })
    this.setDirVisual(this.dir, true)

    renderer.domElement.addEventListener("pointerdown", this.onPointerDown)
    document.addEventListener("visibilitychange", this.onVisibility)

    this.loop = new GameLoop((dt) => this.tick(dt))
    this.loop.start()
  }

  // ---------- API pública ----------
  setPads(top: number, bottom: number) {
    this.pads = { top, bottom }
    this.layout()
  }

  setLang(lang: "es" | "en") {
    if (lang === this.lang) return
    this.lang = lang
    const L = SIGN_LABELS[lang]
    const kinds: Record<Dir, TaskKind> = { left: "web", center: "movil", right: "cloud" }
    for (const d of DIRS) {
      drawSign(this.world.signs[d].canvas, kinds[d], L[d], SIGN_KEYS[d])
      this.world.signs[d].texture.needsUpdate = true
    }
    for (const k of this.world.kanbans) {
      drawKanban(k.canvas, lang, k.seed)
      k.texture.needsUpdate = true
    }
  }

  start() {
    for (const it of this.items) this.release(it)
    this.items = []
    this.lastSpawned = null
    this.rng = createRng(Date.now() & 0xffff)
    this.mode = "play"
    this.timeLeft = SPRINT_SECONDS
    this.elapsedPlay = 0
    this.spawnTimer = 0.7
    this.score = 0
    this.streak = 0
    this.maxStreak = 0
    this.mult = 1
    this.maxMult = 1
    this.stability = MAX_STABILITY
    this.delivered = 0
    this.wrong = 0
    this.escaped = 0
    this.squashed = 0
    this.laserCd = 0
    this.timeScale = 1
    this.hitstop = 0
    this.firstBugShown = false
    this.lastTenShown = false
    this.lastTick = 99
    this.breatherShown.clear()
    this.shake.reset()
    this.setPaused(false)
    this.setDir("center", true)
    labAudio.play("whoosh")
    this.emitHud(true)
  }

  setPaused(paused: boolean) {
    if (paused === this.paused) return
    this.paused = paused
    if (paused) {
      this.loop.stop()
      this.render()
    } else {
      this.loop.start()
    }
  }

  setDir(dir: Dir, silent = false) {
    if (this.mode !== "play" && !silent) return
    if (dir === this.dir) {
      if (!silent) {
        // pequeño respingo para confirmar la tecla
        const d = this.world.diverter
        this.tweens.tween(0.16, (t) => (d.position.y = TOP_Y + Math.sin(t * Math.PI) * 0.05))
      }
      return
    }
    this.dir = dir
    this.setDirVisual(dir, false)
    if (!silent) labAudio.play("click", this.fxRng.next())
    this.emitHud(true)
  }

  fireLaser() {
    if (this.mode !== "play" || this.laserCd > 0) return
    let target: Item | null = null
    for (const it of this.items) {
      if (it.active && it.kind === "bug" && it.state === "belt" && (!target || it.z > target.z)) target = it
    }
    if (!target) {
      labAudio.play("error")
      return
    }
    this.laserCd = LASER_COOLDOWN
    // rayo desde la boca de la torreta
    const from = this.world.turret.muzzle.getWorldPosition(this.v1)
    const to = this.v2.copy(target.root.position).setY(TOP_Y + 0.35)
    const len = from.distanceTo(to)
    this.laserBeam.position.copy(from).add(to).multiplyScalar(0.5)
    this.q1.setFromUnitVectors(this.up, to.clone().sub(from).normalize())
    this.laserBeam.quaternion.copy(this.q1)
    this.laserBeam.scale.set(1, len, 1)
    this.laserBeam.visible = true
    this.tweens.tween(0.22, (t) => (this.laserMat.opacity = 1 - t), { onComplete: () => (this.laserBeam.visible = false) })
    this.squash(target)
  }

  /** Para pruebas automatizadas: tipo de la próxima tarea y si hay un bug en la banda. */
  peek() {
    const next = this.frontTask()
    const bug = this.items.some((it) => it.active && it.kind === "bug" && it.state === "belt")
    return { next: next ? (next.kind as TaskKind) : null, nextZ: next?.z ?? null, bug, mode: this.mode }
  }

  dispose() {
    this.loop.stop()
    this.gfx.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.overlay.replaceChildren()
    disposeScene(this.scene)
    this.composer?.dispose()
    this.gfx.dispose()
  }

  // ---------- Entrada ----------
  private onPointerDown = (e: PointerEvent) => {
    if (this.mode !== "play" || this.paused) return
    const rect = this.gfx.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    // primero los bugs (tocar es aplastar)
    let best: Item | null = null
    let bestD = Infinity
    for (const it of this.items) {
      if (!it.active || it.kind !== "bug" || it.state !== "belt" || !it.bug) continue
      const hit = this.raycaster.intersectObject(it.bug.proxy, false)[0]
      if (hit && hit.distance < bestD) {
        best = it
        bestD = hit.distance
      }
    }
    if (best) {
      this.squash(best)
      return
    }
    const dock = this.raycaster.intersectObjects(this.hitTargets, false)[0]
    if (dock) this.setDir(dock.object.userData.dir as Dir)
  }

  private onVisibility = () => {
    if (document.hidden && this.mode === "play" && !this.paused) this.cb.onAutoPause()
  }

  // ---------- Bucle ----------
  private tick(dt: number) {
    // hitstop: el mundo se frena, la cámara y los efectos siguen vivos
    if (this.hitstop > 0) {
      this.hitstop -= dt
      if (this.hitstop <= 0) this.timeScale = this.mode === "ending" ? 0.35 : 1
    }
    const gdt = dt * this.timeScale

    if (this.mode === "play") this.updatePlay(gdt)
    else if (this.mode === "attract") this.updateAttract(gdt)
    else if (this.mode === "ending") {
      this.endTimer -= dt
      if (this.endTimer <= 0) this.finish()
    }

    this.updateItems(gdt)
    this.updateWorld(dt, gdt)
    this.updateParticles(dt)
    this.tweens.update(dt)
    this.updateCamera(dt)
    this.render()
    if (this.mode === "play") this.emitHud(false)
  }

  private updatePlay(dt: number) {
    this.elapsedPlay += dt
    this.timeLeft = Math.max(0, this.timeLeft - dt)
    this.laserCd = Math.max(0, this.laserCd - dt)
    const p = this.elapsedPlay / SPRINT_SECONDS
    this.beltSpeed = 1.55 + 2.1 * p * p + 0.5 * p

    // respiros a mitad de sprint
    const breathing = (this.elapsedPlay > 19 && this.elapsedPlay < 21.5) || (this.elapsedPlay > 39 && this.elapsedPlay < 41.5)
    const bucket = this.elapsedPlay > 39 ? 2 : 1
    if (breathing && !this.breatherShown.has(bucket)) {
      this.breatherShown.add(bucket)
      this.cb.onEvent({ code: "breather" })
    }

    this.spawnTimer -= dt
    const gapOk = !this.lastSpawned || !this.lastSpawned.active || this.lastSpawned.state !== "belt" || this.lastSpawned.z > BELT_START_Z + MIN_GAP
    if (this.spawnTimer <= 0 && gapOk && !breathing) {
      this.spawnNext(p)
      const interval = 1.75 - 1.0 * p
      this.spawnTimer = interval * (0.85 + this.rng.next() * 0.3)
    }

    if (!this.lastTenShown && this.timeLeft <= 10) {
      this.lastTenShown = true
      this.cb.onEvent({ code: "lastTen" })
    }
    const sec = Math.ceil(this.timeLeft)
    if (sec <= 5 && sec !== this.lastTick && sec > 0) {
      this.lastTick = sec
      labAudio.play("click", 0.9)
    }

    if (this.timeLeft <= 0) this.beginEnd("time")
  }

  private updateAttract(dt: number) {
    this.beltSpeed = 1.3
    this.spawnTimer -= dt
    const gapOk = !this.lastSpawned || !this.lastSpawned.active || this.lastSpawned.state !== "belt" || this.lastSpawned.z > BELT_START_Z + 2.2
    if (this.spawnTimer <= 0 && gapOk) {
      const kind = this.fxRng.pick(["web", "movil", "cloud"] as const)
      this.spawn(kind, false)
      this.spawnTimer = 1.6
    }
    // piloto automático: orienta el desvío hacia la próxima tarea
    const next = this.frontTask()
    if (next && next.z > JUNCTION_Z - 1.6) {
      const want = KIND_DIR[next.kind as TaskKind]
      if (want !== this.dir) {
        this.dir = want
        this.setDirVisual(want, false)
      }
    }
  }

  private spawnNext(p: number) {
    const t = this.elapsedPlay
    let bugChance = t < 6 ? 0 : 0.12 + 0.16 * p
    if (!this.firstBugShown && t > 6.5) bugChance = 1
    if (this.rng.chance(bugChance)) {
      this.spawn("bug", false)
      if (!this.firstBugShown) {
        this.firstBugShown = true
        this.cb.onEvent({ code: "firstBug" })
      }
      return
    }
    const kind = this.rng.pick(["web", "movil", "cloud"] as const)
    const hotfix = t > 12 && this.rng.chance(0.08)
    this.spawn(kind, hotfix)
  }

  // ---------- Entidades ----------
  private pool: Record<TaskKind | "bug", Item[]> = { web: [], movil: [], cloud: [], bug: [] }

  private spawn(kind: TaskKind | "bug", hotfix: boolean) {
    let it = this.pool[kind].pop()
    if (!it) {
      if (kind === "bug") {
        const bug = createBugMesh(this.pieces, this.mats)
        it = { id: 0, kind, hotfix: false, bug, root: bug.root, active: false, state: "belt", z: 0, dir: "center", s: 0, phase: 0 }
      } else {
        const task = createTaskMesh(kind, this.pieces, this.mats)
        it = { id: 0, kind, hotfix: false, task, root: task.root, active: false, state: "belt", z: 0, dir: "center", s: 0, phase: 0 }
      }
      this.scene.add(it.root)
    }
    it.id = this.nextId++
    it.hotfix = hotfix
    it.active = true
    it.state = "belt"
    it.z = BELT_START_Z + 0.2
    it.s = 0
    it.phase = this.fxRng.next() * 10
    it.root.visible = true
    it.root.position.set(0, TOP_Y, it.z)
    it.root.rotation.set(0, 0, 0)
    it.root.scale.setScalar(ITEM_SCALE)
    if (it.task) {
      const k = kind as TaskKind
      it.task.body.material = hotfix ? this.mats.hotfix : this.mats.task[k]
      it.task.decal.material = hotfix ? this.pieces.hotfixDecals[k] : this.pieces.decals[k]
      it.task.ring.visible = hotfix
      it.task.lift.position.set(0, 0, 0)
      it.task.lift.scale.setScalar(1)
      it.task.lift.rotation.set(0, 0, 0)
    }
    if (it.bug) {
      it.bug.lift.scale.setScalar(1)
      it.bug.lift.position.set(0, 0, 0)
      it.bug.shadow.visible = true
    }
    // salida del portal: crece desde la luz
    const lift = it.task?.lift ?? it.bug!.lift
    lift.scale.setScalar(0.01)
    this.tweens.tween(0.32, (v) => lift.scale.setScalar(Math.max(0.01, v)), { easing: easeOutBack })
    this.items.push(it)
    this.lastSpawned = it
  }

  private release(it: Item) {
    it.active = false
    it.root.visible = false
    this.pool[it.kind].push(it)
  }

  private frontTask(): Item | null {
    let front: Item | null = null
    for (const it of this.items) {
      if (it.active && it.kind !== "bug" && it.state === "belt" && (!front || it.z > front.z)) front = it
    }
    return front
  }

  private updateItems(dt: number) {
    const speed = this.beltSpeed
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const it = this.items[i]
      if (!it.active) {
        this.items.splice(i, 1)
        continue
      }
      it.phase += dt
      if (it.state === "belt") {
        if (it.kind === "bug") {
          it.z += speed * 1.08 * dt
          const x = Math.sin(it.phase * 2.4) * 0.34
          const dx = Math.cos(it.phase * 2.4) * 0.34 * 2.4
          it.root.position.set(x, TOP_Y, it.z)
          it.root.rotation.y = Math.atan2(dx, speed * 1.08)
          const legs = it.bug!.legs
          for (let l = 0; l < legs.length; l += 1) legs[l].rotation.y = Math.sin(it.phase * 20 + l * 1.7) * 0.45
          it.bug!.lift.position.y = Math.abs(Math.sin(it.phase * 20)) * 0.025
          if (it.z >= JUNCTION_Z) this.bugEscaped(it)
        } else {
          it.z += speed * dt
          it.root.position.set(0, TOP_Y, it.z)
          if (it.task!.ring.visible) it.task!.ring.rotation.z += dt * 3
          it.task!.lift.position.y = Math.sin(it.phase * 3) * 0.02
          if (it.z >= JUNCTION_Z) {
            it.state = "chute"
            it.dir = this.dir
            it.s = 0
            labAudio.play("whoosh", this.fxRng.next())
          }
        }
      } else if (it.state === "chute") {
        it.s += CHUTE_SPEED * dt
        const pad = PAD_POS[it.dir]
        const leg1 = -JUNCTION_Z
        const leg2 = pad.length()
        if (it.s < leg1) {
          it.root.position.set(0, TOP_Y, JUNCTION_Z + it.s)
        } else {
          const k = Math.min(1, (it.s - leg1) / leg2)
          it.root.position.set(pad.x * k, TOP_Y - 0.05 * k, pad.z * k)
          it.root.rotation.y = damp(it.root.rotation.y, DIR_ANGLE[it.dir] * 0.5, 10, dt)
        }
        if (it.s >= leg1 + leg2) this.resolve(it)
      }
    }
  }

  private resolve(it: Item) {
    it.state = "resolved"
    const kind = it.kind as TaskKind
    const dir = it.dir
    const pos = PAD_POS[dir]
    if (KIND_DIR[kind] === dir) {
      this.delivered += this.mode === "play" ? 1 : 0
      const color = it.hotfix ? HOTFIX_HEX : KIND_HEX[kind]
      this.flashDock(dir, color)
      this.burst(this.v1.copy(pos).setY(0.5), color, it.hotfix ? 34 : 20, 4.5)
      this.ring(pos, color, it.hotfix ? 3.4 : 2.4)
      if (this.mode === "play") {
        this.streak += 1
        this.maxStreak = Math.max(this.maxStreak, this.streak)
        const newMult = Math.min(4, 1 + Math.floor(this.streak / 3))
        if (newMult > this.mult) {
          this.mult = newMult
          this.maxMult = Math.max(this.maxMult, newMult)
          this.cb.onEvent({ code: "combo", value: newMult })
          labAudio.play("combo", this.fxRng.next())
        }
        const pts = (it.hotfix ? 250 : 100) * this.mult
        this.score += pts
        this.floatText(this.v1.copy(pos).setY(1.2), `+${pts}`, color)
        if (it.hotfix) this.cb.onEvent({ code: "hotfix", value: pts })
        labAudio.play(it.hotfix ? "milestone" : "pickup", this.fxRng.next())
        this.shake.add(it.hotfix ? 0.22 : 0.08)
      }
      // la tarea "sube" al dispositivo
      const from = it.root.position.clone()
      const to = this.world.deviceTargets[dir]
      const lift = it.task!.lift
      this.tweens.tween(
        0.36,
        (t) => {
          it.root.position.lerpVectors(from, to, t)
          it.root.position.y += Math.sin(t * Math.PI) * 0.9
          lift.scale.setScalar(1 - 0.85 * t)
          lift.rotation.y = t * 2.5
        },
        { easing: easeOutCubic, onComplete: () => this.release(it) },
      )
    } else {
      // regresión: la tarea llega al muelle equivocado
      it.task!.body.material = this.wrongMat
      this.flashDock(dir, BUG_HEX)
      if (this.mode === "play") {
        this.wrong += 1
        this.loseStability("regression")
      }
      const lift = it.task!.lift
      this.tweens.tween(
        0.28,
        (t) => {
          lift.position.y = Math.sin(t * Math.PI) * 0.5
          lift.rotation.z = t * 0.8
        },
        {
          onComplete: () => {
            this.burst(this.v1.copy(it.root.position).setY(0.6), BUG_HEX, 26, 5)
            this.ring(it.root.position, BUG_HEX, 2.2)
            this.release(it)
          },
        },
      )
    }
  }

  private squash(it: Item) {
    if (it.state !== "belt") return
    it.state = "resolved"
    this.squashed += 1
    this.score += 25
    const pos = it.root.position
    this.floatText(this.v1.copy(pos).setY(1), "+25", "#FF8A95")
    this.burst(this.v1.copy(pos).setY(0.45), "#FF7A45", 18, 3.8)
    this.ring(pos, BUG_HEX, 1.6)
    this.shake.add(0.14)
    labAudio.play("squash", this.fxRng.next())
    const lift = it.bug!.lift
    this.tweens.tween(
      0.14,
      (t) => {
        lift.scale.set(1 + 0.35 * t, 1 - 0.85 * t, 1 + 0.35 * t)
      },
      {
        onComplete: () =>
          this.tweens.tween(0.25, (t) => lift.scale.setScalar(Math.max(0.001, (1 - t) * 1.3)), {
            delay: 0.15,
            onComplete: () => this.release(it),
          }),
      },
    )
    this.emitHud(true)
  }

  private bugEscaped(it: Item) {
    it.state = "resolved"
    if (this.mode === "play") {
      this.escaped += 1
      this.loseStability("escaped")
    }
    const tm = this.world.turntableMat
    tm.emissive.set(BUG_HEX)
    this.tweens.tween(0.6, (t) => (tm.emissiveIntensity = 1.6 * (1 - t)))
    const lift = it.bug!.lift
    const from = it.root.position.clone()
    this.tweens.tween(
      0.22,
      (t) => {
        it.root.position.lerpVectors(from, this.v2.set(0, TOP_Y, 0), t)
        lift.scale.setScalar(1 + t * 0.3)
      },
      {
        onComplete: () => {
          this.burst(this.v1.set(0, 0.6, 0), BUG_HEX, 30, 5.5)
          this.ring(this.v1.set(0, 0, 0), BUG_HEX, 3)
          this.release(it)
        },
      },
    )
  }

  private loseStability(code: "regression" | "escaped") {
    this.stability = Math.max(0, this.stability - 1)
    this.streak = 0
    this.mult = 1
    this.shake.add(0.55)
    this.hitstop = 0.14
    this.timeScale = 0.12
    labAudio.play("hit", this.fxRng.next())
    this.cb.onEvent({ code })
    this.emitHud(true)
    if (this.stability <= 0) this.beginEnd("crash")
  }

  private endReason: "time" | "crash" = "time"

  private beginEnd(reason: "time" | "crash") {
    if (this.mode !== "play") return
    this.mode = "ending"
    this.endReason = reason
    this.endTimer = 1.1
    this.timeScale = 0.35
    this.nextRing.visible = false
    labAudio.play(reason === "time" ? "win" : "lose")
    this.emitHud(true)
  }

  private finish() {
    this.mode = "over"
    this.timeScale = 1
    const routed = this.delivered + this.wrong
    this.cb.onEnd({
      reason: this.endReason,
      score: this.score,
      delivered: this.delivered,
      wrong: this.wrong,
      escaped: this.escaped,
      squashed: this.squashed,
      maxMult: this.maxMult,
      maxStreak: this.maxStreak,
      accuracy: routed ? Math.round((this.delivered / routed) * 100) : 0,
    })
    // de vuelta al modo vitrina detrás de la tarjeta final
    this.mode = "attract"
    this.spawnTimer = 1.2
  }

  // ---------- Mundo vivo ----------
  private updateWorld(dt: number, gdt: number) {
    const w = this.world
    w.beltTex.offset.y += (this.beltSpeed * gdt) / 1.4
    for (const t of w.chuteTexes) t.offset.y += (CHUTE_SPEED * 0.5 * gdt) / 1.4
    const urgent = this.mode === "play" && this.timeLeft <= 10
    w.portalRing.rotation.z -= dt * (1.2 + this.beltSpeed * 0.6)
    const pulse = 0.75 + Math.sin(performance.now() * 0.004) * 0.15
    w.portalGlowMat.opacity = pulse
    w.portalGlowMat.color.lerp(this.c1.set(urgent ? 0xffb37a : 0xffffff), 1 - Math.exp(-3 * dt))
    w.portalGlow.scale.setScalar(1 + Math.sin(performance.now() * 0.003) * 0.04)

    // LEDs del rack parpadean como un servidor real
    this.ledTimer -= dt
    if (this.ledTimer <= 0) {
      this.ledTimer = 0.12
      for (let n = 0; n < 4; n += 1) {
        const i = Math.floor(this.fxRng.next() * 24)
        const r = this.fxRng.next()
        w.rackLeds.setColorAt(i, this.c1.set(r < 0.18 ? 0x0b0f1a : r < 0.4 ? 0x4f8cff : 0x34d399))
      }
      if (w.rackLeds.instanceColor) w.rackLeds.instanceColor.needsUpdate = true
    }

    // la torreta sigue al bug más adelantado
    let target: Item | null = null
    for (const it of this.items) if (it.active && it.kind === "bug" && it.state === "belt" && (!target || it.z > target.z)) target = it
    const head = w.turret.head
    const tx = target ? target.root.position.x - w.turret.root.position.x : -1
    const tz = target ? target.root.position.z - w.turret.root.position.z : 2
    head.rotation.y = damp(head.rotation.y, Math.atan2(tx, tz), 12, dt)

    // anillo sobre la próxima tarea
    const next = this.mode === "play" ? this.frontTask() : null
    if (next) {
      this.nextRing.visible = true
      this.nextRing.position.set(0, TOP_Y + 0.012, next.z)
      const s = 1 + Math.sin(performance.now() * 0.012) * 0.06
      this.nextRing.scale.setScalar(s)
      const mat = this.nextRing.material as THREE.MeshBasicMaterial
      mat.color.set(next.hotfix ? HOTFIX_HEX : KIND_HEX[next.kind as TaskKind])
    } else {
      this.nextRing.visible = false
    }
  }

  private setDirVisual(dir: Dir, instant: boolean) {
    const d = this.world.diverter
    const target = DIR_ANGLE[dir]
    if (instant) d.rotation.y = target
    else {
      const from = d.rotation.y
      this.tweens.tween(0.2, (t) => (d.rotation.y = from + (target - from) * t), { easing: easeOutBack })
    }
    for (const k of DIRS) {
      const lamp = this.world.chuteLamps[k]
      const goal = k === dir ? 2.4 : 0.18
      if (instant) lamp.emissiveIntensity = goal
      else {
        const from = lamp.emissiveIntensity
        this.tweens.tween(0.18, (t) => (lamp.emissiveIntensity = from + (goal - from) * t))
      }
    }
  }

  private flashDock(dir: Dir, color: string) {
    const rim = this.world.padRims[dir]
    const light = this.world.padLights[dir]
    const screen = this.world.screens[dir]
    const base = this.padBase[dir]
    const kindColor = new THREE.Color(KIND_HEX[DIRS_TO_KIND[dir]])
    const flash = new THREE.Color(color)
    this.tweens.tween(0.55, (t) => {
      rim.emissive.copy(flash).lerp(kindColor, t)
      rim.emissiveIntensity = 4 + (base.rim - 4) * t
      light.intensity = base.light + 7 * (1 - t)
      screen.emissiveIntensity = base.screen + 1.2 * (1 - t)
    })
  }

  // ---------- Efectos ----------
  private burst(pos: THREE.Vector3, color: string, count: number, speed: number) {
    const n = this.reduced ? Math.ceil(count / 3) : count
    this.c1.set(color)
    const N = this.pLife.length
    for (let k = 0; k < n; k += 1) {
      const i = this.pCursor
      this.pCursor = (this.pCursor + 1) % N
      const a = this.fxRng.next() * Math.PI * 2
      const up = 0.6 + this.fxRng.next() * 1.2
      const sp = speed * (0.4 + this.fxRng.next() * 0.8)
      this.pPos[i * 3] = pos.x
      this.pPos[i * 3 + 1] = pos.y
      this.pPos[i * 3 + 2] = pos.z
      this.pVel[i * 3] = Math.cos(a) * sp
      this.pVel[i * 3 + 1] = up * sp * 0.8
      this.pVel[i * 3 + 2] = Math.sin(a) * sp
      this.pMax[i] = this.pLife[i] = 0.45 + this.fxRng.next() * 0.45
      this.pSize[i] = 0.7 + this.fxRng.next() * 0.9
      this.particles.setColorAt(i, this.c1)
    }
    if (this.particles.instanceColor) this.particles.instanceColor.needsUpdate = true
    this.pActive = this.pLife.length
  }

  private updateParticles(dt: number) {
    if (this.pActive <= 0) return
    let alive = 0
    const N = this.pLife.length
    for (let i = 0; i < N; i += 1) {
      if (this.pLife[i] <= 0) continue
      this.pLife[i] -= dt
      if (this.pLife[i] <= 0) {
        this.m4.makeScale(0, 0, 0)
        this.particles.setMatrixAt(i, this.m4)
        continue
      }
      alive += 1
      this.pVel[i * 3 + 1] -= 11 * dt
      this.pPos[i * 3] += this.pVel[i * 3] * dt
      this.pPos[i * 3 + 1] = Math.max(0.05, this.pPos[i * 3 + 1] + this.pVel[i * 3 + 1] * dt)
      this.pPos[i * 3 + 2] += this.pVel[i * 3 + 2] * dt
      const s = this.pSize[i] * (this.pLife[i] / this.pMax[i])
      this.m4.makeRotationY(this.pLife[i] * 9)
      this.m4.scale(this.v2.set(s, s, s))
      this.m4.setPosition(this.pPos[i * 3], this.pPos[i * 3 + 1], this.pPos[i * 3 + 2])
      this.particles.setMatrixAt(i, this.m4)
    }
    this.particles.instanceMatrix.needsUpdate = true
    this.pActive = alive
  }

  private ring(pos: THREE.Vector3, color: string, scale: number) {
    const r = this.rings[this.ringCursor]
    this.ringCursor = (this.ringCursor + 1) % this.rings.length
    r.mesh.visible = true
    r.mesh.position.set(pos.x, 0.4, pos.z)
    r.mat.color.set(color)
    this.tweens.tween(
      0.5,
      (t) => {
        r.mesh.scale.setScalar(0.4 + scale * t)
        r.mat.opacity = 0.9 * (1 - t)
      },
      { onComplete: () => (r.mesh.visible = false) },
    )
  }

  private floatText(world: THREE.Vector3, text: string, color: string) {
    const p = this.v2.copy(world).project(this.camera)
    const x = (p.x * 0.5 + 0.5) * this.size.w
    const y = (-p.y * 0.5 + 0.5) * this.size.h
    const el = document.createElement("span")
    el.textContent = text
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;color:${color};font-weight:800;font-size:22px;font-variant-numeric:tabular-nums;text-shadow:0 2px 12px rgba(11,15,26,.9);pointer-events:none;white-space:nowrap;`
    this.overlay.appendChild(el)
    const anim = el.animate(
      [
        { transform: "translate(-50%,-50%) translateY(0) scale(0.7)", opacity: 0 },
        { transform: "translate(-50%,-50%) translateY(-10px) scale(1.12)", opacity: 1, offset: 0.2 },
        { transform: "translate(-50%,-50%) translateY(-54px) scale(1)", opacity: 0 },
      ],
      { duration: this.reduced ? 600 : 950, easing: "cubic-bezier(.16,1,.3,1)" },
    )
    anim.onfinish = () => el.remove()
  }

  // ---------- Cámara y render ----------
  private layout() {
    const { w, h } = this.size
    const aspect = w / h
    this.camera.aspect = aspect
    const portrait = aspect < 0.9
    const el = THREE.MathUtils.degToRad(portrait ? 60 : 43)
    const halfW = portrait ? 4.9 : 6.6
    const halfV = portrait ? 8.3 : 6.1
    const avail = Math.max(0.4, (h - this.pads.top - this.pads.bottom) / h)
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const dist = Math.max(halfV / (tanV * avail), halfW / (tanV * aspect)) + 0.6
    this.camTarget.set(0, 0, portrait ? -3.1 : -3.0)
    this.camBase.set(0, Math.sin(el) * dist, Math.cos(el) * dist).add(this.camTarget)
    this.camera.setViewOffset(w, h, 0, (this.pads.bottom - this.pads.top) / 2, w, h)
    this.camera.updateProjectionMatrix()
  }

  private updateCamera(dt: number) {
    this.sway += dt
    const swayAmt = this.mode === "attract" && !this.reduced ? 1 : 0.15
    this.camera.position.copy(this.camBase)
    this.camera.position.x += Math.sin(this.sway * 0.25) * 0.6 * swayAmt
    this.camera.lookAt(this.camTarget)
    this.shake.apply(this.camera, dt, 0.35, 0.03)
  }

  private render() {
    if (this.composer) this.composer.render()
    else this.gfx.renderer.render(this.scene, this.camera)
  }

  private emitHud(force: boolean) {
    const hud: SprintHud = {
      time: Math.ceil(this.timeLeft * 10) / 10,
      score: this.score,
      mult: this.mult,
      stability: this.stability,
      laser: this.laserCd > 0 ? 1 - this.laserCd / LASER_COOLDOWN : 1,
      dir: this.dir,
      urgent: this.timeLeft <= 10,
    }
    const key = `${hud.time}|${hud.score}|${hud.mult}|${hud.stability}|${Math.round(hud.laser * 10)}|${hud.dir}`
    if (!force && key === this.lastHud) return
    this.lastHud = key
    this.cb.onHud(hud)
  }
}

const DIRS_TO_KIND: Record<Dir, TaskKind> = { left: "web", center: "movil", right: "cloud" }
