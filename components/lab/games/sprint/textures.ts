// Texturas procedurales del Sprint: glifos de tareas, letreros, pantallas y banda.
// Todo se dibuja en canvas para no depender de imágenes externas.
import * as THREE from "three"

export type TaskKind = "web" | "movil" | "cloud"
export type Dir = "left" | "center" | "right"

export const KIND_DIR: Record<TaskKind, Dir> = { web: "left", movil: "center", cloud: "right" }
export const DIR_KIND: Record<Dir, TaskKind> = { left: "web", center: "movil", right: "cloud" }

export const KIND_HEX: Record<TaskKind, string> = {
  web: "#4F8CFF",
  movil: "#34D399",
  cloud: "#DCE6F5",
}
export const HOTFIX_HEX = "#FFC46B"
export const BUG_HEX = "#FF4D5E"
const NIGHT = "#0B0F1A"

function fontFamily() {
  if (typeof document === "undefined") return "sans-serif"
  return getComputedStyle(document.body).fontFamily || "sans-serif"
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d")!
  return { c, ctx }
}

function toTexture(c: HTMLCanvasElement, opts: { repeat?: [number, number]; srgb?: boolean } = {}) {
  const tex = new THREE.CanvasTexture(c)
  if (opts.srgb !== false) tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  if (opts.repeat) {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(opts.repeat[0], opts.repeat[1])
  }
  return tex
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Glifo de cada tipo de tarea, centrado en (cx, cy) con tamaño s. */
export function drawGlyph(ctx: CanvasRenderingContext2D, kind: TaskKind, cx: number, cy: number, s: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = s * 0.07
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  if (kind === "web") {
    const w = s * 0.9
    const h = s * 0.66
    rr(ctx, cx - w / 2, cy - h / 2, w, h, s * 0.08)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - w / 2, cy - h / 2 + s * 0.18)
    ctx.lineTo(cx + w / 2, cy - h / 2 + s * 0.18)
    ctx.stroke()
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath()
      ctx.arc(cx - w / 2 + s * (0.1 + i * 0.09), cy - h / 2 + s * 0.09, s * 0.03, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.moveTo(cx - w * 0.32, cy + s * 0.06)
    ctx.lineTo(cx - w * 0.44, cy + s * 0.14)
    ctx.lineTo(cx - w * 0.32, cy + s * 0.22)
    ctx.moveTo(cx + w * 0.32, cy + s * 0.06)
    ctx.lineTo(cx + w * 0.44, cy + s * 0.14)
    ctx.lineTo(cx + w * 0.32, cy + s * 0.22)
    ctx.moveTo(cx + s * 0.06, cy + s * 0.02)
    ctx.lineTo(cx - s * 0.06, cy + s * 0.26)
    ctx.stroke()
  } else if (kind === "movil") {
    const w = s * 0.46
    const h = s * 0.84
    rr(ctx, cx - w / 2, cy - h / 2, w, h, s * 0.09)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - s * 0.06, cy - h / 2 + s * 0.09)
    ctx.lineTo(cx + s * 0.06, cy - h / 2 + s * 0.09)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy + h / 2 - s * 0.11, s * 0.04, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    const y = cy + s * 0.08
    ctx.moveTo(cx - s * 0.32, y + s * 0.18)
    ctx.arc(cx - s * 0.26, y + s * 0.02, s * 0.16, Math.PI * 0.55, Math.PI * 1.5)
    ctx.arc(cx - s * 0.02, y - s * 0.12, s * 0.24, Math.PI * 1.1, Math.PI * 1.95)
    ctx.arc(cx + s * 0.27, y + s * 0.03, s * 0.15, Math.PI * 1.45, Math.PI * 0.45)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, y + s * 0.12)
    ctx.lineTo(cx, y - s * 0.06)
    ctx.moveTo(cx - s * 0.08, y + s * 0.02)
    ctx.lineTo(cx, y - s * 0.07)
    ctx.lineTo(cx + s * 0.08, y + s * 0.02)
    ctx.stroke()
  }
  ctx.restore()
}

/** Calcomanía superior de una tarea: placa azul noche con el glifo en su color. */
export function taskDecalTexture(kind: TaskKind, hotfix: boolean) {
  const { c, ctx } = makeCanvas(256, 256)
  const color = hotfix ? HOTFIX_HEX : KIND_HEX[kind]
  rr(ctx, 10, 10, 236, 236, 44)
  ctx.fillStyle = NIGHT
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.55
  ctx.stroke()
  ctx.globalAlpha = 1
  drawGlyph(ctx, kind, 128, 128, 168, color)
  if (hotfix) {
    ctx.fillStyle = HOTFIX_HEX
    ctx.beginPath()
    ctx.moveTo(206, 22)
    ctx.lineTo(186, 62)
    ctx.lineTo(202, 62)
    ctx.lineTo(190, 96)
    ctx.lineTo(222, 50)
    ctx.lineTo(206, 50)
    ctx.closePath()
    ctx.fill()
  }
  return toTexture(c)
}

/** Letrero del muelle en el piso: glifo + nombre. Se redibuja al cambiar el idioma. */
export function drawSign(c: HTMLCanvasElement, kind: TaskKind, label: string, key: string) {
  const ctx = c.getContext("2d")!
  ctx.clearRect(0, 0, c.width, c.height)
  const color = KIND_HEX[kind]
  rr(ctx, 6, 6, c.width - 12, c.height - 12, 40)
  ctx.fillStyle = "rgba(11,15,26,0.92)"
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = color
  ctx.stroke()
  drawGlyph(ctx, kind, 92, c.height / 2, 120, color)
  ctx.fillStyle = "#F8FAFC"
  ctx.font = `700 78px ${fontFamily()}`
  ctx.textBaseline = "middle"
  ctx.fillText(label, 170, c.height / 2 + 4)
  // tecla asociada
  const kx = c.width - 104
  rr(ctx, kx, c.height / 2 - 40, 80, 80, 16)
  ctx.lineWidth = 5
  ctx.strokeStyle = "rgba(248,250,252,0.5)"
  ctx.stroke()
  ctx.fillStyle = "rgba(248,250,252,0.85)"
  ctx.font = `700 50px ${fontFamily()}`
  ctx.textAlign = "center"
  ctx.fillText(key, kx + 40, c.height / 2 + 3)
  ctx.textAlign = "left"
}

export function signTexture(kind: TaskKind, label: string, key: string) {
  const { c } = makeCanvas(640, 180)
  drawSign(c, kind, label, key)
  return { texture: toTexture(c), canvas: c }
}

/** Banda transportadora: caucho oscuro con chevrones que marcan la dirección. */
export function beltTexture() {
  const { c, ctx } = makeCanvas(128, 128)
  ctx.fillStyle = "#151c2b"
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = "#1b2436"
  for (let y = 0; y < 128; y += 16) ctx.fillRect(0, y, 128, 7)
  ctx.strokeStyle = "rgba(79,140,255,0.32)"
  ctx.lineWidth = 7
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(34, 50)
  ctx.lineTo(64, 78)
  ctx.lineTo(94, 50)
  ctx.stroke()
  ctx.fillStyle = "rgba(0,0,0,0.35)"
  ctx.fillRect(0, 0, 6, 128)
  ctx.fillRect(122, 0, 6, 128)
  return toTexture(c, { repeat: [1, 6] })
}

/** Piso del taller: retícula técnica azul tenue. */
export function floorTexture() {
  const { c, ctx } = makeCanvas(256, 256)
  ctx.fillStyle = "#0d1322"
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = "rgba(148,163,184,0.07)"
  ctx.lineWidth = 1
  for (let i = 0; i <= 256; i += 32) {
    ctx.beginPath()
    ctx.moveTo(i + 0.5, 0)
    ctx.lineTo(i + 0.5, 256)
    ctx.moveTo(0, i + 0.5)
    ctx.lineTo(256, i + 0.5)
    ctx.stroke()
  }
  ctx.strokeStyle = "rgba(79,140,255,0.16)"
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, 254, 254)
  ctx.fillStyle = "rgba(79,140,255,0.28)"
  for (const [x, y] of [[0, 0], [256, 0], [0, 256], [256, 256]]) {
    ctx.fillRect(x - 6, y - 1, 12, 2)
    ctx.fillRect(x - 1, y - 6, 2, 12)
  }
  return toTexture(c, { repeat: [14, 14] })
}

/** Pantalla del portátil: un navegador con un sitio en construcción. */
export function browserScreenTexture() {
  const { c, ctx } = makeCanvas(512, 320)
  ctx.fillStyle = "#0f1626"
  ctx.fillRect(0, 0, 512, 320)
  ctx.fillStyle = "#1a2337"
  ctx.fillRect(0, 0, 512, 40)
  ;["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(22 + i * 20, 20, 6, 0, Math.PI * 2)
    ctx.fill()
  })
  rr(ctx, 90, 10, 330, 20, 10)
  ctx.fillStyle = "#0f1626"
  ctx.fill()
  ctx.fillStyle = "rgba(148,163,184,0.7)"
  ctx.font = `600 12px ${fontFamily()}`
  ctx.fillText("avilasystem.com", 108, 24)
  ctx.fillStyle = "#4F8CFF"
  rr(ctx, 32, 68, 230, 26, 6)
  ctx.fill()
  ctx.fillStyle = "rgba(220,230,245,0.55)"
  rr(ctx, 32, 106, 300, 12, 6)
  ctx.fill()
  rr(ctx, 32, 126, 250, 12, 6)
  ctx.fill()
  ctx.fillStyle = "#2563EB"
  rr(ctx, 32, 156, 110, 30, 15)
  ctx.fill()
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = "#18233a"
    rr(ctx, 32 + i * 152, 212, 136, 84, 10)
    ctx.fill()
    ctx.fillStyle = "rgba(79,140,255,0.6)"
    rr(ctx, 46 + i * 152, 226, 36, 36, 8)
    ctx.fill()
    ctx.fillStyle = "rgba(220,230,245,0.4)"
    rr(ctx, 46 + i * 152, 272, 96, 8, 4)
    ctx.fill()
  }
  ctx.strokeStyle = "rgba(79,140,255,0.5)"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(320, 170)
  ;[[350, 140], [380, 150], [410, 110], [440, 120], [470, 80]].forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.stroke()
  return toTexture(c)
}

/** Pantalla del teléfono: una app con tarjetas y barra de pestañas. */
export function phoneScreenTexture() {
  const { c, ctx } = makeCanvas(256, 480)
  ctx.fillStyle = "#0f1626"
  ctx.fillRect(0, 0, 256, 480)
  rr(ctx, 98, 14, 60, 14, 7)
  ctx.fillStyle = "#05070d"
  ctx.fill()
  ctx.fillStyle = "#34D399"
  rr(ctx, 20, 52, 120, 20, 6)
  ctx.fill()
  ctx.fillStyle = "rgba(220,230,245,0.5)"
  rr(ctx, 20, 82, 170, 10, 5)
  ctx.fill()
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = "#18233a"
    rr(ctx, 20, 112 + i * 76, 216, 64, 12)
    ctx.fill()
    ctx.fillStyle = i === 0 ? "#34D399" : "rgba(79,140,255,0.6)"
    ctx.beginPath()
    ctx.arc(50, 144 + i * 76, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(220,230,245,0.45)"
    rr(ctx, 78, 132 + i * 76, 120, 9, 4)
    ctx.fill()
    rr(ctx, 78, 150 + i * 76, 80, 9, 4)
    ctx.fill()
  }
  ctx.fillStyle = "#151d2f"
  ctx.fillRect(0, 420, 256, 60)
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i === 0 ? "#34D399" : "rgba(148,163,184,0.6)"
    rr(ctx, 30 + i * 56, 438, 22, 22, 6)
    ctx.fill()
  }
  return toTexture(c)
}

/** Frente del rack: unidades con rejillas de ventilación. */
export function rackTexture() {
  const { c, ctx } = makeCanvas(256, 512)
  ctx.fillStyle = "#111827"
  ctx.fillRect(0, 0, 256, 512)
  for (let u = 0; u < 8; u += 1) {
    const y = 14 + u * 61
    ctx.fillStyle = "#1a2234"
    rr(ctx, 14, y, 228, 52, 6)
    ctx.fill()
    ctx.fillStyle = "#0b101b"
    for (let v = 0; v < 9; v += 1) {
      rr(ctx, 96 + v * 15, y + 12, 7, 28, 3)
      ctx.fill()
    }
    ctx.fillStyle = "rgba(148,163,184,0.35)"
    ctx.beginPath()
    ctx.arc(26, y + 26, 4, 0, Math.PI * 2)
    ctx.arc(230, y + 26, 4, 0, Math.PI * 2)
    ctx.fill()
  }
  return toTexture(c)
}

export function keyboardTexture() {
  const { c, ctx } = makeCanvas(512, 320)
  ctx.fillStyle = "#1c2435"
  ctx.fillRect(0, 0, 512, 320)
  ctx.fillStyle = "#0f1524"
  for (let r = 0; r < 5; r += 1) {
    for (let k = 0; k < 14; k += 1) {
      rr(ctx, 26 + k * 33, 22 + r * 34, 27, 27, 5)
      ctx.fill()
    }
  }
  rr(ctx, 170, 200, 172, 96, 10)
  ctx.fillStyle = "#161e2e"
  ctx.fill()
  return toTexture(c)
}

/** Letrero del portal del backlog. */
export function portalSignTexture(label: string) {
  const { c, ctx } = makeCanvas(512, 96)
  rr(ctx, 4, 4, 504, 88, 20)
  ctx.fillStyle = "#0B0F1A"
  ctx.fill()
  ctx.strokeStyle = "rgba(79,140,255,0.8)"
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.fillStyle = "#DCE6F5"
  ctx.font = `700 46px ${fontFamily()}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(label, 256, 50)
  return { texture: toTexture(c), canvas: c }
}

/** Disco brillante para el interior del portal y destellos. */
export function glowTexture(inner = "rgba(160,200,255,1)", outer = "rgba(37,99,235,0)") {
  const { c, ctx } = makeCanvas(128, 128)
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, inner)
  g.addColorStop(0.35, "rgba(79,140,255,0.55)")
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return toTexture(c)
}

/** Flecha del plato giratorio. */
export function arrowTexture() {
  const { c, ctx } = makeCanvas(128, 128)
  ctx.fillStyle = "rgba(248,250,252,0.95)"
  ctx.beginPath()
  ctx.moveTo(64, 8)
  ctx.lineTo(112, 62)
  ctx.lineTo(80, 62)
  ctx.lineTo(80, 120)
  ctx.lineTo(48, 120)
  ctx.lineTo(48, 62)
  ctx.lineTo(16, 62)
  ctx.closePath()
  ctx.fill()
  return toTexture(c)
}

const KANBAN_COLS = {
  es: ["POR HACER", "EN CURSO", "HECHO"],
  en: ["TO DO", "DOING", "DONE"],
}

/** Tablero kanban del taller: columnas con notas. Se redibuja al cambiar el idioma. */
export function drawKanban(c: HTMLCanvasElement, lang: "es" | "en", seed: number) {
  const ctx = c.getContext("2d")!
  const W = c.width
  const H = c.height
  ctx.clearRect(0, 0, W, H)
  rr(ctx, 4, 4, W - 8, H - 8, 18)
  ctx.fillStyle = "#121a2b"
  ctx.fill()
  ctx.strokeStyle = "rgba(79,140,255,0.45)"
  ctx.lineWidth = 4
  ctx.stroke()
  const colW = (W - 40) / 3
  const notes = ["#4F8CFF", "#34D399", "#DCE6F5", "#FFC46B"]
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  KANBAN_COLS[lang].forEach((title, i) => {
    const x = 20 + i * colW
    ctx.fillStyle = "rgba(220,230,245,0.75)"
    ctx.font = `700 26px ${fontFamily()}`
    ctx.fillText(title, x + 12, 50)
    if (i > 0) {
      ctx.fillStyle = "rgba(148,163,184,0.18)"
      ctx.fillRect(x - 4, 26, 2, H - 52)
    }
    const count = i === 1 ? 3 : i === 2 ? 5 : 4
    for (let n = 0; n < count; n += 1) {
      const nx = x + 12 + (n % 2) * (colW / 2 - 6)
      const ny = 72 + Math.floor(n / 2) * 84
      ctx.save()
      ctx.translate(nx + 40, ny + 34)
      ctx.rotate((rnd() - 0.5) * 0.12)
      rr(ctx, -40, -34, colW / 2 - 18, 68, 8)
      ctx.fillStyle = notes[Math.floor(rnd() * notes.length)]
      ctx.globalAlpha = i === 2 ? 0.55 : 0.9
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = "rgba(11,15,26,0.55)"
      rr(ctx, -30, -20, colW / 2 - 50, 8, 4)
      ctx.fill()
      rr(ctx, -30, -4, colW / 2 - 70, 8, 4)
      ctx.fill()
      if (i === 2) {
        ctx.strokeStyle = "#0B0F1A"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(-28, 16)
        ctx.lineTo(-20, 24)
        ctx.lineTo(-6, 8)
        ctx.stroke()
      }
      ctx.restore()
    }
  })
}

export function kanbanTexture(lang: "es" | "en", seed: number) {
  const { c } = makeCanvas(640, 400)
  drawKanban(c, lang, seed)
  return { texture: toTexture(c), canvas: c }
}
