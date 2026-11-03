// Utilidades compartidas por los juegos del Lab: azar con semilla, tweens,
// sacudida de cámara y bucle de juego. Sin dependencias además de three.
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

// ---------- Azar determinista ----------
export function createRng(seed: number) {
  let s = seed >>> 0
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    range: (min: number, max: number) => min + (max - min) * next(),
    int: (min: number, max: number) => Math.floor(min + (max - min + 1) * next()),
    pick: <T,>(items: readonly T[]) => items[Math.floor(next() * items.length)],
    chance: (p: number) => next() < p,
  }
}
export type Rng = ReturnType<typeof createRng>

// ---------- Curvas ----------
export type Easing = (t: number) => number
export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutBack: Easing = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt))

type ActiveTween = {
  elapsed: number
  duration: number
  delay: number
  easing: Easing
  onUpdate: (v: number) => void
  onComplete?: () => void
}

export class TweenManager {
  private tweens: ActiveTween[] = []

  tween(
    duration: number,
    onUpdate: (v: number) => void,
    opts: { easing?: Easing; delay?: number; onComplete?: () => void } = {},
  ) {
    this.tweens.push({
      elapsed: 0,
      duration,
      delay: opts.delay ?? 0,
      easing: opts.easing ?? easeOutCubic,
      onUpdate,
      onComplete: opts.onComplete,
    })
  }

  update(dt: number) {
    for (let i = this.tweens.length - 1; i >= 0; i -= 1) {
      const t = this.tweens[i]
      if (t.delay > 0) {
        t.delay -= dt
        continue
      }
      t.elapsed += dt
      const k = Math.min(t.elapsed / t.duration, 1)
      t.onUpdate(t.easing(k))
      if (k >= 1) {
        this.tweens.splice(i, 1)
        t.onComplete?.()
      }
    }
  }

  clear() {
    this.tweens = []
  }
}

// ---------- Sacudida de cámara (trauma²) ----------
export class ShakeRig {
  private trauma = 0
  private time = 0
  enabled = true

  add(amount: number) {
    if (!this.enabled) return
    this.trauma = Math.min(1, this.trauma + amount)
  }

  apply(camera: THREE.Camera, dt: number, maxOffset = 0.35, maxRoll = 0.05) {
    this.time += dt
    this.trauma = Math.max(0, this.trauma - 1.5 * dt)
    if (this.trauma <= 0) return
    const s = this.trauma * this.trauma
    const f = this.time * 30
    const n = (seed: number) => {
      const x = Math.sin(f * 12.9898 + seed * 78.233) * 43758.5453
      return (x - Math.floor(x)) * 2 - 1
    }
    camera.position.x += maxOffset * s * n(1)
    camera.position.y += maxOffset * s * n(2)
    camera.rotation.z += maxRoll * s * n(3)
  }

  reset() {
    this.trauma = 0
  }
}

// ---------- Bucle ----------
// Delta en segundos, acotado para que una pestaña en segundo plano no teletransporte el juego.
export class GameLoop {
  private raf = 0
  private last = 0
  private running = false
  elapsed = 0

  constructor(private readonly tick: (dt: number, elapsed: number) => void) {}

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    const frame = (now: number) => {
      if (!this.running) return
      const dt = Math.min((now - this.last) / 1000, 1 / 20)
      this.last = now
      this.elapsed += dt
      this.tick(dt, this.elapsed)
      this.raf = requestAnimationFrame(frame)
    }
    this.raf = requestAnimationFrame(frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }
}

// ---------- Renderer ----------
export function isCoarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function createRenderer(container: HTMLElement, opts: { alpha?: boolean } = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: opts.alpha ?? false,
    powerPreference: "high-performance",
  })
  const coarse = isCoarsePointer()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.domElement.style.display = "block"
  renderer.domElement.style.width = "100%"
  renderer.domElement.style.height = "100%"
  renderer.domElement.style.touchAction = "none"
  container.appendChild(renderer.domElement)

  const listeners = new Set<(w: number, h: number) => void>()
  const resize = () => {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h, false)
    listeners.forEach((fn) => fn(w, h))
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  return {
    renderer,
    coarse,
    onResize(fn: (w: number, h: number) => void) {
      listeners.add(fn)
      fn(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight))
    },
    dispose() {
      ro.disconnect()
      listeners.clear()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}

// Libera geometrías, materiales y texturas de una escena completa.
export function disposeScene(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (!mat) return
    for (const m of Array.isArray(mat) ? mat : [mat]) {
      for (const value of Object.values(m)) {
        if (value instanceof THREE.Texture) value.dispose()
      }
      m.dispose()
    }
  })
}

// ---------- Paleta compartida (azul noche de la marca) ----------
export const LAB_COLORS = {
  night: 0x0b0f1a,
  nightSoft: 0x121a2c,
  primary: 0x2563eb,
  accent: 0x4f8cff,
  slate: 0x94a3b8,
  ice: 0xdbe7ff,
  warm: 0xffc46b,
  danger: 0xff4d5e,
  success: 0x34d399,
} as const

// Mejor puntaje por juego, guardado solo en este navegador.
export function readBest(key: string): number {
  try {
    return Number(localStorage.getItem(`avila-lab-best-${key}`)) || 0
  } catch {
    return 0
  }
}

export function writeBest(key: string, value: number) {
  try {
    localStorage.setItem(`avila-lab-best-${key}`, String(value))
  } catch {
    // sin almacenamiento disponible
  }
}

/**
 * Fusiona, dentro de cada nodo, las mallas hijas fijas que comparten material.
 * Mantiene los pivotes (grupos) para animar y respeta las mallas con nombre,
 * que el juego busca por nombre. Reduce mucho las llamadas de dibujo de modelos hechos con primitivas.
 */
export function mergeStatic(root: THREE.Object3D) {
  const nodes: THREE.Object3D[] = []
  root.traverse((o) => nodes.push(o))
  for (const node of nodes) {
    const byMat = new Map<THREE.Material, THREE.Mesh[]>()
    for (const child of node.children) {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh || mesh.name || mesh.children.length) continue
      if (Array.isArray(mesh.material)) continue
      const list = byMat.get(mesh.material) ?? []
      list.push(mesh)
      byMat.set(mesh.material, list)
    }
    byMat.forEach((meshes, material) => {
      if (meshes.length < 2) return
      const geos = meshes.map((m) => {
        m.updateMatrix()
        const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()
        for (const key of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(key)) g.deleteAttribute(key)
        if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2))
        return g.applyMatrix4(m.matrix)
      })
      const merged = mergeGeometries(geos)
      geos.forEach((g) => g.dispose())
      if (!merged) return
      const out = new THREE.Mesh(merged, material)
      out.castShadow = meshes.some((m) => m.castShadow)
      out.receiveShadow = meshes.some((m) => m.receiveShadow)
      for (const m of meshes) node.remove(m)
      node.add(out)
    })
  }
  return root
}
