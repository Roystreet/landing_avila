// Modelos procedurales de "Arma tu app": isla, dispositivos y los nueve módulos.
// Cada fábrica devuelve un grupo listo para la escena y, si anima, un `tick`.
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { createRng, LAB_COLORS } from "@/components/lab/engine/core"
import type { ModuleId } from "./catalog"

export type Model = { root: THREE.Group; tick?: (t: number) => void }

// ---------- Materiales compartidos por rol ----------
export function createMaterials() {
  const std = (color: number, roughness: number, metalness: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })
  return {
    shell: std(0x2b3855, 0.42, 0.5),
    shellDark: std(0x0f1522, 0.7, 0.3),
    alu: std(0xb9c4d8, 0.32, 0.75),
    trim: std(0x3a4b6b, 0.35, 0.7),
    primary: std(LAB_COLORS.primary, 0.35, 0.25),
    accent: std(LAB_COLORS.accent, 0.3, 0.2),
    glow: std(LAB_COLORS.accent, 0.4, 0, { emissive: new THREE.Color(LAB_COLORS.accent), emissiveIntensity: 2.2 }),
    glowIce: std(0xdbe7ff, 0.4, 0, { emissive: new THREE.Color(0xbcd3ff), emissiveIntensity: 1.6 }),
    gold: std(0xf2b544, 0.28, 0.85),
    warmGlow: std(LAB_COLORS.warm, 0.4, 0, { emissive: new THREE.Color(LAB_COLORS.warm), emissiveIntensity: 2 }),
    danger: std(LAB_COLORS.danger, 0.35, 0.1, { emissive: new THREE.Color(LAB_COLORS.danger), emissiveIntensity: 0.6 }),
    success: std(LAB_COLORS.success, 0.4, 0.1, { emissive: new THREE.Color(LAB_COLORS.success), emissiveIntensity: 1.4 }),
    white: std(0xf1f5fb, 0.45, 0.05),
    glass: std(0x9fc0ff, 0.1, 0.1, { transparent: true, opacity: 0.28, emissive: new THREE.Color(0x2b4fa0), emissiveIntensity: 0.4 }),
    ground: std(0x172034, 0.85, 0.15),
    rock: std(0x121a2b, 0.95, 0.05, { flatShading: true }),
    box: std(0xc08a52, 0.8, 0.02),
    paper: std(0xe6edf8, 0.7, 0),
  }
}
export type Materials = ReturnType<typeof createMaterials>

const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, shadow = true) => {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = shadow
  m.receiveShadow = true
  return m
}

// ---------- Utilidades de lienzo ----------
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function canvasTexture(w: number, h: number) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return { canvas, ctx, texture }
}

// ---------- Isla flotante ----------
export function createIsland(m: Materials) {
  const root = new THREE.Group()

  // Losa superior hexagonal con textura de rejilla.
  const top = canvasTexture(1024, 1024)
  const c = top.ctx
  c.fillStyle = "#172034"
  c.fillRect(0, 0, 1024, 1024)
  c.strokeStyle = "rgba(120,150,210,0.10)"
  c.lineWidth = 2
  const r = 34
  for (let row = -1; row < 22; row += 1) {
    for (let col = -1; col < 20; col += 1) {
      const cx = col * r * 1.5
      const cy = row * r * Math.sqrt(3) + (col % 2 ? (r * Math.sqrt(3)) / 2 : 0)
      c.beginPath()
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i
        c[i ? "lineTo" : "moveTo"](cx + r * Math.cos(a), cy + r * Math.sin(a))
      }
      c.closePath()
      c.stroke()
    }
  }
  const grad = c.createRadialGradient(512, 512, 60, 512, 512, 520)
  grad.addColorStop(0, "rgba(79,140,255,0.16)")
  grad.addColorStop(1, "rgba(11,15,26,0.0)")
  c.fillStyle = grad
  c.fillRect(0, 0, 1024, 1024)
  top.texture.needsUpdate = true

  const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: top.texture, roughness: 0.85, metalness: 0.15 })
  // Grupos del cilindro: costado, tapa superior, tapa inferior.
  const slab = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.05, 0.5, 6), [m.ground, topMat, m.ground])
  slab.receiveShadow = true
  slab.rotation.y = Math.PI / 6
  root.add(slab)

  // Canto metálico con línea de luz.
  const rim = mesh(new THREE.CylinderGeometry(5.32, 5.32, 0.14, 6, 1, true), m.trim, false)
  rim.rotation.y = Math.PI / 6
  rim.position.y = 0.16
  root.add(rim)
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(5.33, 5.33, 0.02, 6)),
    new THREE.LineBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.7 }),
  )
  edge.rotation.y = Math.PI / 6
  edge.position.y = 0.25
  root.add(edge)

  // Roca inferior facetada.
  const rng = createRng(7)
  const rockGeo = new THREE.ConeGeometry(5.1, 5.2, 6, 5)
  const pos = rockGeo.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i)
    if (y > 2.5) continue
    const k = 0.75 + rng.next() * 0.45
    pos.setX(i, pos.getX(i) * k)
    pos.setZ(i, pos.getZ(i) * k)
    pos.setY(i, y + (rng.next() - 0.5) * 0.4)
  }
  rockGeo.computeVertexNormals()
  const rock = mesh(rockGeo, m.rock, false)
  rock.rotation.set(Math.PI, Math.PI / 6, 0)
  rock.position.y = -2.85
  root.add(rock)

  // Fragmentos que orbitan bajo la isla.
  const shards: THREE.Mesh[] = []
  for (let i = 0; i < 7; i += 1) {
    const s = mesh(new THREE.DodecahedronGeometry(0.25 + rng.next() * 0.35, 0), m.rock, false)
    const a = (i / 7) * Math.PI * 2
    s.userData = { a, rad: 5.6 + rng.next() * 1.4, y: -1.4 - rng.next() * 2.4, sp: 0.08 + rng.next() * 0.1 }
    shards.push(s)
    root.add(s)
  }

  // Pedestal central.
  const pedestal = mesh(new THREE.CylinderGeometry(1.55, 1.75, 0.3, 6), m.shell)
  pedestal.rotation.y = Math.PI / 6
  pedestal.position.y = 0.4
  root.add(pedestal)
  const pedRing = mesh(new THREE.TorusGeometry(1.6, 0.035, 6, 6), m.glow, false)
  pedRing.rotation.set(Math.PI / 2, 0, Math.PI / 6)
  pedRing.position.y = 0.56
  root.add(pedRing)

  return {
    root,
    tick(t: number) {
      for (const s of shards) {
        const d = s.userData as { a: number; rad: number; y: number; sp: number }
        const a = d.a + t * d.sp
        s.position.set(Math.cos(a) * d.rad, d.y + Math.sin(t * 0.7 + d.a) * 0.15, Math.sin(a) * d.rad)
        s.rotation.set(t * 0.2 + d.a, t * 0.3, 0)
      }
    },
  }
}

// Plataforma de cada ranura: base hexagonal + anillo con material propio para resaltar.
export function createPad(m: Materials) {
  const root = new THREE.Group()
  const base = mesh(new THREE.CylinderGeometry(0.82, 0.88, 0.12, 6), m.shellDark)
  base.position.y = 0.31
  root.add(base)
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x1a2a4a,
    emissive: new THREE.Color(LAB_COLORS.accent),
    emissiveIntensity: 0.25,
    roughness: 0.5,
  })
  const ring = mesh(new THREE.TorusGeometry(0.86, 0.03, 6, 6), ringMat, false)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.38
  root.add(ring)
  return { root, ringMat }
}

// ---------- Pantallas que reflejan los módulos elegidos ----------
const SCREEN_COLORS = { bg: "#0d1424", panel: "#16213a", line: "#24324f", text: "#dbe7ff", muted: "#7f93b8", blue: "#4f8cff", primary: "#2563eb", warm: "#ffc46b", green: "#34d399", red: "#ff4d5e" }

function drawWidget(ctx: CanvasRenderingContext2D, id: ModuleId, x: number, y: number, w: number, h: number, s: number) {
  const C = SCREEN_COLORS
  ctx.fillStyle = C.panel
  roundRect(ctx, x, y, w, h, 10 * s)
  ctx.fill()
  const pad = 12 * s
  const ix = x + pad
  const iy = y + pad
  const iw = w - pad * 2
  const ih = h - pad * 2
  ctx.lineWidth = 3 * s
  ctx.lineCap = "round"
  switch (id) {
    case "dashboard": {
      const bars = [0.45, 0.7, 0.55, 0.9, 0.65, 0.8]
      const bw = iw / (bars.length * 1.6)
      bars.forEach((v, i) => {
        ctx.fillStyle = i === 3 ? C.blue : C.line
        ctx.fillRect(ix + i * bw * 1.6, iy + ih * (1 - v), bw, ih * v)
      })
      break
    }
    case "payments": {
      const g = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih)
      g.addColorStop(0, C.primary)
      g.addColorStop(1, "#7aa7ff")
      ctx.fillStyle = g
      roundRect(ctx, ix, iy, iw, ih * 0.78, 8 * s)
      ctx.fill()
      ctx.fillStyle = C.warm
      ctx.fillRect(ix + 10 * s, iy + ih * 0.22, 18 * s, 13 * s)
      ctx.fillStyle = "rgba(255,255,255,0.75)"
      ctx.fillRect(ix + 10 * s, iy + ih * 0.58, iw * 0.55, 5 * s)
      break
    }
    case "maps": {
      ctx.fillStyle = "#13203a"
      ctx.fillRect(ix, iy, iw, ih)
      ctx.strokeStyle = C.line
      for (let i = 1; i < 4; i += 1) {
        ctx.beginPath()
        ctx.moveTo(ix, iy + (ih * i) / 4)
        ctx.lineTo(ix + iw, iy + (ih * i) / 4 + 6 * s)
        ctx.stroke()
      }
      ctx.strokeStyle = C.blue
      ctx.beginPath()
      ctx.moveTo(ix + iw * 0.1, iy + ih * 0.85)
      ctx.bezierCurveTo(ix + iw * 0.4, iy + ih * 0.9, ix + iw * 0.3, iy + ih * 0.2, ix + iw * 0.85, iy + ih * 0.25)
      ctx.stroke()
      ctx.fillStyle = C.red
      ctx.beginPath()
      ctx.arc(ix + iw * 0.85, iy + ih * 0.25, 6 * s, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case "ai": {
      ctx.fillStyle = C.line
      roundRect(ctx, ix, iy, iw * 0.7, ih * 0.3, 8 * s)
      ctx.fill()
      ctx.fillStyle = C.primary
      roundRect(ctx, ix + iw * 0.3, iy + ih * 0.4, iw * 0.7, ih * 0.3, 8 * s)
      ctx.fill()
      ctx.fillStyle = C.blue
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath()
        ctx.arc(ix + 12 * s + i * 12 * s, iy + ih * 0.88, 3.5 * s, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case "inventory": {
      for (let i = 0; i < 4; i += 1) {
        const ry = iy + (ih / 4) * i + 3 * s
        ctx.fillStyle = C.warm
        ctx.fillRect(ix, ry, 12 * s, 12 * s)
        ctx.fillStyle = C.line
        ctx.fillRect(ix + 20 * s, ry + 3 * s, iw * 0.5, 6 * s)
        ctx.fillStyle = i === 2 ? C.red : C.green
        ctx.fillRect(ix + iw - 18 * s, ry + 2 * s, 18 * s, 8 * s)
      }
      break
    }
    case "notifications": {
      for (let i = 0; i < 3; i += 1) {
        const ry = iy + (ih / 3) * i
        ctx.fillStyle = i === 0 ? C.blue : C.line
        ctx.beginPath()
        ctx.arc(ix + 7 * s, ry + 9 * s, 6 * s, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = C.line
        ctx.fillRect(ix + 20 * s, ry + 5 * s, iw * (0.75 - i * 0.12), 7 * s)
      }
      break
    }
    case "api": {
      const pts = [
        [0.15, 0.3],
        [0.5, 0.15],
        [0.85, 0.35],
        [0.3, 0.8],
        [0.75, 0.8],
      ]
      ctx.strokeStyle = C.line
      pts.forEach(([px, py], i) =>
        pts.slice(i + 1).forEach(([qx, qy]) => {
          ctx.beginPath()
          ctx.moveTo(ix + px * iw, iy + py * ih)
          ctx.lineTo(ix + qx * iw, iy + qy * ih)
          ctx.stroke()
        }),
      )
      pts.forEach(([px, py], i) => {
        ctx.fillStyle = i === 1 ? C.blue : C.muted
        ctx.beginPath()
        ctx.arc(ix + px * iw, iy + py * ih, 6 * s, 0, Math.PI * 2)
        ctx.fill()
      })
      break
    }
    case "cloud": {
      ctx.strokeStyle = C.green
      ctx.beginPath()
      for (let i = 0; i <= 20; i += 1) {
        const px = ix + (iw * i) / 20
        const py = iy + ih * 0.55 + Math.sin(i * 0.9) * ih * 0.12 - (i / 20) * ih * 0.2
        if (i) ctx.lineTo(px, py)
        else ctx.moveTo(px, py)
      }
      ctx.stroke()
      ctx.fillStyle = C.line
      ctx.fillRect(ix, iy + ih - 6 * s, iw, 4 * s)
      break
    }
    case "login": {
      ctx.fillStyle = C.blue
      ctx.beginPath()
      ctx.arc(ix + 16 * s, iy + ih / 2, 14 * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = C.line
      ctx.fillRect(ix + 40 * s, iy + ih / 2 - 10 * s, iw * 0.5, 7 * s)
      ctx.fillRect(ix + 40 * s, iy + ih / 2 + 4 * s, iw * 0.35, 7 * s)
      break
    }
  }
}

export function createScreen(kind: "web" | "mobile") {
  const [w, h] = kind === "web" ? [1024, 640] : [400, 820]
  const surface = canvasTexture(w, h)
  const draw = (modules: ModuleId[], title: string) => {
    const { ctx } = surface
    const C = SCREEN_COLORS
    const s = kind === "web" ? 1.4 : 1.15
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, w, h)
    if (kind === "web") {
      // Barra lateral + encabezado
      ctx.fillStyle = "#0a101d"
      ctx.fillRect(0, 0, 190, h)
      ctx.fillStyle = C.blue
      ctx.beginPath()
      ctx.moveTo(30, 52)
      ctx.lineTo(48, 22)
      ctx.lineTo(66, 52)
      ctx.closePath()
      ctx.fill()
      for (let i = 0; i < Math.max(4, modules.length); i += 1) {
        ctx.fillStyle = i === 0 ? C.primary : C.line
        roundRect(ctx, 26, 92 + i * 46, 140, 26, 8)
        ctx.fill()
      }
      ctx.fillStyle = C.text
      ctx.font = "700 34px Montserrat, system-ui, sans-serif"
      ctx.fillText(title, 222, 64)
      if (modules.includes("login")) {
        ctx.fillStyle = C.blue
        ctx.beginPath()
        ctx.arc(w - 50, 52, 20, 0, Math.PI * 2)
        ctx.fill()
      }
      const cols = 3
      const gx = 222
      const gy = 100
      const gw = w - gx - 30
      const cell = (gw - 20 * (cols - 1)) / cols
      const rows = 2
      const ch = (h - gy - 30 - 20 * (rows - 1)) / rows
      const items = modules.filter((m) => m !== "login").slice(0, 6)
      if (!items.length) {
        ctx.strokeStyle = C.line
        ctx.setLineDash([12, 10])
        ctx.lineWidth = 3
        roundRect(ctx, gx, gy, gw, h - gy - 30, 16)
        ctx.stroke()
        ctx.setLineDash([])
      }
      items.forEach((id, i) => drawWidget(ctx, id, gx + (i % cols) * (cell + 20), gy + Math.floor(i / cols) * (ch + 20), cell, ch, s))
    } else {
      ctx.fillStyle = C.text
      ctx.font = "700 30px Montserrat, system-ui, sans-serif"
      ctx.fillText(title, 28, 92)
      ctx.fillStyle = C.line
      roundRect(ctx, 150, 20, 100, 22, 11)
      ctx.fill()
      const items = modules.slice(0, 5)
      if (!items.length) {
        ctx.strokeStyle = C.line
        ctx.setLineDash([10, 8])
        ctx.lineWidth = 3
        roundRect(ctx, 24, 130, w - 48, h - 250, 18)
        ctx.stroke()
        ctx.setLineDash([])
      }
      const ch = (h - 250) / Math.max(3, items.length) - 14
      items.forEach((id, i) => drawWidget(ctx, id, 24, 130 + i * (ch + 14), w - 48, ch, s))
      // Barra de pestañas
      ctx.fillStyle = "#0a101d"
      ctx.fillRect(0, h - 96, w, 96)
      for (let i = 0; i < 4; i += 1) {
        ctx.fillStyle = i === 0 ? C.blue : C.line
        ctx.beginPath()
        ctx.arc(60 + i * 93, h - 48, 13, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    surface.texture.needsUpdate = true
  }
  return { texture: surface.texture, draw }
}

// ---------- Dispositivos ----------
export function createLaptop(m: Materials, screen: THREE.Texture): Model & { lid: THREE.Group } {
  const root = new THREE.Group()
  const base = mesh(new RoundedBoxGeometry(2.5, 0.09, 1.7, 3, 0.04), m.alu)
  base.position.y = 0.045
  root.add(base)

  // Teclado instanciado
  const keyGeo = new RoundedBoxGeometry(0.15, 0.025, 0.13, 2, 0.012)
  const keys = new THREE.InstancedMesh(keyGeo, m.shellDark, 13 * 4)
  const dummy = new THREE.Object3D()
  let k = 0
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 13; col += 1) {
      dummy.position.set(-0.99 + col * 0.165, 0.095, -0.6 + row * 0.16)
      dummy.updateMatrix()
      keys.setMatrixAt(k, dummy.matrix)
      k += 1
    }
  }
  keys.castShadow = false
  root.add(keys)
  const pad = mesh(new THREE.BoxGeometry(0.75, 0.005, 0.42), m.trim, false)
  pad.position.set(0, 0.093, 0.5)
  root.add(pad)

  // Tapa con bisagra atrás
  const lid = new THREE.Group()
  lid.position.set(0, 0.09, -0.83)
  const lidShell = mesh(new RoundedBoxGeometry(2.5, 1.62, 0.06, 3, 0.03), m.alu)
  lidShell.position.y = 0.81
  lid.add(lidShell)
  const bezel = mesh(new THREE.PlaneGeometry(2.4, 1.52), m.shellDark, false)
  bezel.position.set(0, 0.81, 0.032)
  lid.add(bezel)
  const display = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 1.42), new THREE.MeshBasicMaterial({ map: screen, toneMapped: false }))
  display.position.set(0, 0.82, 0.034)
  lid.add(display)
  const logo = mesh(new THREE.CircleGeometry(0.08, 6), m.glow, false)
  logo.position.set(0, 0.85, -0.032)
  logo.rotation.y = Math.PI
  lid.add(logo)
  lid.rotation.x = -0.28
  root.add(lid)
  return { root, lid }
}

export function createPhone(m: Materials, screen: THREE.Texture): Model {
  const root = new THREE.Group()
  const body = mesh(new RoundedBoxGeometry(0.82, 1.66, 0.09, 4, 0.1), m.shell)
  body.position.y = 0.83
  root.add(body)
  const frame = mesh(new RoundedBoxGeometry(0.84, 1.68, 0.06, 4, 0.1), m.trim)
  frame.position.y = 0.83
  root.add(frame)
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.48), new THREE.MeshBasicMaterial({ map: screen, toneMapped: false }))
  display.position.set(0, 0.83, 0.047)
  root.add(display)
  const cam = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), m.shellDark, false)
  cam.rotation.x = Math.PI / 2
  cam.position.set(-0.24, 1.48, -0.05)
  root.add(cam)
  const btn = mesh(new THREE.BoxGeometry(0.02, 0.22, 0.04), m.trim, false)
  btn.position.set(0.43, 1.2, 0)
  root.add(btn)
  // Soporte
  const stand = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), m.shellDark)
  stand.position.set(0, 0.03, 0.05)
  root.add(stand)
  root.rotation.x = -0.12
  return { root }
}

// Holograma que ocupa el centro mientras no se elige plataforma.
export function createHologram(m: Materials): Model {
  const root = new THREE.Group()
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 1),
    new THREE.MeshBasicMaterial({ color: LAB_COLORS.accent, wireframe: true, transparent: true, opacity: 0.55 }),
  )
  ico.position.y = 1.6
  root.add(ico)
  const core = mesh(new THREE.IcosahedronGeometry(0.32, 0), m.glow, false)
  core.position.y = 1.6
  root.add(core)
  const rings = [0, 1].map((i) => {
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(1.15 + i * 0.25, 0.012, 6, 64),
      new THREE.MeshBasicMaterial({ color: 0x9fbfff, transparent: true, opacity: 0.45 }),
    )
    r.position.y = 1.6
    root.add(r)
    return r
  })
  return {
    root,
    tick(t) {
      ico.rotation.set(t * 0.3, t * 0.45, 0)
      core.rotation.set(-t * 0.6, t * 0.8, 0)
      rings[0].rotation.set(Math.PI / 2 + Math.sin(t * 0.6) * 0.4, t * 0.5, 0)
      rings[1].rotation.set(Math.PI / 2.4, -t * 0.4, Math.cos(t * 0.5) * 0.3)
      const s = 1 + Math.sin(t * 2) * 0.04
      core.scale.setScalar(s)
    },
  }
}

// ---------- Módulos ----------
export function createModule(id: ModuleId, m: Materials): Model {
  const root = new THREE.Group()
  const add = (o: THREE.Object3D) => {
    root.add(o)
    return o
  }
  let tick: ((t: number) => void) | undefined

  switch (id) {
    case "login": {
      // Escudo extruido con cerradura luminosa + tarjeta de acceso
      const shape = new THREE.Shape()
      shape.moveTo(0, 0.62)
      shape.quadraticCurveTo(0.3, 0.55, 0.48, 0.5)
      shape.lineTo(0.45, 0.05)
      shape.quadraticCurveTo(0.35, -0.42, 0, -0.62)
      shape.quadraticCurveTo(-0.35, -0.42, -0.45, 0.05)
      shape.lineTo(-0.48, 0.5)
      shape.quadraticCurveTo(-0.3, 0.55, 0, 0.62)
      const shield = mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }), m.primary)
      shield.position.set(0, 1.08, -0.07)
      add(shield)
      const holeTop = mesh(new THREE.CircleGeometry(0.1, 20), m.glowIce, false)
      holeTop.position.set(0, 1.15, 0.12)
      add(holeTop)
      const holeBot = mesh(new THREE.PlaneGeometry(0.07, 0.2), m.glowIce, false)
      holeBot.position.set(0, 0.99, 0.12)
      add(holeBot)
      const post = mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.5, 8), m.trim)
      post.position.y = 0.55
      add(post)
      const card = mesh(new RoundedBoxGeometry(0.5, 0.03, 0.32, 2, 0.02), m.white)
      card.position.set(0.32, 0.42, 0.35)
      card.rotation.y = -0.5
      add(card)
      const chip = mesh(new THREE.BoxGeometry(0.1, 0.01, 0.08), m.gold, false)
      chip.position.set(0.25, 0.44, 0.33)
      chip.rotation.y = -0.5
      add(chip)
      tick = (t) => {
        shield.rotation.y = Math.sin(t * 0.8) * 0.25
        holeTop.rotation.y = shield.rotation.y
        holeBot.rotation.y = shield.rotation.y
      }
      break
    }
    case "payments": {
      // Terminal de cobro + pila de monedas
      const body = mesh(new RoundedBoxGeometry(0.55, 0.85, 0.22, 3, 0.06), m.shell)
      body.position.set(-0.15, 0.82, 0)
      body.rotation.x = -0.25
      add(body)
      const scr = mesh(new THREE.PlaneGeometry(0.42, 0.28), m.glow, false)
      scr.position.set(-0.15, 1.02, 0.07)
      scr.rotation.x = -0.25
      add(scr)
      const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.05, 0.02), m.trim, 9)
      const d = new THREE.Object3D()
      for (let i = 0; i < 9; i += 1) {
        d.position.set(-0.27 + (i % 3) * 0.12, 0.66 - Math.floor(i / 3) * 0.085, 0.13 - Math.floor(i / 3) * 0.022)
        d.rotation.x = -0.25
        d.updateMatrix()
        keys.setMatrixAt(i, d.matrix)
      }
      add(keys)
      const card = mesh(new RoundedBoxGeometry(0.42, 0.03, 0.28, 2, 0.02), m.primary)
      card.position.set(-0.15, 1.32, -0.06)
      card.rotation.set(-0.25 + Math.PI / 2, 0, 0)
      add(card)
      const coins: THREE.Mesh[] = []
      for (let i = 0; i < 5; i += 1) {
        const c = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.055, 24), m.gold)
        c.position.set(0.4 + (i % 2) * 0.01, 0.4 + i * 0.06, 0.15)
        coins.push(c)
        add(c)
      }
      const topCoin = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 24), m.gold)
      topCoin.rotation.z = Math.PI / 2
      add(topCoin)
      tick = (t) => {
        topCoin.position.set(0.4, 0.95 + Math.sin(t * 2) * 0.06, 0.15)
        topCoin.rotation.y = t * 2.4
        card.position.y = 1.32 + Math.sin(t * 1.5) * 0.03
      }
      break
    }
    case "dashboard": {
      const base = mesh(new RoundedBoxGeometry(1.0, 0.1, 0.7, 2, 0.04), m.shellDark)
      base.position.y = 0.42
      add(base)
      const heights = [0.35, 0.6, 0.48, 0.9]
      const bars = heights.map((hgt, i) => {
        const b = mesh(new THREE.BoxGeometry(0.16, 1, 0.16), i === 3 ? m.accent : m.trim)
        b.position.set(-0.33 + i * 0.22, 0.47, 0)
        b.userData.h = hgt
        add(b)
        return b
      })
      const pts = heights.map((hgt, i) => new THREE.Vector3(-0.33 + i * 0.22, 0.6 + hgt + 0.12, 0.12))
      const line = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.022, 6), m.glow, false)
      add(line)
      const dots = pts.map((p) => {
        const s = mesh(new THREE.SphereGeometry(0.045, 12, 8), m.glowIce, false)
        s.position.copy(p)
        add(s)
        return s
      })
      tick = (t) => {
        bars.forEach((b, i) => {
          const h = (b.userData.h as number) * (1 + Math.sin(t * 1.4 + i) * 0.06)
          b.scale.y = h
          b.position.y = 0.47 + h / 2
        })
        dots.forEach((d, i) => d.scale.setScalar(1 + Math.max(0, Math.sin(t * 3 - i)) * 0.5))
      }
      break
    }
    case "ai": {
      const ped = mesh(new THREE.CylinderGeometry(0.22, 0.36, 0.3, 6), m.shell)
      ped.position.y = 0.52
      add(ped)
      const orb = mesh(new THREE.IcosahedronGeometry(0.28, 2), m.glow, false)
      orb.position.y = 1.08
      add(orb)
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 1),
        new THREE.MeshBasicMaterial({ color: 0x9fc0ff, wireframe: true, transparent: true, opacity: 0.5 }),
      )
      shell.position.y = 1.08
      add(shell)
      const ring = mesh(new THREE.TorusGeometry(0.55, 0.018, 6, 48), m.glowIce, false)
      ring.position.y = 1.08
      add(ring)
      // Burbuja de chat
      const bubble = mesh(new RoundedBoxGeometry(0.5, 0.3, 0.1, 3, 0.08), m.white)
      bubble.position.set(0.45, 1.55, 0)
      add(bubble)
      const tail = mesh(new THREE.ConeGeometry(0.06, 0.14, 4), m.white)
      tail.position.set(0.32, 1.38, 0)
      tail.rotation.z = Math.PI * 0.85
      add(tail)
      const dots = [0, 1, 2].map((i) => {
        const d = mesh(new THREE.SphereGeometry(0.035, 10, 8), m.primary, false)
        d.position.set(0.33 + i * 0.12, 1.55, 0.055)
        add(d)
        return d
      })
      tick = (t) => {
        orb.rotation.set(t * 0.6, t * 0.9, 0)
        shell.rotation.set(-t * 0.3, -t * 0.4, 0)
        ring.rotation.set(Math.PI / 2 + Math.sin(t) * 0.5, 0, t)
        const p = 1 + Math.sin(t * 2.4) * 0.08
        orb.scale.setScalar(p)
        dots.forEach((d, i) => (d.position.y = 1.55 + Math.max(0, Math.sin(t * 5 - i * 0.8)) * 0.04))
      }
      break
    }
    case "api": {
      const hub = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 12), m.shell)
      hub.position.y = 0.62
      add(hub)
      const band = mesh(new THREE.TorusGeometry(0.31, 0.025, 6, 24), m.glow, false)
      band.rotation.x = Math.PI / 2
      band.position.y = 0.7
      add(band)
      const plugs: THREE.Group[] = []
      for (let i = 0; i < 3; i += 1) {
        const a = (i / 3) * Math.PI * 2 + 0.4
        const g = new THREE.Group()
        const cableCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0.62, 0),
          new THREE.Vector3(Math.cos(a) * 0.55, 1.15, Math.sin(a) * 0.55),
          new THREE.Vector3(Math.cos(a) * 0.62, 0.95, Math.sin(a) * 0.62),
        )
        add(mesh(new THREE.TubeGeometry(cableCurve, 20, 0.035, 6), m.shellDark))
        const plug = mesh(new RoundedBoxGeometry(0.16, 0.22, 0.12, 2, 0.03), i === 0 ? m.primary : m.trim)
        g.add(plug)
        for (const dx of [-0.04, 0.04]) {
          const prong = mesh(new THREE.BoxGeometry(0.025, 0.1, 0.025), m.gold, false)
          prong.position.set(dx, -0.15, 0)
          g.add(prong)
        }
        g.position.set(Math.cos(a) * 0.62, 0.95, Math.sin(a) * 0.62)
        g.userData.base = 0.95
        add(g)
        plugs.push(g)
      }
      const cap = mesh(new THREE.SphereGeometry(0.12, 16, 10), m.glowIce, false)
      cap.position.y = 0.88
      add(cap)
      tick = (t) => {
        plugs.forEach((g, i) => (g.position.y = (g.userData.base as number) + Math.sin(t * 2 + i * 2) * 0.05))
        band.scale.setScalar(1 + Math.sin(t * 3) * 0.03)
      }
      break
    }
    case "notifications": {
      const pts: THREE.Vector2[] = []
      for (let i = 0; i <= 12; i += 1) {
        const y = i / 12
        const r = 0.12 + Math.pow(y, 1.8) * 0.3 + (i === 12 ? 0.04 : 0)
        pts.push(new THREE.Vector2(r, y * 0.55))
      }
      const bell = mesh(new THREE.LatheGeometry(pts, 24), m.gold)
      bell.rotation.x = Math.PI
      const bellGroup = new THREE.Group()
      bell.position.y = 0.55
      bellGroup.add(bell)
      const clapper = mesh(new THREE.SphereGeometry(0.07, 12, 8), m.trim)
      clapper.position.y = -0.04
      bellGroup.add(clapper)
      const knob = mesh(new THREE.SphereGeometry(0.06, 12, 8), m.gold)
      knob.position.y = 0.6
      bellGroup.add(knob)
      bellGroup.position.y = 0.62
      add(bellGroup)
      const badge = mesh(new THREE.SphereGeometry(0.1, 16, 10), m.danger, false)
      badge.position.set(0.28, 1.15, 0.05)
      add(badge)
      const waves = [0, 1, 2].map((i) => {
        const w = new THREE.Mesh(
          new THREE.TorusGeometry(0.5 + i * 0.16, 0.012, 6, 32, Math.PI / 2.2),
          new THREE.MeshBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.6 }),
        )
        w.position.set(0, 0.95, 0)
        w.rotation.z = Math.PI / 4 - 0.15
        add(w)
        return w
      })
      tick = (t) => {
        const ring = Math.sin(t * 7) * Math.max(0, Math.sin(t * 0.9)) * 0.35
        bellGroup.rotation.z = ring
        badge.scale.setScalar(1 + Math.max(0, Math.sin(t * 3)) * 0.25)
        waves.forEach((w, i) => ((w.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.max(0, Math.sin(t * 3 - i)) * 0.6))
      }
      break
    }
    case "maps": {
      const map = canvasTexture(256, 256)
      const c = map.ctx
      c.fillStyle = "#1a2a44"
      c.fillRect(0, 0, 256, 256)
      c.fillStyle = "#1f4a3a"
      c.beginPath()
      c.arc(60, 70, 50, 0, Math.PI * 2)
      c.fill()
      c.strokeStyle = "#3a4f75"
      c.lineWidth = 10
      ;[60, 140, 210].forEach((y) => {
        c.beginPath()
        c.moveTo(0, y)
        c.lineTo(256, y - 30)
        c.stroke()
      })
      c.beginPath()
      c.moveTo(120, 0)
      c.lineTo(160, 256)
      c.stroke()
      c.strokeStyle = "#4f8cff"
      c.lineWidth = 8
      c.setLineDash([16, 10])
      c.beginPath()
      c.moveTo(30, 230)
      c.bezierCurveTo(100, 220, 90, 120, 190, 90)
      c.stroke()
      map.texture.needsUpdate = true
      const plate = mesh(new RoundedBoxGeometry(1.05, 0.06, 1.05, 2, 0.03), new THREE.MeshStandardMaterial({ map: map.texture, roughness: 0.8 }))
      plate.position.y = 0.42
      // Mapa plegado: dos mitades inclinadas
      plate.rotation.z = 0.05
      add(plate)
      const pinGroup = new THREE.Group()
      const head = mesh(new THREE.SphereGeometry(0.16, 20, 14), m.danger)
      head.position.y = 0.36
      pinGroup.add(head)
      const tip = mesh(new THREE.ConeGeometry(0.11, 0.3, 16), m.danger)
      tip.rotation.x = Math.PI
      tip.position.y = 0.18
      pinGroup.add(tip)
      const dot = mesh(new THREE.SphereGeometry(0.06, 12, 8), m.white, false)
      dot.position.set(0, 0.38, 0.13)
      pinGroup.add(dot)
      pinGroup.position.set(0.22, 0.46, -0.12)
      add(pinGroup)
      const ripple = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.16, 32),
        new THREE.MeshBasicMaterial({ color: LAB_COLORS.danger, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
      )
      ripple.rotation.x = -Math.PI / 2
      ripple.position.set(0.22, 0.47, -0.12)
      add(ripple)
      tick = (t) => {
        const b = Math.abs(Math.sin(t * 2.2))
        pinGroup.position.y = 0.46 + b * 0.18
        const k = (t * 0.9) % 1
        ripple.scale.setScalar(1 + k * 2.5)
        ;(ripple.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k)
      }
      break
    }
    case "inventory": {
      for (const x of [-0.42, 0.42]) {
        for (const z of [-0.25, 0.25]) {
          const post = mesh(new THREE.BoxGeometry(0.05, 1.05, 0.05), m.trim)
          post.position.set(x, 0.88, z)
          add(post)
        }
      }
      ;[0.55, 0.92, 1.29].forEach((y) => {
        const shelf = mesh(new THREE.BoxGeometry(0.92, 0.04, 0.56), m.shellDark)
        shelf.position.set(0, y - 0.02, 0)
        add(shelf)
      })
      const rng = createRng(3)
      const boxGeo = new RoundedBoxGeometry(1, 1, 1, 1, 0.06)
      const boxes = new THREE.InstancedMesh(boxGeo, m.box, 8)
      const d = new THREE.Object3D()
      let i = 0
      ;[0.55, 0.92].forEach((y) => {
        for (let k = 0; k < 4 && i < 8; k += 1) {
          const s = 0.16 + rng.next() * 0.08
          d.position.set(-0.3 + k * 0.2, y + s / 2, (rng.next() - 0.5) * 0.15)
          d.rotation.y = (rng.next() - 0.5) * 0.4
          d.scale.setScalar(s)
          d.updateMatrix()
          boxes.setMatrixAt(i, d.matrix)
          i += 1
        }
      })
      boxes.castShadow = true
      add(boxes)
      const scanner = mesh(new THREE.BoxGeometry(0.9, 0.015, 0.02), m.success, false)
      scanner.position.set(0, 1.0, 0.3)
      add(scanner)
      const topBox = mesh(new RoundedBoxGeometry(0.26, 0.2, 0.22, 1, 0.03), m.box)
      topBox.position.set(0.15, 1.42, 0)
      add(topBox)
      tick = (t) => {
        scanner.position.y = 0.6 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.7
      }
      break
    }
    case "cloud": {
      const rack = mesh(new RoundedBoxGeometry(0.55, 0.75, 0.45, 2, 0.04), m.shell)
      rack.position.y = 0.73
      add(rack)
      const lights: THREE.Mesh[] = []
      for (let i = 0; i < 4; i += 1) {
        const slot = mesh(new THREE.BoxGeometry(0.44, 0.04, 0.01), m.shellDark, false)
        slot.position.set(0, 0.48 + i * 0.16, 0.23)
        add(slot)
        const led = mesh(new THREE.BoxGeometry(0.05, 0.03, 0.012), i % 2 ? m.success : m.glow, false)
        led.position.set(0.17, 0.48 + i * 0.16, 0.234)
        add(led)
        lights.push(led)
      }
      const cloud = new THREE.Group()
      ;[
        [0, 0, 0.3],
        [-0.28, -0.06, 0.22],
        [0.3, -0.05, 0.24],
        [0.12, 0.12, 0.22],
        [-0.12, 0.1, 0.2],
      ].forEach(([x, y, r]) => {
        const s = mesh(new THREE.SphereGeometry(r, 20, 14), m.white)
        s.position.set(x, y, 0)
        cloud.add(s)
      })
      cloud.position.y = 1.55
      add(cloud)
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8, 1, true),
        new THREE.MeshBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.5 }),
      )
      beam.position.y = 1.22
      add(beam)
      tick = (t) => {
        cloud.position.y = 1.55 + Math.sin(t * 1.2) * 0.06
        cloud.rotation.y = Math.sin(t * 0.5) * 0.3
        lights.forEach((l, i) => (l.visible = Math.sin(t * 6 + i * 1.7) > -0.3))
      }
      break
    }
  }
  return { root, tick }
}

// ---------- Fondo: estrellas, cresta del Ávila y luces de la ciudad ----------
export function createBackdrop(ridgePoints: [number, number][], summit: { x: number; y: number }) {
  const root = new THREE.Group()
  const rng = createRng(11)

  const starCount = 1400
  const starPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i += 1) {
    const theta = rng.next() * Math.PI * 2
    const phi = Math.acos(rng.range(0.05, 1))
    const r = 120
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    starPos[i * 3 + 1] = r * Math.cos(phi) - 10
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.45, sizeAttenuation: true, transparent: true, opacity: 0.85, fog: false }),
  )
  root.add(stars)

  // Cresta del Ávila extruida al fondo (lienzo 1440 × 200 → mundo)
  const W = 170
  const H = 26
  const toWorld = (x: number, y: number) => new THREE.Vector2((x / 1440 - 0.5) * W, ((200 - y) / 200) * H - 38)
  const shape = new THREE.Shape()
  const first = toWorld(0, 200)
  shape.moveTo(first.x, first.y - 70)
  ridgePoints.forEach(([x, y]) => {
    const p = toWorld(x, y)
    shape.lineTo(p.x, p.y)
  })
  const last = toWorld(1440, 200)
  shape.lineTo(last.x, last.y - 70)
  shape.closePath()
  const ridge = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 0x111a2d, fog: false }))
  ridge.position.z = -70
  root.add(ridge)
  const linePts = ridgePoints.map(([x, y]) => {
    const p = toWorld(x, y)
    return new THREE.Vector3(p.x, p.y, -69.9)
  })
  const ridgeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(linePts),
    new THREE.LineBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.55, fog: false }),
  )
  root.add(ridgeLine)
  const sp = toWorld(summit.x, summit.y)
  const summitLight = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshBasicMaterial({ color: 0xdbe7ff, fog: false, toneMapped: false }))
  summitLight.position.set(sp.x, sp.y, -69.5)
  root.add(summitLight)
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 32),
    new THREE.MeshBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.18, fog: false, depthWrite: false }),
  )
  halo.position.set(sp.x, sp.y, -69.6)
  root.add(halo)

  // Valle de Caracas: luces cálidas y frías dispersas por debajo de la isla
  const cityCount = 900
  const cityPos = new Float32Array(cityCount * 3)
  const cityCol = new Float32Array(cityCount * 3)
  const warm = new THREE.Color(LAB_COLORS.warm)
  const cool = new THREE.Color(0x9fc0ff)
  for (let i = 0; i < cityCount; i += 1) {
    const x = rng.range(-80, 80)
    const z = rng.range(-64, 10)
    cityPos[i * 3] = x
    cityPos[i * 3 + 1] = -34 + rng.range(-0.5, 0.5)
    cityPos[i * 3 + 2] = z
    const col = rng.chance(0.75) ? warm : cool
    const k = rng.range(0.45, 1)
    cityCol[i * 3] = col.r * k
    cityCol[i * 3 + 1] = col.g * k
    cityCol[i * 3 + 2] = col.b * k
  }
  const cityGeo = new THREE.BufferGeometry()
  cityGeo.setAttribute("position", new THREE.BufferAttribute(cityPos, 3))
  cityGeo.setAttribute("color", new THREE.BufferAttribute(cityCol, 3))
  const city = new THREE.Points(cityGeo, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.9 }))
  root.add(city)

  return {
    root,
    tick(t: number) {
      ;(stars.material as THREE.PointsMaterial).opacity = 0.75 + Math.sin(t * 0.8) * 0.1
      halo.scale.setScalar(1 + Math.sin(t * 1.5) * 0.12)
    },
  }
}
