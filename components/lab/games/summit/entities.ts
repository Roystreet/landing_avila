// Modelos de "Sube el Ávila": excursionista, obstáculos, coleccionables y partículas.
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { LAB_COLORS, mergeStatic } from "@/components/lab/engine/core"
import { sharedGlow } from "@/components/lab/games/summit/world"

// ---------- Materiales compartidos por rol ----------
export const MATS = {
  jacket: new THREE.MeshStandardMaterial({ color: LAB_COLORS.primary, roughness: 0.55 }),
  jacketTrim: new THREE.MeshStandardMaterial({ color: 0xdbe7ff, roughness: 0.3, emissive: 0x4f8cff, emissiveIntensity: 0.25 }),
  pants: new THREE.MeshStandardMaterial({ color: 0x1e2433, roughness: 0.8 }),
  boots: new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.9 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xc58c64, roughness: 0.7 }),
  cap: new THREE.MeshStandardMaterial({ color: 0x0b0f1a, roughness: 0.6 }),
  pack: new THREE.MeshStandardMaterial({ color: 0x3d4a63, roughness: 0.75 }),
  packAccent: new THREE.MeshStandardMaterial({ color: 0xffc46b, roughness: 0.6 }),
  lamp: new THREE.MeshBasicMaterial({ color: 0xfff1cf }),
  bugShell: new THREE.MeshPhysicalMaterial({ color: 0xc81d36, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.2, emissive: 0x3a0008 }),
  bugBody: new THREE.MeshStandardMaterial({ color: 0x1a0f14, roughness: 0.6 }),
  bugEye: new THREE.MeshBasicMaterial({ color: 0xffe08a }),
  rock: new THREE.MeshStandardMaterial({ color: 0x6b6f7c, roughness: 0.95, flatShading: true }),
  wood: new THREE.MeshStandardMaterial({ color: 0x7a5434, roughness: 0.85 }),
  woodDark: new THREE.MeshStandardMaterial({ color: 0x4a3220, roughness: 0.9 }),
  hazard: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8a94a8, metalness: 0.7, roughness: 0.35 }),
  gem: new THREE.MeshStandardMaterial({ color: 0x8fb5ff, emissive: LAB_COLORS.accent, emissiveIntensity: 1.6, roughness: 0.15, metalness: 0.2, flatShading: true, transparent: true }),
  cup: new THREE.MeshStandardMaterial({ color: 0xf2efe9, roughness: 0.4 }),
  sleeve: new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.8 }),
  coffee: new THREE.MeshStandardMaterial({ color: 0x3b1f10, roughness: 0.3 }),
  shadow: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }),
}

function stripeTexture() {
  const c = document.createElement("canvas")
  c.width = 128
  c.height = 32
  const g = c.getContext("2d")!
  g.fillStyle = "#f4f4f4"
  g.fillRect(0, 0, 128, 32)
  g.fillStyle = "#e0233d"
  for (let x = -32; x < 160; x += 32) {
    g.beginPath()
    g.moveTo(x, 32)
    g.lineTo(x + 16, 32)
    g.lineTo(x + 32, 0)
    g.lineTo(x + 16, 0)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  t.repeat.set(3, 1)
  return t
}
MATS.hazard.map = stripeTexture()

function clockTexture() {
  const c = document.createElement("canvas")
  c.width = 256
  c.height = 96
  const g = c.getContext("2d")!
  g.fillStyle = "#14070a"
  g.fillRect(0, 0, 256, 96)
  g.fillStyle = "#ff3b4f"
  g.shadowColor = "#ff3b4f"
  g.shadowBlur = 16
  g.font = "700 64px Montserrat, system-ui, sans-serif"
  g.textAlign = "center"
  g.textBaseline = "middle"
  g.fillText("23:59", 128, 52)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Etiqueta flotante (sprite) con el chiste de cada obstáculo. */
export function labelTexture(text: string, tone: "danger" | "info" = "danger") {
  const c = document.createElement("canvas")
  const g = c.getContext("2d")!
  const font = "700 44px Montserrat, system-ui, sans-serif"
  g.font = font
  const w = Math.ceil(g.measureText(text).width) + 56
  c.width = w
  c.height = 84
  g.font = font
  g.fillStyle = tone === "danger" ? "rgba(70,8,18,0.92)" : "rgba(11,15,26,0.9)"
  g.strokeStyle = tone === "danger" ? "#ff4d5e" : "#4f8cff"
  g.lineWidth = 4
  g.beginPath()
  g.roundRect(2, 2, w - 4, 80, 18)
  g.fill()
  g.stroke()
  g.fillStyle = "#ffffff"
  g.textAlign = "center"
  g.textBaseline = "middle"
  g.fillText(text, w / 2, 44)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return { texture: t, aspect: w / 84 }
}

function makeLabel(text: string) {
  const { texture, aspect } = labelTexture(text)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }))
  sprite.scale.set(0.42 * aspect, 0.42, 1)
  sprite.renderOrder = 5
  return sprite
}

export function setLabel(sprite: THREE.Sprite, text: string) {
  const { texture, aspect } = labelTexture(text)
  sprite.material.map?.dispose()
  sprite.material.map = texture
  sprite.material.needsUpdate = true
  sprite.scale.set(0.42 * aspect, 0.42, 1)
}

// ---------- Excursionista ----------
export type Hiker = {
  root: THREE.Group
  body: THREE.Group
  torso: THREE.Group
  /** Caderas (pivote del muslo) */
  legs: [THREE.Group, THREE.Group]
  knees: [THREE.Group, THREE.Group]
  /** Hombros (pivote del brazo) */
  arms: [THREE.Group, THREE.Group]
  elbows: [THREE.Group, THREE.Group]
  poles: [THREE.Group, THREE.Group]
  head: THREE.Group
  headlamp: THREE.SpotLight
  lampGlow: THREE.Sprite
}

/** Segmento de extremidad que cuelga desde su pivote. */
function segment(len: number, r0: number, r1: number, mat: THREE.Material) {
  const g = new THREE.Group()
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 10), mat)
  mesh.position.y = -len / 2
  mesh.castShadow = true
  const joint = new THREE.Mesh(new THREE.SphereGeometry(r0 * 1.02, 10, 8), mat)
  g.add(mesh, joint)
  return g
}

// "Á" de la marca como parche reflectivo en el morral
function brandPatch() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.07, -0.06)
  shape.lineTo(0, 0.07)
  shape.lineTo(0.07, -0.06)
  shape.lineTo(0.035, -0.06)
  shape.lineTo(0, 0.005)
  shape.lineTo(-0.035, -0.06)
  shape.closePath()
  const accent = new THREE.Shape()
  accent.moveTo(0.01, 0.1)
  accent.lineTo(0.05, 0.13)
  accent.lineTo(0.055, 0.115)
  accent.lineTo(0.017, 0.088)
  accent.closePath()
  return new THREE.Mesh(new THREE.ExtrudeGeometry([shape, accent], { depth: 0.008, bevelEnabled: false }), MATS.jacketTrim)
}

export function buildHiker(): Hiker {
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  // Piernas: muslo + rodilla + pantorrilla con polaina y bota con suela
  const legs = [new THREE.Group(), new THREE.Group()] as [THREE.Group, THREE.Group]
  const knees = [new THREE.Group(), new THREE.Group()] as [THREE.Group, THREE.Group]
  legs.forEach((hip, i) => {
    const side = i === 0 ? -1 : 1
    hip.position.set(side * 0.13, 0.92, 0)
    const thigh = segment(0.42, 0.105, 0.085, MATS.pants)
    hip.add(thigh)
    const knee = knees[i]
    knee.position.y = -0.42
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), MATS.pack)
    pad.rotation.x = -Math.PI / 2
    pad.position.z = -0.06
    const shin = segment(0.4, 0.082, 0.07, MATS.pants)
    const gaiter = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.082, 0.16, 10), MATS.cap)
    gaiter.position.y = -0.32
    const boot = new THREE.Group()
    boot.position.y = -0.42
    const upper = new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.13, 0.28, 2, 0.05), MATS.boots)
    upper.position.set(0, -0.02, -0.05)
    upper.castShadow = true
    const sole = new THREE.Mesh(new RoundedBoxGeometry(0.18, 0.045, 0.3, 2, 0.02), MATS.bugBody)
    sole.position.set(0, -0.09, -0.05)
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.14), MATS.packAccent)
    lace.position.set(0, 0.048, -0.1)
    boot.add(upper, sole, lace)
    knee.add(pad, shin, gaiter, boot)
    hip.add(knee)
    body.add(hip)
  })

  // Torso con chaqueta, capucha, cierre y franja reflectiva
  const torso = new THREE.Group()
  torso.position.y = 0.98
  body.add(torso)
  const jacket = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.36, 6, 14), MATS.jacket)
  jacket.position.y = 0.26
  jacket.scale.set(1, 1, 0.78)
  jacket.castShadow = true
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.03, 8, 24), MATS.jacket)
  hem.rotation.x = Math.PI / 2
  hem.scale.set(1, 0.78, 1)
  hem.position.y = 0.02
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.022, 6, 24), MATS.cap)
  belt.rotation.x = Math.PI / 2
  belt.scale.set(1, 0.8, 1)
  belt.position.y = 0.1
  const zip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.48, 0.01), MATS.jacketTrim)
  zip.position.set(0, 0.3, -0.198)
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.014, 6, 24), MATS.jacketTrim)
  trim.rotation.x = Math.PI / 2
  trim.scale.set(1, 0.78, 1)
  trim.position.y = 0.44
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.06, 8, 16, Math.PI), MATS.jacket)
  hood.position.set(0, 0.62, 0.07)
  hood.rotation.set(-0.5, 0, 0)
  torso.add(jacket, hem, belt, zip, trim, hood)

  // Morral técnico: cuerpo, tapa, bolsillo, botella lateral, colchoneta y parche de marca
  const pack = new THREE.Group()
  pack.position.set(0, 0.3, 0.24)
  const packBody = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.56, 0.24, 3, 0.08), MATS.pack)
  packBody.castShadow = true
  const lid = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.14, 0.27, 3, 0.06), MATS.cap)
  lid.position.set(0, 0.28, 0.01)
  const pocket = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.24, 0.08, 2, 0.04), MATS.pack)
  pocket.position.set(0, -0.1, 0.14)
  const reflector = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.01), MATS.jacketTrim)
  reflector.position.set(0, 0.08, 0.125)
  const patch = brandPatch()
  patch.position.set(0, -0.08, 0.182)
  patch.rotation.y = Math.PI
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0x4f8cff, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 }))
  bottle.position.set(-0.26, -0.12, 0.02)
  const capB = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 10), MATS.cap)
  capB.position.set(-0.26, 0.01, 0.02)
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 14), MATS.packAccent)
  roll.rotation.z = Math.PI / 2
  roll.position.set(0, -0.36, 0.02)
  const rollStrapGeo = new THREE.TorusGeometry(0.093, 0.012, 6, 14)
  for (const x of [-0.14, 0.14]) {
    const strap = new THREE.Mesh(rollStrapGeo, MATS.cap)
    strap.rotation.y = Math.PI / 2
    strap.position.set(x, -0.36, 0.02)
    pack.add(strap)
  }
  pack.add(packBody, lid, pocket, reflector, patch, bottle, capB, roll)
  torso.add(pack)
  const strapGeo = new THREE.BoxGeometry(0.05, 0.46, 0.025)
  for (const x of [-0.12, 0.12]) {
    const strap = new THREE.Mesh(strapGeo, MATS.cap)
    strap.position.set(x, 0.3, -0.19)
    torso.add(strap)
  }

  // Brazos: hombro + codo + guante, cada mano con su bastón de trekking
  const arms = [new THREE.Group(), new THREE.Group()] as [THREE.Group, THREE.Group]
  const elbows = [new THREE.Group(), new THREE.Group()] as [THREE.Group, THREE.Group]
  const poles = [new THREE.Group(), new THREE.Group()] as [THREE.Group, THREE.Group]
  const poleShaft = new THREE.CylinderGeometry(0.012, 0.012, 1.15, 6)
  arms.forEach((shoulder, i) => {
    const side = i === 0 ? -1 : 1
    shoulder.position.set(side * 0.31, 0.52, 0)
    shoulder.rotation.z = side * 0.12
    shoulder.add(segment(0.3, 0.075, 0.065, MATS.jacket))
    const elbow = elbows[i]
    elbow.position.y = -0.3
    const fore = segment(0.27, 0.064, 0.058, MATS.jacket)
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 10), MATS.cap)
    cuff.position.y = -0.25
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), MATS.cap)
    glove.scale.set(0.9, 1.1, 1)
    glove.position.y = -0.32
    const pole = poles[i]
    pole.position.y = -0.32
    const shaft = new THREE.Mesh(poleShaft, MATS.steel)
    shaft.position.y = -0.5
    shaft.castShadow = true
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.12, 8), MATS.cap)
    grip.position.y = 0.02
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 10), MATS.cap)
    basket.position.y = -0.98
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.05, 6), MATS.steel)
    tip.rotation.x = Math.PI
    tip.position.y = -1.1
    pole.add(shaft, grip, basket, tip)
    pole.rotation.x = 0.35
    elbow.add(fore, cuff, glove, pole)
    shoulder.add(elbow)
    torso.add(shoulder)
  })

  // Cabeza con gorra, orejas, cuello y linterna frontal
  const head = new THREE.Group()
  head.position.y = 0.72
  torso.add(head)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 10), MATS.skin)
  neck.position.y = -0.02
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), MATS.skin)
  skull.position.y = 0.13
  skull.scale.set(0.95, 1.05, 1)
  skull.castShadow = true
  const earGeo = new THREE.SphereGeometry(0.035, 8, 6)
  for (const x of [-0.155, 0.155]) {
    const ear = new THREE.Mesh(earGeo, MATS.skin)
    ear.position.set(x, 0.12, 0.01)
    ear.scale.set(0.5, 1, 0.8)
    head.add(ear)
  }
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), MATS.cap)
  cap.position.y = 0.16
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), MATS.jacket)
  button.position.y = 0.33
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.022, 18, 1, false, Math.PI / 2, Math.PI), MATS.cap)
  brim.position.set(0, 0.165, -0.11)
  brim.rotation.x = -0.08
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.163, 0.018, 6, 24), MATS.jacketTrim)
  band.position.y = 0.15
  band.rotation.x = Math.PI / 2
  const lampBody = new THREE.Mesh(new RoundedBoxGeometry(0.09, 0.06, 0.05, 2, 0.015), MATS.cap)
  lampBody.position.set(0, 0.15, -0.175)
  const lampLens = new THREE.Mesh(new THREE.CircleGeometry(0.022, 14), MATS.lamp)
  lampLens.position.set(0, 0.15, -0.201)
  lampLens.rotation.y = Math.PI
  head.add(neck, skull, cap, button, brim, band, lampBody, lampLens)

  const lampGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xffe2a8, depthWrite: false, blending: THREE.AdditiveBlending }))
  lampGlow.position.set(0, 0.15, -0.24)
  lampGlow.scale.setScalar(0.6)
  head.add(lampGlow)

  // Linterna frontal: ilumina el sendero por delante
  const headlamp = new THREE.SpotLight(0xffe7bf, 60, 30, 0.5, 0.55, 1.4)
  headlamp.position.set(0, 1.8, -0.2)
  headlamp.target.position.set(0, 0, -12)
  body.add(headlamp, headlamp.target)

  const blob = new THREE.Mesh(new THREE.CircleGeometry(0.5, 20), MATS.shadow)
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.03
  blob.name = "blob"
  root.add(blob)

  mergeStatic(root)
  return { root, body, torso, legs, knees, arms, elbows, poles, head, headlamp, lampGlow }
}

// ---------- Obstáculos ----------
export type ObstacleKind = "bug" | "boulder" | "deadline" | "meeting"

export type Obstacle = {
  kind: ObstacleKind
  group: THREE.Group
  active: boolean
  lane: number
  z: number
  x: number
  vx: number
  vz: number
  /** Carriles bloqueados (deadline) */
  lanes: number[]
  /** Altura que hay que superar saltando; Infinity = no se puede saltar */
  clearHeight: number
  halfWidth: number
  halfDepth: number
  hit: boolean
  /** z del cuadro anterior, para la colisión barrida */
  prevZ: number
  /** Distancia mínima al jugador mientras pasaba (para "¡Por poco!") */
  minGap: number
  passed: boolean
  label: THREE.Sprite
  legs?: THREE.Object3D[]
  spin?: THREE.Object3D
  knock: { vx: number; vy: number; vz: number; spin: number; y: number }
}

function obstacleBase(kind: ObstacleKind, label: string): Obstacle {
  const group = new THREE.Group()
  const lbl = makeLabel(label)
  group.add(lbl)
  group.visible = false
  return {
    kind,
    group,
    active: false,
    lane: 1,
    z: 0,
    x: 0,
    vx: 0,
    vz: 0,
    lanes: [],
    clearHeight: Infinity,
    halfWidth: 0.6,
    halfDepth: 0.5,
    hit: false,
    prevZ: 0,
    minGap: Infinity,
    passed: false,
    label: lbl,
    knock: { vx: 0, vy: 0, vz: 0, spin: 0, y: 0 },
  }
}

const bugGlowMat = new THREE.MeshBasicMaterial({ color: 0xff3b4f })

export function buildBug(label: string): Obstacle {
  // Escarabajo de código: élitros entreabiertos con una grieta que brilla, tórax, mandíbulas y patas articuladas
  const o = obstacleBase("bug", label)
  const g = o.group
  const elytraGeo = new THREE.SphereGeometry(0.42, 20, 14, 0, Math.PI, 0, Math.PI / 2)
  for (const side of [-1, 1]) {
    const half = new THREE.Mesh(elytraGeo, MATS.bugShell)
    half.scale.set(0.95, 0.9, 1.3)
    half.rotation.set(0, side > 0 ? Math.PI / 2 : -Math.PI / 2, side * 0.12)
    half.rotation.order = "YXZ"
    half.position.set(side * 0.035, 0.24, 0.06)
    half.castShadow = true
    g.add(half)
  }
  const crack = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 1.02), bugGlowMat)
  crack.position.set(0, 0.42, 0.06)
  crack.scale.y = 0.4
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 10), MATS.bugBody)
  belly.scale.set(1, 0.45, 1.25)
  belly.position.set(0, 0.22, 0.06)
  const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 10), MATS.bugShell)
  thorax.scale.set(1.15, 0.7, 0.8)
  thorax.position.set(0, 0.3, -0.42)
  const spots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.06, 10), MATS.bugBody, 4)
  const sm = new THREE.Matrix4()
  ;[[-0.2, 0.22], [0.2, 0.22], [-0.22, -0.12], [0.22, -0.12]].forEach(([x, z], i) => {
    sm.compose(new THREE.Vector3(x, 0.56 - Math.abs(z) * 0.15, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + z * 0.8, 0, x * -1.6)), new THREE.Vector3(1, 1, 1))
    spots.setMatrixAt(i, sm)
  })
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), MATS.bugBody)
  head.position.set(0, 0.28, -0.66)
  const eyeGeo = new THREE.SphereGeometry(0.055, 10, 8)
  const eyeL = new THREE.Mesh(eyeGeo, MATS.bugEye)
  eyeL.position.set(-0.09, 0.35, -0.79)
  const eyeR = eyeL.clone()
  eyeR.position.x = 0.09
  const eyeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xffd06b, depthWrite: false, blending: THREE.AdditiveBlending }))
  eyeGlow.position.set(0, 0.35, -0.82)
  eyeGlow.scale.setScalar(0.9)
  eyeGlow.name = "eyeGlow"
  const mandGeo = new THREE.ConeGeometry(0.03, 0.18, 6)
  for (const side of [-1, 1]) {
    const mand = new THREE.Mesh(mandGeo, MATS.bugBody)
    mand.position.set(side * 0.07, 0.2, -0.82)
    mand.rotation.set(-Math.PI / 2, 0, side * 0.5)
    g.add(mand)
  }
  const antGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 0.25, -0.1), new THREE.Vector3(0.18, 0.32, -0.32)), 10, 0.012, 4)
  for (const side of [-1, 1]) {
    const ant = new THREE.Mesh(antGeo, MATS.bugBody)
    ant.position.set(side * 0.08, 0.4, -0.74)
    ant.scale.x = side
    g.add(ant)
  }
  g.add(crack, belly, thorax, spots, head, eyeL, eyeR, eyeGlow)
  // Patas de dos segmentos: el muslo sale hacia afuera y la tibia baja al suelo
  const legs: THREE.Object3D[] = []
  const femurGeo = new THREE.CylinderGeometry(0.028, 0.024, 0.32, 5).translate(0, -0.16, 0)
  const tibiaGeo = new THREE.CylinderGeometry(0.022, 0.012, 0.34, 5).translate(0, -0.17, 0)
  for (let i = 0; i < 6; i += 1) {
    const side = i < 3 ? -1 : 1
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.3, 0.26, -0.3 + (i % 3) * 0.3)
    const femur = new THREE.Mesh(femurGeo, MATS.bugBody)
    femur.rotation.z = side * 1.6
    const joint = new THREE.Group()
    joint.position.set(side * 0.32, 0.02, 0)
    const tibia = new THREE.Mesh(tibiaGeo, MATS.bugBody)
    tibia.rotation.z = -side * 0.35
    joint.add(tibia)
    pivot.add(femur, joint)
    g.add(pivot)
    legs.push(pivot)
  }
  o.legs = legs
  o.label.position.y = 1.3
  o.clearHeight = 0.62
  o.halfWidth = 0.55
  o.halfDepth = 0.6
  mergeStatic(o.group)
  return o
}

export function buildBoulder(label: string): Obstacle {
  const o = obstacleBase("boulder", label)
  const geo = new THREE.IcosahedronGeometry(0.9, 1)
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i += 1) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i)
    const k = 0.85 + Math.abs(Math.sin(v.x * 5.1 + v.y * 3.7 + v.z * 4.3)) * 0.22
    p.setXYZ(i, v.x * k, v.y * k, v.z * k)
  }
  geo.computeVertexNormals()
  const rock = new THREE.Mesh(geo, MATS.rock)
  rock.castShadow = true
  const spin = new THREE.Group()
  spin.position.y = 0.88
  spin.add(rock)
  // Vetas de musgo para que no parezca una esfera gris
  const moss = new THREE.Mesh(new THREE.IcosahedronGeometry(0.93, 1), new THREE.MeshStandardMaterial({ color: 0x2c5039, roughness: 1, flatShading: true, transparent: true, opacity: 0.55 }))
  moss.scale.set(1, 0.4, 1)
  moss.position.y = 0.4
  spin.add(moss)
  // Pasto y ramitas arrancadas que viajan con la roca
  const tuftGeo = new THREE.ConeGeometry(0.06, 0.28, 4)
  const tuftMat = new THREE.MeshStandardMaterial({ color: 0x3f7a4c, roughness: 1, flatShading: true })
  for (let i = 0; i < 7; i += 1) {
    const a = (i / 7) * Math.PI * 2
    const tuft = new THREE.Mesh(tuftGeo, tuftMat)
    tuft.position.set(Math.cos(a) * 0.82, 0.25 + Math.sin(i * 2.3) * 0.2, Math.sin(a) * 0.82)
    tuft.lookAt(tuft.position.clone().multiplyScalar(2))
    tuft.rotateX(Math.PI / 2)
    spin.add(tuft)
  }
  o.group.add(spin)
  o.spin = spin
  o.label.position.y = 2.3
  o.halfWidth = 0.75
  o.halfDepth = 0.75
  mergeStatic(o.group)
  return o
}

const clockTex = typeof document !== "undefined" ? clockTexture() : null

export function buildDeadline(label: string): Obstacle {
  // Portón que bloquea dos carriles; la etiqueta y el reloj marcan el carril libre por contraste
  const o = obstacleBase("deadline", label)
  const g = o.group
  const postGeo = new THREE.BoxGeometry(0.22, 2.4, 0.22).translate(0, 1.2, 0)
  const barGeo = new THREE.BoxGeometry(3.9, 0.36, 0.12)
  for (const x of [-2.05, 2.05]) {
    const post = new THREE.Mesh(postGeo, MATS.steel)
    post.position.x = x
    post.castShadow = true
    g.add(post)
  }
  for (const y of [0.55, 1.35]) {
    const bar = new THREE.Mesh(barGeo, MATS.hazard)
    bar.position.y = y
    bar.castShadow = true
    g.add(bar)
  }
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.1), [MATS.steel, MATS.steel, MATS.steel, MATS.steel, new THREE.MeshBasicMaterial({ map: clockTex }), MATS.steel])
  board.position.y = 2.05
  const warn = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff3b4f }))
  warn.position.set(0, 2.42, 0)
  warn.name = "warn"
  const warnGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xff3b4f, depthWrite: false, blending: THREE.AdditiveBlending }))
  warnGlow.position.copy(warn.position)
  warnGlow.scale.setScalar(1.6)
  warnGlow.name = "warnGlow"
  // Conos y sacos de arena en la base: se leen como "obra" desde lejos
  const coneGeo = new THREE.ConeGeometry(0.16, 0.42, 12).translate(0, 0.21, 0)
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xff6a2b, roughness: 0.5 })
  const bandGeo = new THREE.CylinderGeometry(0.105, 0.125, 0.07, 12)
  const baseGeo = new THREE.BoxGeometry(0.36, 0.04, 0.36)
  for (const x of [-1.5, -0.4, 0.7, 1.6]) {
    const cone = new THREE.Mesh(coneGeo, coneMat)
    cone.position.set(x, 0.04, -0.35)
    cone.castShadow = true
    const band = new THREE.Mesh(bandGeo, MATS.jacketTrim)
    band.position.set(x, 0.26, -0.35)
    const base = new THREE.Mesh(baseGeo, MATS.bugBody)
    base.position.set(x, 0.02, -0.35)
    g.add(cone, band, base)
  }
  const bagGeo = new RoundedBoxGeometry(0.5, 0.2, 0.3, 2, 0.08)
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 1 })
  for (const [x, y] of [[-2.05, 0.1], [-2.05, 0.28], [2.05, 0.1], [2.05, 0.28]]) {
    const bag = new THREE.Mesh(bagGeo, bagMat)
    bag.position.set(x, y, 0.05)
    bag.rotation.y = y > 0.2 ? 0.3 : -0.1
    g.add(bag)
  }
  g.add(board, warn, warnGlow)
  o.label.position.y = 2.95
  o.halfWidth = 1.95
  o.halfDepth = 0.25
  mergeStatic(o.group)
  return o
}

export function buildMeeting(label: string): Obstacle {
  // Tronco caído a lo ancho: hay que saltarlo
  const o = obstacleBase("meeting", label)
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 6.6, 12), MATS.wood)
  log.rotation.z = Math.PI / 2
  log.position.y = 0.3
  log.castShadow = true
  const capGeo = new THREE.CircleGeometry(0.3, 12)
  const rings = new THREE.MeshStandardMaterial({ color: 0xc89a6a, roughness: 0.8 })
  const capL = new THREE.Mesh(capGeo, rings)
  capL.position.set(-3.31, 0.3, 0)
  capL.rotation.y = -Math.PI / 2
  const capR = capL.clone()
  capR.position.x = 3.31
  capR.rotation.y = Math.PI / 2
  const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.9, 6), MATS.woodDark)
  branch.position.set(1.1, 0.65, 0)
  branch.rotation.z = -0.6
  o.group.add(log, capL, capR, branch)
  o.label.position.y = 1.4
  o.clearHeight = 0.58
  o.halfWidth = 3.3
  o.halfDepth = 0.32
  mergeStatic(o.group)
  return o
}

// ---------- Coleccionables ----------
export type Pickup = {
  kind: "commit" | "coffee"
  group: THREE.Group
  active: boolean
  x: number
  y: number
  z: number
  taken: boolean
  t: number
}

const gemGeo = new THREE.OctahedronGeometry(0.26, 0).scale(1, 1.4, 1)
const ringGeo = new THREE.TorusGeometry(0.36, 0.025, 6, 24)

/** El commit es solo un "transform"; CommitField lo dibuja instanciado junto a los demás. */
export function buildCommit(): Pickup {
  const g = new THREE.Group()
  g.visible = false
  return { kind: "commit", group: g, active: false, x: 0, y: 0, z: 0, taken: false, t: 0 }
}

/** Todos los commits en tres llamadas de dibujo: cristales, anillos y brillos. */
export class CommitField {
  readonly object = new THREE.Group()
  private readonly gems: THREE.InstancedMesh
  private readonly rings: THREE.InstancedMesh
  private readonly glowGeo = new THREE.BufferGeometry()
  private readonly glowPos: Float32Array
  private readonly m = new THREE.Matrix4()
  private readonly zero = new THREE.Matrix4().makeScale(0, 0, 0)

  constructor(private readonly count: number) {
    this.gems = new THREE.InstancedMesh(gemGeo, MATS.gem, count)
    this.rings = new THREE.InstancedMesh(ringGeo, MATS.jacketTrim, count)
    for (const im of [this.gems, this.rings]) {
      im.frustumCulled = false
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    this.glowPos = new Float32Array(count * 3)
    this.glowGeo.setAttribute("position", new THREE.BufferAttribute(this.glowPos, 3))
    const glow = new THREE.Points(
      this.glowGeo,
      new THREE.PointsMaterial({ map: sharedGlow(), color: 0x4f8cff, size: 1.3, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }),
    )
    glow.frustumCulled = false
    this.object.add(this.gems, this.rings, glow)
  }

  sync(pickups: Pickup[]) {
    for (let i = 0; i < this.count; i += 1) {
      const g = pickups[i]?.group
      if (!g || !g.visible) {
        this.gems.setMatrixAt(i, this.zero)
        this.rings.setMatrixAt(i, this.zero)
        this.glowPos[i * 3 + 1] = -99999
        continue
      }
      g.updateMatrix()
      this.gems.setMatrixAt(i, g.matrix)
      this.m.copy(g.matrix)
      this.rings.setMatrixAt(i, this.m)
      this.glowPos.set([g.position.x, g.position.y, g.position.z], i * 3)
    }
    this.gems.instanceMatrix.needsUpdate = true
    this.rings.instanceMatrix.needsUpdate = true
    this.glowGeo.attributes.position.needsUpdate = true
  }
}

export function buildCoffee(label: string): Pickup & { label: THREE.Sprite } {
  const g = new THREE.Group()
  const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(0.17, 0), new THREE.Vector2(0.22, 0.45), new THREE.Vector2(0.2, 0.47), new THREE.Vector2(0, 0.47)]
  const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, 18), MATS.cup)
  cup.castShadow = true
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.19, 0.16, 18, 1, true), MATS.sleeve)
  sleeve.position.y = 0.22
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.22, 0.06, 18), MATS.cap)
  lid.position.y = 0.5
  const steamMat = new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false })
  for (let i = 0; i < 3; i += 1) {
    const puff = new THREE.Sprite(steamMat)
    puff.position.set((i - 1) * 0.08, 0.75 + i * 0.18, 0)
    puff.scale.setScalar(0.35 + i * 0.1)
    puff.name = `steam${i}`
    g.add(puff)
  }
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xffc46b, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }))
  halo.position.y = 0.3
  halo.scale.setScalar(1.6)
  const lbl = new THREE.Sprite(new THREE.SpriteMaterial({ depthWrite: false, transparent: true }))
  setLabel(lbl, label)
  const { texture, aspect } = labelTexture(label, "info")
  lbl.material.map = texture
  lbl.scale.set(0.36 * aspect, 0.36, 1)
  lbl.position.y = 1.25
  g.add(cup, sleeve, lid, halo, lbl)
  g.visible = false
  return { kind: "coffee", group: g, active: false, x: 0, y: 0, z: 0, taken: false, t: 0, label: lbl }
}

// ---------- Partículas en pool ----------
export class Sparks {
  private readonly geo: THREE.BufferGeometry
  private readonly pos: Float32Array
  private readonly col: Float32Array
  private readonly vel: Float32Array
  private readonly life: Float32Array
  private cursor = 0
  readonly points: THREE.Points

  constructor(private readonly max = 400) {
    this.pos = new Float32Array(max * 3)
    this.col = new Float32Array(max * 3)
    this.vel = new Float32Array(max * 3)
    this.life = new Float32Array(max)
    this.geo = new THREE.BufferGeometry()
    this.geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3))
    this.geo.setAttribute("color", new THREE.BufferAttribute(this.col, 3))
    this.points = new THREE.Points(
      this.geo,
      new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, map: sharedGlow() }),
    )
    this.points.frustumCulled = false
  }

  burst(at: THREE.Vector3, color: number, count: number, speed: number, rand: () => number, up = 1) {
    const c = new THREE.Color(color)
    for (let i = 0; i < count; i += 1) {
      const k = this.cursor
      this.cursor = (this.cursor + 1) % this.max
      this.pos.set([at.x, at.y, at.z], k * 3)
      const a = rand() * Math.PI * 2
      const e = rand() * 0.8 + 0.2
      this.vel.set([Math.cos(a) * speed * e, (rand() * 0.8 + 0.4) * speed * up, Math.sin(a) * speed * e], k * 3)
      this.col.set([c.r, c.g, c.b], k * 3)
      this.life[k] = 0.5 + rand() * 0.5
    }
  }

  update(dt: number) {
    for (let k = 0; k < this.max; k += 1) {
      if (this.life[k] <= 0) continue
      this.life[k] -= dt
      const i = k * 3
      this.vel[i + 1] -= 9 * dt
      this.pos[i] += this.vel[i] * dt
      this.pos[i + 1] += this.vel[i + 1] * dt
      this.pos[i + 2] += this.vel[i + 2] * dt
      const fade = Math.max(0, this.life[k])
      this.col[i] *= 0.96 + fade * 0.04
      this.col[i + 1] *= 0.96 + fade * 0.04
      this.col[i + 2] *= 0.96 + fade * 0.04
      if (this.life[k] <= 0) this.pos[i + 1] = -9999
    }
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.color.needsUpdate = true
  }
}
