// Escena 3D de "Arma tu app": isla flotante, dispositivo central, módulos en
// ranuras hexagonales unidos por líneas de datos, partículas y celebración final.
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import {
  GameLoop,
  TweenManager,
  createRenderer,
  createRng,
  damp,
  disposeScene,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  LAB_COLORS,
} from "@/components/lab/engine/core"
import { labAudio } from "@/components/lab/engine/audio"
import { RIDGE_POINTS, SUMMIT } from "@/components/brand/ridge"
import { MODULES, type Build, type ModuleId, type PlatformId } from "./catalog"
import {
  createBackdrop,
  createHologram,
  createIsland,
  createLaptop,
  createMaterials,
  createModule,
  createPad,
  createPhone,
  createScreen,
  type Model,
} from "./models"

const SLOT_RADIUS = 3.55
const MODULE_SCALE = 1.3
const CORE_Y = 0.55

type Slot = {
  id: ModuleId
  index: number
  group: THREE.Group
  holder: THREE.Group
  hover: THREE.Group
  ringMat: THREE.MeshStandardMaterial
  proxy: THREE.Mesh
  model: Model | null
  line: THREE.Mesh | null
  lineMat: THREE.ShaderMaterial | null
  active: boolean
  token: number
}

export type SceneCallbacks = {
  onHover: (id: ModuleId | null, active: boolean) => void
  onToggle: (id: ModuleId) => void
  onFirstDrag: () => void
}

// Línea de datos: tubo con pulsos que viajan del núcleo al módulo.
function flowMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(LAB_COLORS.accent) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        if (vUv.x > uProgress) discard;
        float f = fract(vUv.x * 5.0 - uTime * 0.9);
        float pulse = smoothstep(0.0, 0.08, f) * (1.0 - smoothstep(0.08, 0.32, f));
        float head = smoothstep(uProgress - 0.06, uProgress, vUv.x) * step(uProgress, 0.999);
        float a = 0.22 + pulse * 0.9 + head;
        gl_FragColor = vec4(uColor * (0.7 + pulse * 1.6 + head * 2.0), a);
      }
    `,
  })
}

// Partículas reciclables para polvo, chispas y celebración.
class Bursts {
  readonly points: THREE.Points
  private pos: Float32Array
  private col: Float32Array
  private vel: Float32Array
  private life: Float32Array
  private base: Float32Array
  private cursor = 0
  private readonly max = 600

  constructor() {
    this.pos = new Float32Array(this.max * 3)
    this.col = new Float32Array(this.max * 3)
    this.vel = new Float32Array(this.max * 3)
    this.life = new Float32Array(this.max)
    this.base = new Float32Array(this.max * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3))
    geo.setAttribute("color", new THREE.BufferAttribute(this.col, 3))
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.11,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    )
    this.points.frustumCulled = false
  }

  emit(origin: THREE.Vector3, count: number, colors: THREE.Color[], speed: number, up: number, rng: () => number) {
    for (let n = 0; n < count; n += 1) {
      const i = this.cursor
      this.cursor = (this.cursor + 1) % this.max
      const a = rng() * Math.PI * 2
      const s = speed * (0.4 + rng() * 0.8)
      this.pos[i * 3] = origin.x
      this.pos[i * 3 + 1] = origin.y
      this.pos[i * 3 + 2] = origin.z
      this.vel[i * 3] = Math.cos(a) * s
      this.vel[i * 3 + 1] = up * (0.5 + rng())
      this.vel[i * 3 + 2] = Math.sin(a) * s
      this.life[i] = 0.7 + rng() * 0.9
      const c = colors[Math.floor(rng() * colors.length)]
      this.base[i * 3] = c.r
      this.base[i * 3 + 1] = c.g
      this.base[i * 3 + 2] = c.b
    }
  }

  update(dt: number) {
    for (let i = 0; i < this.max; i += 1) {
      if (this.life[i] <= 0) {
        this.col[i * 3] = this.col[i * 3 + 1] = this.col[i * 3 + 2] = 0
        continue
      }
      this.life[i] -= dt
      this.vel[i * 3 + 1] -= 6 * dt
      this.vel[i * 3] *= 0.985
      this.vel[i * 3 + 2] *= 0.985
      this.pos[i * 3] += this.vel[i * 3] * dt
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt
      const k = Math.min(1, this.life[i] * 1.5)
      this.col[i * 3] = this.base[i * 3] * k
      this.col[i * 3 + 1] = this.base[i * 3 + 1] * k
      this.col[i * 3 + 2] = this.base[i * 3 + 2] * k
    }
    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.color.needsUpdate = true
  }
}

const DEVICE_LAYOUT: Record<PlatformId | "none", { laptop: [number, number, number, number, number]; phone: [number, number, number, number, number] }> = {
  // [x, z, rotY, escala, visible]
  none: { laptop: [0, 0, 0, 0, 0], phone: [0, 0, 0, 0, 0] },
  web: { laptop: [0, 0.05, 0, 1, 1], phone: [0.9, 0.5, -0.4, 0, 0] },
  mobile: { laptop: [-0.3, 0, 0, 0, 0], phone: [0, 0.15, 0, 1.3, 1] },
  both: { laptop: [-0.38, -0.12, 0.12, 0.92, 1], phone: [0.98, 0.55, -0.45, 1.02, 1] },
}

export class BuilderScene {
  private r: ReturnType<typeof createRenderer>
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400)
  private controls: OrbitControls
  private composer: EffectComposer | null = null
  private bloom: UnrealBloomPass | null = null
  private loop: GameLoop
  private tweens = new TweenManager()
  private rng = createRng(2026)
  private mats = createMaterials()
  private spin = new THREE.Group()
  private float = new THREE.Group()
  private island: ReturnType<typeof createIsland>
  private backdrop: ReturnType<typeof createBackdrop>
  private hologram: Model
  private laptop: ReturnType<typeof createLaptop>
  private phone: Model
  private webScreen = createScreen("web")
  private phoneScreen = createScreen("mobile")
  private coreLight: THREE.PointLight
  private flash: THREE.Mesh
  private bursts = new Bursts()
  private slots: Slot[] = []
  private platform: PlatformId | null = null
  private modules: ModuleId[] = []
  private title = "Tu app"
  private size = { w: 1, h: 1 }
  private insets = { right: 0, bottom: 0 }
  private baseRadius = 15
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(9, 9)
  private pointerInside = false
  private hovered: Slot | null = null
  private pinned: Slot | null = null
  private down: { x: number; y: number; t: number } | null = null
  private dragging = false
  private lastInteract = -10
  private firstDragSent = false
  private cinematic = false
  private labelEl: HTMLElement | null = null
  private tmp = new THREE.Vector3()
  private disposed = false

  constructor(
    private container: HTMLElement,
    private opts: { reducedMotion: boolean; cb: SceneCallbacks },
  ) {
    this.r = createRenderer(container)
    const { renderer } = this.r
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMappingExposure = 1.05

    this.scene.background = new THREE.Color(LAB_COLORS.night)
    this.scene.fog = new THREE.Fog(LAB_COLORS.night, 28, 95)

    // Luces: llave fría, relleno de cielo, contraluz azul y luz del núcleo
    this.scene.add(new THREE.HemisphereLight(0x9fbfff, 0x0b0f1a, 0.75))
    const key = new THREE.DirectionalLight(0xe6eeff, 2.4)
    key.position.set(6, 11, 7)
    key.castShadow = true
    key.shadow.mapSize.set(this.r.coarse ? 1024 : 2048, this.r.coarse ? 1024 : 2048)
    key.shadow.camera.left = -7
    key.shadow.camera.right = 7
    key.shadow.camera.top = 7
    key.shadow.camera.bottom = -7
    key.shadow.camera.near = 1
    key.shadow.camera.far = 30
    key.shadow.bias = -0.0005
    key.shadow.normalBias = 0.02
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(LAB_COLORS.accent, 2.2)
    rim.position.set(-7, 5, -9)
    this.scene.add(rim)
    const warm = new THREE.DirectionalLight(LAB_COLORS.warm, 0.5)
    warm.position.set(8, 2, -3)
    this.scene.add(warm)
    this.coreLight = new THREE.PointLight(LAB_COLORS.accent, 6, 9, 2)
    this.coreLight.position.set(0, 2.6, 0.6)
    this.scene.add(this.coreLight)

    this.backdrop = createBackdrop(RIDGE_POINTS, SUMMIT)
    this.scene.add(this.backdrop.root)

    this.scene.add(this.float)
    this.float.add(this.spin)
    this.island = createIsland(this.mats)
    this.spin.add(this.island.root)

    // Dispositivos
    this.hologram = createHologram(this.mats)
    this.hologram.root.position.y = CORE_Y - 0.4
    this.spin.add(this.hologram.root)
    this.laptop = createLaptop(this.mats, this.webScreen.texture)
    this.phone = createPhone(this.mats, this.phoneScreen.texture)
    for (const d of [this.laptop.root, this.phone.root]) {
      d.position.y = CORE_Y + 0.02
      d.scale.setScalar(0.0001)
      d.visible = false
      this.spin.add(d)
    }
    this.redrawScreens()

    // Ranuras
    MODULES.forEach((mod, index) => {
      const a = (index / MODULES.length) * Math.PI * 2 + Math.PI / 2 + Math.PI / MODULES.length
      const group = new THREE.Group()
      group.position.set(Math.cos(a) * SLOT_RADIUS, 0, Math.sin(a) * SLOT_RADIUS)
      group.rotation.y = -a + Math.PI / 2 + Math.PI
      const pad = createPad(this.mats)
      group.add(pad.root)
      const holder = new THREE.Group()
      const hover = new THREE.Group()
      holder.add(hover)
      group.add(holder)
      const proxy = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.4, 6), new THREE.MeshBasicMaterial({ visible: false }))
      proxy.position.y = 1.3
      hover.scale.setScalar(MODULE_SCALE)
      proxy.userData.slot = index
      group.add(proxy)
      this.spin.add(group)
      this.slots.push({ id: mod.id, index, group, holder, hover, ringMat: pad.ringMat, proxy, model: null, line: null, lineMat: null, active: false, token: 0 })
    })

    // Destello de celebración
    this.flash = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xbcd3ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    )
    this.flash.position.y = 1.6
    this.spin.add(this.flash)
    this.spin.add(this.bursts.points)

    // Cámara y órbita
    this.camera.position.set(0, 7.2, 13.2)
    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.target.set(0, 1.0, 0)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.enablePan = false
    this.controls.minPolarAngle = 0.55
    this.controls.maxPolarAngle = 1.36
    this.controls.minAzimuthAngle = -1.05
    this.controls.maxAzimuthAngle = 1.05
    this.controls.rotateSpeed = 0.7
    this.controls.zoomSpeed = 0.6
    this.controls.addEventListener("start", () => {
      this.lastInteract = this.loop.elapsed
    })

    if (!this.r.coarse) {
      this.composer = new EffectComposer(renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.55, 0.82)
      this.composer.addPass(this.bloom)
      this.composer.addPass(new OutputPass())
    }

    this.r.onResize((w, h) => {
      this.size = { w, h }
      this.layout()
    })

    const el = renderer.domElement
    el.addEventListener("pointermove", this.onPointerMove)
    el.addEventListener("pointerdown", this.onPointerDown)
    el.addEventListener("pointerup", this.onPointerUp)
    el.addEventListener("pointerleave", this.onPointerLeave)

    this.loop = new GameLoop((dt, t) => this.tick(dt, t))
    this.loop.start()
  }

  // ---------- API pública ----------
  setLabelElement(el: HTMLElement | null) {
    this.labelEl = el
  }

  setTitle(title: string) {
    this.title = title
    this.redrawScreens()
  }

  setInsets(right: number, bottom: number) {
    this.insets = { right, bottom }
    this.layout()
  }

  setBuild(build: Build, opts: { stagger?: boolean } = {}) {
    if (build.platform !== this.platform) this.setPlatform(build.platform)
    const next = build.modules
    const removed = this.modules.filter((id) => !next.includes(id))
    const added = next.filter((id) => !this.modules.includes(id))
    removed.forEach((id) => this.removeModule(id))
    added.forEach((id, i) => this.addModule(id, opts.stagger ? 0.35 + i * 0.22 : 0))
    this.modules = [...next]
    this.redrawScreens()
  }

  celebrate() {
    const reduced = this.opts.reducedMotion
    labAudio.play("win")
    const colors = [new THREE.Color(LAB_COLORS.accent), new THREE.Color(0xdbe7ff), new THREE.Color(LAB_COLORS.warm), new THREE.Color(LAB_COLORS.primary)]
    if (!reduced) {
      this.bursts.emit(new THREE.Vector3(0, 1.8, 0), 260, colors, 3.4, 6.5, this.rng.next)
      this.slots.filter((s) => s.active).forEach((s, i) => {
        this.tweens.tween(0.01, () => {}, {
          delay: 0.15 + i * 0.08,
          onComplete: () => {
            s.group.getWorldPosition(this.tmp)
            this.spin.worldToLocal(this.tmp)
            this.tmp.y += 1.4
            this.bursts.emit(this.tmp, 30, colors, 1.4, 3.5, this.rng.next)
          },
        })
      })
    }
    const fm = this.flash.material as THREE.MeshBasicMaterial
    this.tweens.tween(0.9, (v) => {
      this.flash.scale.setScalar(0.5 + v * 4.2)
      fm.opacity = 0.32 * (1 - v)
    })
    this.tweens.tween(1.2, (v) => (this.coreLight.intensity = 6 + 40 * (1 - v)), { easing: easeOutCubic })
    if (reduced) return

    // Barrido de cámara: entra desde un costado y vuelve a la vista actual
    this.cinematic = true
    this.controls.enabled = false
    const target = this.controls.target.clone()
    const end = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(target))
    const start = end.clone()
    start.theta = end.theta - 0.9
    start.phi = Math.max(0.7, end.phi - 0.25)
    start.radius = end.radius * 0.72
    const p = new THREE.Spherical()
    this.tweens.tween(
      1.6,
      (v) => {
        p.radius = THREE.MathUtils.lerp(start.radius, end.radius, v)
        p.phi = THREE.MathUtils.lerp(start.phi, end.phi, v)
        p.theta = THREE.MathUtils.lerp(start.theta, end.theta, v)
        this.camera.position.setFromSpherical(p).add(target)
        this.camera.lookAt(target)
      },
      {
        easing: easeInOutCubic,
        onComplete: () => {
          this.cinematic = false
          this.controls.enabled = true
        },
      },
    )
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    this.loop.stop()
    const el = this.r.renderer.domElement
    el.removeEventListener("pointermove", this.onPointerMove)
    el.removeEventListener("pointerdown", this.onPointerDown)
    el.removeEventListener("pointerup", this.onPointerUp)
    el.removeEventListener("pointerleave", this.onPointerLeave)
    this.controls.dispose()
    this.composer?.dispose()
    disposeScene(this.scene)
    Object.values(this.mats).forEach((m) => m.dispose())
    this.webScreen.texture.dispose()
    this.phoneScreen.texture.dispose()
    this.r.dispose()
  }

  // ---------- Interno ----------
  private layout() {
    const { w, h } = this.size
    const { right, bottom } = this.insets
    this.camera.aspect = w / h
    this.camera.setViewOffset(w, h, right / 2, bottom / 2, w, h)
    this.camera.updateProjectionMatrix()
    // Distancia para que la isla quepa en el área libre (ancho y alto), con algo de recorte permitido en móvil
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const tanH = tanV * (w / h)
    const freeW = Math.max(0.3, (w - right) / w)
    const freeH = Math.max(0.3, (h - bottom) / h)
    const halfWidth = w - right < 600 ? 5.2 : 6.2
    const radius = Math.max(11, halfWidth / (tanH * freeW), 4.3 / (tanV * freeH))
    this.scene.fog = new THREE.Fog(LAB_COLORS.night, radius + 10, radius + 80)
    const dir = this.camera.position.clone().sub(this.controls.target).normalize()
    if (Math.abs(radius - this.baseRadius) > 0.01 || this.baseRadius === 15) {
      this.camera.position.copy(this.controls.target).addScaledVector(dir, radius)
      this.baseRadius = radius
    }
    this.controls.minDistance = radius * 0.62
    this.controls.maxDistance = radius * 1.3
    this.composer?.setSize(w, h)
    this.bloom?.resolution.set(w / 2, h / 2)
  }

  private redrawScreens() {
    this.webScreen.draw(this.modules, this.title)
    this.phoneScreen.draw(this.modules, this.title)
  }

  private setPlatform(platform: PlatformId | null) {
    const prev = this.platform
    this.platform = platform
    const layout = DEVICE_LAYOUT[platform ?? "none"]
    const reduced = this.opts.reducedMotion
    const apply = (root: THREE.Group, [x, z, ry, s, vis]: number[], delay: number) => {
      const fromPos = root.position.clone()
      const fromRot = root.rotation.y
      const fromScale = root.scale.x
      const toScale = Math.max(0.0001, s)
      if (vis) root.visible = true
      if (reduced) {
        root.position.set(x, CORE_Y + 0.02, z)
        root.rotation.y = ry
        root.scale.setScalar(toScale)
        root.visible = !!vis
        return
      }
      this.tweens.tween(
        0.7,
        (v) => {
          root.position.set(THREE.MathUtils.lerp(fromPos.x, x, v), CORE_Y + 0.02 + Math.sin(v * Math.PI) * 0.6, THREE.MathUtils.lerp(fromPos.z, z, v))
          root.rotation.y = THREE.MathUtils.lerp(fromRot, ry, v) + (vis && fromScale < 0.01 ? (1 - v) * Math.PI : 0)
          root.scale.setScalar(THREE.MathUtils.lerp(fromScale, toScale, v))
        },
        { delay, easing: vis ? easeOutBack : easeOutCubic, onComplete: () => (root.visible = !!vis) },
      )
    }
    apply(this.laptop.root, layout.laptop, layout.laptop[4] ? 0.12 : 0)
    apply(this.phone.root, layout.phone, layout.phone[4] ? 0.2 : 0)

    // La tapa del portátil se abre al aparecer
    if (layout.laptop[4] && (!prev || !DEVICE_LAYOUT[prev].laptop[4])) {
      if (reduced) this.laptop.lid.rotation.x = -0.28
      else {
        this.laptop.lid.rotation.x = 1.45
        this.tweens.tween(0.8, (v) => (this.laptop.lid.rotation.x = THREE.MathUtils.lerp(1.45, -0.28, v)), { delay: 0.45, easing: easeOutBack })
      }
    }

    const holo = this.hologram.root
    const showHolo = platform === null
    if (reduced) holo.scale.setScalar(showHolo ? 1 : 0.0001)
    else {
      const from = holo.scale.x
      this.tweens.tween(0.45, (v) => holo.scale.setScalar(Math.max(0.0001, THREE.MathUtils.lerp(from, showHolo ? 1 : 0, v))), { easing: easeOutCubic })
    }
    if (platform) {
      labAudio.play("place", this.rng.next())
      if (!reduced) {
        this.bursts.emit(new THREE.Vector3(0, CORE_Y + 0.2, 0), 50, [new THREE.Color(LAB_COLORS.accent), new THREE.Color(0xdbe7ff)], 2.2, 2, this.rng.next)
        this.kickIsland(0.08)
      }
    }
  }

  private kickIsland(amount: number) {
    this.tweens.tween(0.45, (v) => (this.spin.position.y = -amount * Math.sin(v * Math.PI) * (1 - v * 0.5)))
  }

  private addModule(id: ModuleId, delay: number) {
    const slot = this.slots.find((s) => s.id === id)
    if (!slot) return
    slot.token += 1
    const token = slot.token
    slot.active = true
    // Si había uno saliendo, se reemplaza
    if (slot.model) {
      slot.hover.remove(slot.model.root)
      disposeScene(slot.model.root)
      slot.model = null
    }
    const model = createModule(id, this.mats)
    slot.model = model
    slot.hover.add(model.root)
    slot.holder.scale.setScalar(1)
    const reduced = this.opts.reducedMotion
    const line = this.ensureLine(slot)

    if (reduced) {
      slot.holder.position.y = 0
      slot.holder.visible = true
      line.uniforms.uProgress.value = 1
      slot.ringMat.emissiveIntensity = 1.4
      labAudio.play("place", this.rng.next())
      return
    }
    slot.holder.visible = false
    this.tweens.tween(
      0.6,
      (v) => {
        if (slot.token !== token) return
        slot.holder.visible = true
        slot.holder.position.y = (1 - v) * 4.5
        slot.holder.rotation.y = (1 - v) * 1.2
      },
      {
        delay,
        easing: easeOutBounce,
        onComplete: () => {
          if (slot.token !== token) return
          labAudio.play("place", this.rng.next())
          this.landingFx(slot)
          this.tweens.tween(0.55, (v) => {
            if (slot.token === token) line.uniforms.uProgress.value = v
          })
          this.tweens.tween(0.4, (v) => {
            if (slot.token === token) slot.ringMat.emissiveIntensity = 0.25 + 1.15 * v
          })
        },
      },
    )
    // Squash al tocar suelo
    this.tweens.tween(
      0.3,
      (v) => {
        if (slot.token !== token) return
        const s = 1 - Math.sin(v * Math.PI) * 0.18
        slot.holder.scale.set(1 / Math.sqrt(s), s, 1 / Math.sqrt(s))
      },
      { delay: delay + 0.42 },
    )
  }

  private landingFx(slot: Slot) {
    slot.group.getWorldPosition(this.tmp)
    this.spin.worldToLocal(this.tmp)
    this.tmp.y = 0.42
    this.bursts.emit(this.tmp, 26, [new THREE.Color(0x9fbfff), new THREE.Color(LAB_COLORS.accent)], 2.4, 1.2, this.rng.next)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 0.86, 6),
      new THREE.MeshBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.4
    slot.group.add(ring)
    this.tweens.tween(0.6, (v) => {
      ring.scale.setScalar(1 + v * 1.6)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - v)
    }, {
      onComplete: () => {
        slot.group.remove(ring)
        ring.geometry.dispose()
        ;(ring.material as THREE.Material).dispose()
      },
    })
    this.kickIsland(0.04)
  }

  private removeModule(id: ModuleId) {
    const slot = this.slots.find((s) => s.id === id)
    if (!slot || !slot.model) return
    slot.token += 1
    const token = slot.token
    slot.active = false
    labAudio.play("remove", this.rng.next())
    const model = slot.model
    const lineMat = slot.lineMat
    const finish = () => {
      if (slot.token !== token) return
      slot.hover.remove(model.root)
      disposeScene(model.root)
      slot.model = null
      slot.holder.visible = false
    }
    if (this.opts.reducedMotion) {
      if (lineMat) lineMat.uniforms.uProgress.value = 0
      slot.ringMat.emissiveIntensity = 0.25
      finish()
      return
    }
    const start = lineMat?.uniforms.uProgress.value ?? 0
    this.tweens.tween(0.3, (v) => {
      if (lineMat && slot.token === token) lineMat.uniforms.uProgress.value = start * (1 - v)
      if (slot.token === token) slot.ringMat.emissiveIntensity = 1.4 - 1.15 * v
    })
    this.tweens.tween(
      0.38,
      (v) => {
        if (slot.token !== token) return
        slot.holder.scale.setScalar(Math.max(0.0001, 1 - v))
        slot.holder.position.y = v * 1.2
        slot.holder.rotation.y = v * 2
      },
      { easing: easeOutCubic, onComplete: finish },
    )
  }

  private ensureLine(slot: Slot) {
    if (slot.lineMat) return slot.lineMat
    const dir = slot.group.position.clone().setY(0).normalize()
    const from = dir.clone().multiplyScalar(1.6).setY(0.6)
    const to = dir.clone().multiplyScalar(SLOT_RADIUS - 0.85).setY(0.42)
    const mid = from.clone().lerp(to, 0.5).setY(1.25)
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
    const mat = flowMaterial()
    const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.035, 6), mat)
    this.spin.add(line)
    slot.line = line
    slot.lineMat = mat
    return mat
  }

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.r.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    this.pointerInside = true
    if (this.down && Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 6) {
      this.dragging = true
      this.lastInteract = this.loop.elapsed
      if (!this.firstDragSent) {
        this.firstDragSent = true
        this.opts.cb.onFirstDrag()
      }
    }
  }

  private onPointerDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, t: performance.now() }
    this.dragging = false
    this.onPointerMove(e)
  }

  private onPointerUp = (e: PointerEvent) => {
    const wasTap = this.down && !this.dragging && performance.now() - this.down.t < 450
    this.down = null
    this.dragging = false
    if (!wasTap) return
    this.onPointerMove(e)
    const hit = this.pick()
    if (!hit) {
      this.pinned = null
      return
    }
    if (!hit.active) {
      if (this.platform) this.opts.cb.onToggle(hit.id)
      else labAudio.play("error")
      this.pinned = null
    } else {
      this.pinned = this.pinned === hit ? null : hit
      labAudio.play("click", this.rng.next())
    }
    if (e.pointerType !== "mouse") this.pointerInside = false
  }

  private onPointerLeave = () => {
    this.pointerInside = false
  }

  private pick(): Slot | null {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.slots.map((s) => s.proxy), false)
    if (!hits.length) return null
    return this.slots[hits[0].object.userData.slot as number] ?? null
  }

  private tick(dt: number, t: number) {
    const reduced = this.opts.reducedMotion
    this.tweens.update(dt)

    // Giro de tocadiscos cuando nadie interactúa; flotación suave siempre
    if (!reduced && !this.cinematic && t - this.lastInteract > 3) this.spin.rotation.y += dt * 0.1
    this.float.position.y = reduced ? 0 : Math.sin(t * 0.6) * 0.12
    if (!this.cinematic) this.controls.update()

    this.island.tick(t)
    this.backdrop.tick(t)
    this.hologram.tick?.(t)
    for (const s of this.slots) {
      if (s.model?.tick && !reduced) s.model.tick(t + s.index)
      if (s.lineMat) s.lineMat.uniforms.uTime.value = t
    }
    if (!reduced) this.bursts.update(dt)

    // Hover / selección
    const hit = this.pointerInside && !this.dragging && !this.cinematic ? this.pick() : null
    const focus = hit ?? this.pinned
    if (focus !== this.hovered) {
      this.hovered = focus
      this.opts.cb.onHover(focus?.id ?? null, focus?.active ?? false)
      this.r.renderer.domElement.style.cursor = hit ? "pointer" : "grab"
    }
    for (const s of this.slots) {
      const on = s === this.hovered
      const target = MODULE_SCALE * (on ? 1.1 : 1)
      s.hover.scale.setScalar(damp(s.hover.scale.x, target, 14, dt))
      const base = s.active ? 1.4 : 0.25
      const glow = on ? base + 1.4 : base
      s.ringMat.emissiveIntensity = damp(s.ringMat.emissiveIntensity, glow, 10, dt)
    }

    // Etiqueta HTML sobre el módulo enfocado
    if (this.labelEl) {
      if (this.hovered) {
        this.hovered.group.getWorldPosition(this.tmp)
        this.tmp.y += this.hovered.active ? 2.7 : 1.2
        this.tmp.project(this.camera)
        const x = (this.tmp.x * 0.5 + 0.5) * this.size.w
        const y = (-this.tmp.y * 0.5 + 0.5) * this.size.h
        this.labelEl.style.opacity = "1"
        this.labelEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`
      } else this.labelEl.style.opacity = "0"
    }

    if (this.composer) this.composer.render(dt)
    else this.r.renderer.render(this.scene, this.camera)
  }
}

function easeOutBounce(x: number) {
  const n1 = 7.5625
  const d1 = 2.75
  if (x < 1 / d1) return n1 * x * x
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
  return n1 * (x -= 2.625 / d1) * x + 0.984375
}
