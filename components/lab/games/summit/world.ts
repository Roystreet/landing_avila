// Mundo de "Sube el Ávila": sendero nocturno de Caracas a la cumbre.
// Todo es procedural: terreno, bosque, Caracas iluminada, teleférico y la luz de la cima.
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { RIDGE_POINTS } from "@/components/brand/ridge"
import { createRng, disposeScene, LAB_COLORS, mergeStatic } from "@/components/lab/engine/core"
import type { NatureKit } from "@/components/lab/games/summit/assets"
import { populateWithKit } from "@/components/lab/games/summit/vegetation"

export const TRACK_LENGTH = 1500
export const SLOPE = 0.13
export const LANE_X = [-1.9, 0, 1.9] as const
export const TRAIL_HALF = 3.4
export const WORLD_START = 60
export const WORLD_END = TRACK_LENGTH + 120

/** Altura del sendero en la coordenada z (z negativa = más arriba). */
export const groundY = (z: number) => {
  const d = -z
  if (d <= TRACK_LENGTH + 4) return d * SLOPE
  // Pasada la cumbre el terreno cae: el pico queda recortado contra el cielo
  return (TRACK_LENGTH + 4) * SLOPE - (d - TRACK_LENGTH - 4) * 0.45
}

// ---------- Ruido ----------
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
export function fbm(x: number, y: number) {
  let total = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < 4; i += 1) {
    total += valueNoise(x * freq, y * freq) * amp
    freq *= 2.03
    amp *= 0.5
  }
  return total
}

/** Altura del terreno a los lados del sendero: ladera que sube a la derecha, barranco a la izquierda. */
export function terrainOffset(x: number, z: number) {
  const ax = Math.abs(x)
  if (ax < TRAIL_HALF) return -0.04
  const edge = ax - TRAIL_HALF
  const n = fbm(x * 0.05, z * 0.05)
  const ripple = fbm(x * 0.18 + 10, z * 0.18) * 1.2
  if (x > 0) return Math.min(edge * 0.55, 3 + edge * 0.9) + n * 9 * Math.min(1, edge / 8) + ripple * Math.min(1, edge / 2)
  // Barranco hacia el valle de Caracas
  const drop = edge < 2.2 ? -edge * 0.12 : -0.26 - (edge - 2.2) * 1.15
  return Math.max(drop, -70) + n * 6 * Math.min(1, edge / 10) + ripple * 0.5
}

// ---------- Texturas de lienzo ----------
function trailTexture() {
  const c = document.createElement("canvas")
  c.width = 256
  c.height = 512
  const g = c.getContext("2d")!
  g.fillStyle = "#3a3026"
  g.fillRect(0, 0, 256, 512)
  const rng = createRng(7)
  for (let i = 0; i < 2600; i += 1) {
    const l = 18 + rng.next() * 22
    g.fillStyle = `hsl(${28 + rng.next() * 12} ${18 + rng.next() * 14}% ${l}%)`
    const r = rng.next() * 2.2 + 0.4
    g.fillRect(rng.next() * 256, rng.next() * 512, r, r)
  }
  for (let i = 0; i < 70; i += 1) {
    const x = rng.next() * 256
    const y = rng.next() * 512
    const r = 2 + rng.next() * 5
    g.fillStyle = `hsl(220 6% ${30 + rng.next() * 22}%)`
    g.beginPath()
    g.ellipse(x, y, r, r * 0.7, rng.next() * 3, 0, Math.PI * 2)
    g.fill()
  }
  // Bordes oscuros con hojarasca
  const grad = g.createLinearGradient(0, 0, 256, 0)
  grad.addColorStop(0, "rgba(20,30,18,0.9)")
  grad.addColorStop(0.12, "rgba(20,30,18,0)")
  grad.addColorStop(0.88, "rgba(20,30,18,0)")
  grad.addColorStop(1, "rgba(20,30,18,0.9)")
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 512)
  // Huellas tenues en el centro de cada carril
  g.fillStyle = "rgba(15,10,6,0.25)"
  for (let lane = 0; lane < 3; lane += 1) {
    const cx = 52 + lane * 76
    for (let y = 0; y < 512; y += 46) {
      g.beginPath()
      g.ellipse(cx + (y % 92 ? 7 : -7), y + 10, 5, 9, 0, 0, Math.PI * 2)
      g.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function signTexture(text: string, sub: string) {
  const c = document.createElement("canvas")
  c.width = 512
  c.height = 192
  const g = c.getContext("2d")!
  g.fillStyle = "#5b3a22"
  g.fillRect(0, 0, 512, 192)
  for (let y = 0; y < 192; y += 6) {
    g.fillStyle = `rgba(0,0,0,${0.05 + (y % 18 === 0 ? 0.12 : 0)})`
    g.fillRect(0, y, 512, 2)
  }
  g.strokeStyle = "#f4e3c4"
  g.lineWidth = 6
  g.strokeRect(14, 14, 484, 164)
  g.fillStyle = "#f4e3c4"
  g.textAlign = "center"
  g.font = "700 58px Montserrat, system-ui, sans-serif"
  g.fillText(text, 256, 100)
  g.font = "600 30px Montserrat, system-ui, sans-serif"
  g.fillText(sub, 256, 148)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const g = c.getContext("2d")!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.25, outer)
  grad.addColorStop(1, "rgba(0,0,0,0)")
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Una sola textura de brillo para todos los sprites (antes se creaba una por sprite)
let glowCache: THREE.Texture | null = null
export const sharedGlow = () => {
  if (!glowCache || !glowCache.image) glowCache = glowTexture("rgba(255,255,255,1)", "rgba(160,196,255,0.45)")
  return glowCache
}

// ---------- Construcción del mundo ----------
export type SummitWorld = {
  root: THREE.Group
  beacon: THREE.Group
  beaconLight: THREE.PointLight
  cabins: { mesh: THREE.Group; t: number; speed: number; dir: 1 | -1 }[]
  cable: { a: THREE.Vector3; b: THREE.Vector3; sag: number }
  update: (dt: number, elapsed: number, playerZ: number) => void
  applyKit: (kit: NatureKit, lite?: boolean) => void
  signs: { z: number; group: THREE.Group }[]
}

export function buildWorld(scene: THREE.Scene, milestones: { at: number; name: string; sub: string }[]): SummitWorld {
  const root = new THREE.Group()
  scene.add(root)
  const rng = createRng(1567)

  // Cielo con degradado: azul noche arriba, resplandor tenue de Caracas hacia el valle.
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(0x03050b) },
      mid: { value: new THREE.Color(0x0d1630) },
      horizon: { value: new THREE.Color(0x26375f) },
      city: { value: new THREE.Color(0x6b4a3a) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 city;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 col = mix(horizon, mid, smoothstep(-0.05, 0.25, h));
        col = mix(col, top, smoothstep(0.25, 0.8, h));
        float glow = smoothstep(0.2, -0.9, vDir.x) * smoothstep(0.35, -0.05, h);
        col += city * glow * 0.55;
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), skyMat)
  sky.frustumCulled = false
  sky.renderOrder = -10
  scene.add(sky)

  // Estrellas
  const starCount = 1600
  const starPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i += 1) {
    const u = rng.next() * Math.PI * 2
    const v = rng.range(0.08, 1)
    const r = 1000
    starPos[i * 3] = Math.cos(u) * Math.sqrt(1 - v * v) * r
    starPos[i * 3 + 1] = v * r
    starPos[i * 3 + 2] = Math.sin(u) * Math.sqrt(1 - v * v) * r
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xdbe7ff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85, depthWrite: false }),
  )
  stars.frustumCulled = false
  scene.add(stars)

  // Luna
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("rgba(240,244,255,1)", "rgba(180,200,255,0.25)"), fog: false, depthWrite: false }))
  moon.scale.setScalar(140)
  scene.add(moon)

  // Terreno con color por vértice y sombreado facetado
  const segX = 90
  const segZ = 420
  const width = 190
  const length = WORLD_END + WORLD_START
  const terrainGeo = new THREE.PlaneGeometry(width, length, segX, segZ)
  terrainGeo.rotateX(-Math.PI / 2)
  terrainGeo.translate(0, 0, -(length / 2) + WORLD_START)
  const pos = terrainGeo.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const cGrass = new THREE.Color(0x1d3a2b)
  const cGrassLit = new THREE.Color(0x2c5039)
  const cRock = new THREE.Color(0x3d4352)
  const cDirt = new THREE.Color(0x3a3026)
  const tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i += 1) {
    // Comprime la malla hacia el sendero para tener más detalle cerca
    let x = pos.getX(i)
    const nx = x / (width / 2)
    x = Math.sign(nx) * Math.pow(Math.abs(nx), 1.7) * (width / 2)
    const z = pos.getZ(i)
    const off = terrainOffset(x, z)
    pos.setXYZ(i, x, groundY(z) + off, z)
    const ax = Math.abs(x)
    const n = fbm(x * 0.12, z * 0.12)
    if (ax < TRAIL_HALF + 0.6) tmp.copy(cDirt)
    else if (x < 0 && off < -6) tmp.copy(cRock).lerp(cGrass, n * 0.6)
    else tmp.copy(cGrass).lerp(cGrassLit, n).lerp(cRock, Math.max(0, n - 0.62) * 2)
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }
  terrainGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  terrainGeo.computeVertexNormals()
  const terrain = new THREE.Mesh(
    terrainGeo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, flatShading: true }),
  )
  terrain.receiveShadow = true
  root.add(terrain)

  // Sendero
  const trailGeo = new THREE.PlaneGeometry(TRAIL_HALF * 2, length, 1, 60)
  trailGeo.rotateX(-Math.PI / 2)
  trailGeo.translate(0, 0, -(length / 2) + WORLD_START)
  const tp = trailGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < tp.count; i += 1) tp.setY(i, groundY(tp.getZ(i)) + 0.02)
  trailGeo.computeVertexNormals()
  const trailTex = trailTexture()
  trailTex.repeat.set(1, length / 14)
  const trail = new THREE.Mesh(trailGeo, new THREE.MeshStandardMaterial({ map: trailTex, roughness: 1 }))
  trail.receiveShadow = true
  root.add(trail)

  // Bosque: pinos instanciados con variación de color y escala
  const trunk = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 5).translate(0, 0.6, 0)
  const cones = [0, 1, 2].map((k) => new THREE.ConeGeometry(1.25 - k * 0.3, 1.7, 7).translate(0, 1.5 + k * 0.85, 0))
  const paint = (g: THREE.BufferGeometry, hex: number) => {
    const col = new THREE.Color(hex)
    const arr = new Float32Array(g.attributes.position.count * 3)
    for (let i = 0; i < arr.length; i += 3) arr.set([col.r, col.g, col.b], i)
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3))
    return g
  }
  const pineGeo = mergeGeometries([paint(trunk, 0x3b2a1e), ...cones.map((c, k) => paint(c, [0x1f4a34, 0x24553b, 0x2b6244][k]))])!
  const treeMax = 2400
  const pines = new THREE.InstancedMesh(pineGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true }), treeMax)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3()
  const p = new THREE.Vector3()
  let trees = 0
  for (let i = 0; i < treeMax * 3 && trees < treeMax; i += 1) {
    const side = rng.chance(0.62) ? 1 : -1
    const x = side * (TRAIL_HALF + 1.6 + Math.pow(rng.next(), 1.6) * (side > 0 ? 70 : 45))
    const z = rng.range(-WORLD_END, WORLD_START)
    if (side < 0 && Math.abs(x) < TRAIL_HALF + 3) continue
    const y = groundY(z) + terrainOffset(x, z)
    if (side < 0 && terrainOffset(x, z) < -45) continue
    // Claros: deja huecos para ver el valle
    if (fbm(x * 0.03 + 40, z * 0.03) < 0.42) continue
    const sc = rng.range(0.8, 1.9)
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rng.next() * Math.PI * 2)
    s.set(sc, sc * rng.range(0.9, 1.35), sc)
    p.set(x, y - 0.1, z)
    m.compose(p, q, s)
    pines.setMatrixAt(trees, m)
    pines.setColorAt(trees, tmp.setHSL(0.38 + rng.range(-0.04, 0.05), 0.35, rng.range(0.55, 1)))
    trees += 1
  }
  pines.count = trees
  pines.instanceMatrix.needsUpdate = true
  if (pines.instanceColor) pines.instanceColor.needsUpdate = true
  pines.computeBoundingSphere()
  // Bosque procedural de respaldo: se reemplaza por los modelos de Kenney cuando cargan
  const fallbackForest = new THREE.Group()
  fallbackForest.add(pines)
  root.add(fallbackForest)

  // Rocas y piedras del borde del sendero
  const rockGeo = new THREE.IcosahedronGeometry(1, 0)
  const rp = rockGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < rp.count; i += 1) {
    rp.setXYZ(i, rp.getX(i) * (0.8 + hash(i, 1) * 0.4), rp.getY(i) * (0.55 + hash(i, 2) * 0.3), rp.getZ(i) * (0.8 + hash(i, 3) * 0.4))
  }
  rockGeo.computeVertexNormals()
  const rockCount = 1400
  const rocks = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ color: 0x59606f, roughness: 0.9, flatShading: true }), rockCount)
  for (let i = 0; i < rockCount; i += 1) {
    const edge = i < 1000
    const side = rng.chance(0.5) ? 1 : -1
    const x = edge ? side * (TRAIL_HALF + rng.range(-0.1, 0.5)) : side * rng.range(TRAIL_HALF + 2, 26)
    const z = rng.range(-WORLD_END, WORLD_START)
    const sc = edge ? rng.range(0.12, 0.38) : rng.range(0.5, 2.2)
    q.setFromEuler(new THREE.Euler(rng.next(), rng.next() * 6, rng.next()))
    s.set(sc, sc, sc)
    p.set(x, groundY(z) + terrainOffset(x, z) + sc * 0.15, z)
    m.compose(p, q, s)
    rocks.setMatrixAt(i, m)
    rocks.setColorAt(i, tmp.setHSL(0.6, 0.06, rng.range(0.5, 1)))
  }
  rocks.instanceMatrix.needsUpdate = true
  rocks.computeBoundingSphere()
  rocks.receiveShadow = true
  root.add(rocks)

  // Barandal de madera del lado del barranco
  const postGeo = new THREE.BoxGeometry(0.12, 1, 0.12).translate(0, 0.5, 0)
  const postCount = Math.floor((WORLD_END + WORLD_START) / 4)
  const posts = new THREE.InstancedMesh(postGeo, new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.85 }), postCount)
  const ropePts: number[] = []
  for (let i = 0; i < postCount; i += 1) {
    const z = WORLD_START - i * 4
    const x = -TRAIL_HALF - 0.35
    const y = groundY(z) + terrainOffset(x, z)
    m.makeTranslation(x, y, z)
    posts.setMatrixAt(i, m)
    if (i > 0) {
      const z0 = z + 4
      const y0 = groundY(z0) + terrainOffset(x, z0)
      ropePts.push(x, y0 + 0.85, z0, x, y + 0.85, z, x, y0 + 0.5, z0, x, y + 0.5, z)
    }
  }
  posts.instanceMatrix.needsUpdate = true
  posts.computeBoundingSphere()
  const ropeGeo = new THREE.BufferGeometry()
  ropeGeo.setAttribute("position", new THREE.Float32BufferAttribute(ropePts, 3))
  const fallbackFence = new THREE.Group()
  fallbackFence.add(posts, new THREE.LineSegments(ropeGeo, new THREE.LineBasicMaterial({ color: 0x8a6a48 })))
  root.add(fallbackFence)

  // Caracas de noche en el valle: luces cálidas y avenidas
  const cityCount = 9000
  const cityPos = new Float32Array(cityCount * 3)
  const cityCol = new Float32Array(cityCount * 3)
  const warm = [new THREE.Color(0xffc46b), new THREE.Color(0xffe2b0), new THREE.Color(0xdbe7ff), new THREE.Color(0xff9d5c)]
  for (let i = 0; i < cityCount; i += 1) {
    const avenue = i % 5 === 0
    let x: number
    let z: number
    if (avenue) {
      const k = i % 3
      z = rng.range(-1700, 400)
      x = -160 - k * 120 - z * 0.08 + Math.sin(z * 0.01 + k) * 20
    } else {
      x = -rng.range(120, 720)
      z = rng.range(-1700, 400)
      if (fbm(x * 0.01, z * 0.01) < 0.35) {
        i -= 1
        continue
      }
    }
    cityPos.set([x, -55 + fbm(x * 0.02, z * 0.02) * 22, z], i * 3)
    const c = avenue ? warm[3] : warm[rng.int(0, 2)]
    const b = rng.range(0.5, 1)
    cityCol.set([c.r * b, c.g * b, c.b * b], i * 3)
  }
  const cityGeo = new THREE.BufferGeometry()
  cityGeo.setAttribute("position", new THREE.BufferAttribute(cityPos, 3))
  cityGeo.setAttribute("color", new THREE.BufferAttribute(cityCol, 3))
  const city = new THREE.Points(
    cityGeo,
    new THREE.PointsMaterial({ size: 2.2, vertexColors: true, fog: false, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  city.frustumCulled = false
  root.add(city)

  // Cresta lejana (la silueta de marca) cerrando el horizonte por delante
  const ridgeShape = new THREE.Shape()
  ridgeShape.moveTo(0, -200)
  RIDGE_POINTS.forEach(([x, y]) => ridgeShape.lineTo(x, 200 - y))
  ridgeShape.lineTo(1440, -200)
  const ridgeGeo = new THREE.ShapeGeometry(ridgeShape)
  ridgeGeo.translate(-1004, -168, 0)
  ;[
    { z: -TRACK_LENGTH - 520, sx: 1.4, sy: 1.0, color: 0x101a33, x: 40 },
    { z: -TRACK_LENGTH - 900, sx: 2.2, sy: 1.25, color: 0x16244a, x: -260 },
  ].forEach((l) => {
    const mesh = new THREE.Mesh(ridgeGeo, new THREE.MeshBasicMaterial({ color: l.color, fog: false }))
    mesh.position.set(l.x, groundY(-TRACK_LENGTH) - 60, l.z)
    mesh.scale.set(l.sx, l.sy, 1)
    root.add(mesh)
  })

  // Teleférico: cable, torres y cabinas iluminadas
  const cableA = new THREE.Vector3(-70, -30, 120)
  const cableB = new THREE.Vector3(-34, groundY(-TRACK_LENGTH) + 12, -TRACK_LENGTH + 40)
  const sag = 18
  const cablePoint = (t: number, out: THREE.Vector3) =>
    out.lerpVectors(cableA, cableB, t).setY(THREE.MathUtils.lerp(cableA.y, cableB.y, t) - Math.sin(Math.PI * t) * sag)
  const cablePts: THREE.Vector3[] = []
  for (let i = 0; i <= 120; i += 1) cablePts.push(cablePoint(i / 120, new THREE.Vector3()))
  const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePts)
  const cableMat = new THREE.LineBasicMaterial({ color: 0x9aa6bd, transparent: true, opacity: 0.55 })
  const cable1 = new THREE.Line(cableGeo, cableMat)
  const cable2 = cable1.clone()
  cable2.position.x = 3
  root.add(cable1, cable2)
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x7c879f, metalness: 0.6, roughness: 0.45 })
  for (const t of [0.18, 0.42, 0.66, 0.88]) {
    const top = cablePoint(t, new THREE.Vector3())
    const base = groundY(top.z) + terrainOffset(top.x, top.z)
    const h = Math.max(6, top.y - base)
    // Torre de celosía: cuatro patas inclinadas, travesaños y cruceta superior
    const tower = new THREE.Group()
    const legGeo = new THREE.CylinderGeometry(0.09, 0.14, h, 5)
    for (const [lx, lz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const leg = new THREE.Mesh(legGeo, towerMat)
      leg.position.set(lx * 0.75, h / 2, lz * 0.75)
      leg.rotation.set(lz * 0.05, 0, -lx * 0.05)
      tower.add(leg)
    }
    for (let k = 1; k < 5; k += 1) {
      const ring = new THREE.Mesh(new THREE.BoxGeometry(1.6 - k * 0.12, 0.08, 1.6 - k * 0.12), towerMat)
      ring.position.y = (h * k) / 5
      tower.add(ring)
    }
    const arm = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 0.4), towerMat)
    arm.position.set(1.5, h, 0)
    tower.add(arm)
    tower.position.set(top.x, base, top.z)
    root.add(mergeStatic(tower))
    const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xff4d5e, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }))
    lamp.position.set(top.x, top.y + 1.5, top.z)
    lamp.scale.setScalar(4)
    root.add(lamp)
  }
  const cabinGeo = new THREE.BoxGeometry(2.2, 1.6, 1.6)
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xe8ecf3, roughness: 0.4, metalness: 0.2, emissive: 0xffc46b, emissiveIntensity: 0.25 })
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd38a })
  const cabins: SummitWorld["cabins"] = []
  for (let i = 0; i < 7; i += 1) {
    const g = new THREE.Group()
    const body = new THREE.Mesh(cabinGeo, cabinMat)
    body.position.y = -2.2
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.5, 1.64), windowMat)
    win.position.y = -1.9
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 4), towerMat)
    rod.position.y = -0.7
    g.add(body, win, rod)
    root.add(mergeStatic(g))
    cabins.push({ mesh: g, t: i / 7, speed: 0.012, dir: i % 2 === 0 ? 1 : -1 })
  }

  // Hitos con letrero de madera junto al sendero
  const signs: SummitWorld["signs"] = []
  const plankGeo = new THREE.BoxGeometry(2.4, 0.9, 0.08)
  const signPostGeo = new THREE.CylinderGeometry(0.07, 0.09, 2.2, 6).translate(0, 1.1, 0)
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 })
  for (const ms of milestones) {
    if (ms.at >= 1) continue
    const z = -ms.at * TRACK_LENGTH
    const g = new THREE.Group()
    const post = new THREE.Mesh(signPostGeo, woodMat)
    const plank = new THREE.Mesh(plankGeo, [woodMat, woodMat, woodMat, woodMat, new THREE.MeshStandardMaterial({ map: signTexture(ms.name, ms.sub), roughness: 0.8 }), woodMat])
    plank.position.y = 1.85
    plank.castShadow = true
    g.add(post, plank)
    g.position.set(TRAIL_HALF + 0.9, groundY(z) + terrainOffset(TRAIL_HALF + 0.9, z), z)
    g.rotation.y = -0.35
    root.add(g)
    signs.push({ z, group: g })
  }

  // Luz de la cumbre: el objetivo siempre visible al fondo
  const beacon = new THREE.Group()
  const summitZ = -TRACK_LENGTH - 6
  beacon.position.set(0, groundY(summitZ), summitZ)
  const cairn = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 1.4, 7), new THREE.MeshStandardMaterial({ color: 0x59606f, flatShading: true }))
  cairn.position.y = 0.7
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12), new THREE.MeshBasicMaterial({ color: 0xeaf1ff, fog: false }))
  core.position.y = 2
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0x8fb5ff, fog: false, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.position.y = 2
  halo.scale.setScalar(26)
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { time: { value: 0 }, color: { value: new THREE.Color(LAB_COLORS.accent) } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float time; uniform vec3 color; varying vec2 vUv;
      void main(){
        float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
        float fade = pow(1.0 - vUv.y, 1.6);
        float shimmer = 0.75 + 0.25 * sin(vUv.y * 40.0 - time * 3.0);
        gl_FragColor = vec4(color * 1.4, edge * edge * fade * shimmer * 0.55);
      }`,
  })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.4, 160, 24, 1, true).translate(0, 80, 0), beamMat)
  beam.position.y = 2
  const beaconLight = new THREE.PointLight(0x9cc0ff, 40, 60, 1.6)
  beaconLight.position.y = 3
  beacon.add(cairn, core, halo, beam, beaconLight)
  root.add(beacon)

  const tmpV = new THREE.Vector3()
  let kitLife: ReturnType<typeof populateWithKit> | null = null
  return {
    root,
    beacon,
    beaconLight,
    cabins,
    cable: { a: cableA, b: cableB, sag },
    signs,
    applyKit(kit, lite = false) {
      if (kitLife) return
      for (const g of [fallbackForest, fallbackFence]) {
        root.remove(g)
        disposeScene(g)
      }
      kitLife = populateWithKit(root, kit, lite)
    },
    update(dt, elapsed, playerZ) {
      kitLife?.update(dt, elapsed, playerZ)
      beamMat.uniforms.time.value = elapsed
      halo.scale.setScalar(24 + Math.sin(elapsed * 2) * 2.5)
      for (const c of cabins) {
        c.t += c.speed * dt * c.dir
        if (c.t > 1) c.t -= 1
        if (c.t < 0) c.t += 1
        cablePoint(c.t, tmpV)
        c.mesh.position.copy(tmpV)
        if (c.dir < 0) c.mesh.position.x += 3
        c.mesh.rotation.z = Math.sin(elapsed * 1.3 + c.t * 20) * 0.04
      }
      // El cielo, las estrellas y la luna acompañan a la cámara
      sky.position.set(0, groundY(playerZ), playerZ)
      stars.position.copy(sky.position)
      moon.position.set(380, groundY(playerZ) + 420, playerZ - 700)
    },
  }
}
