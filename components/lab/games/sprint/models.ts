// Fábricas de modelos del Sprint: taller del pipeline, muelles, tareas y bugs.
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { RIDGE_POINTS, SUMMIT } from "@/components/brand/ridge"
import { LAB_COLORS } from "@/components/lab/engine/core"
import {
  BUG_HEX,
  HOTFIX_HEX,
  KIND_HEX,
  arrowTexture,
  beltTexture,
  browserScreenTexture,
  floorTexture,
  glowTexture,
  kanbanTexture,
  keyboardTexture,
  phoneScreenTexture,
  portalSignTexture,
  rackTexture,
  signTexture,
  taskDecalTexture,
  type Dir,
  type TaskKind,
} from "./textures"

// ---------- Geometría del tablero ----------
export const BELT_START_Z = -10.6
export const JUNCTION_Z = -1.25
export const TOP_Y = 0.36
export const PAD_POS: Record<Dir, THREE.Vector3> = {
  left: new THREE.Vector3(-3.9, 0, 0),
  center: new THREE.Vector3(0, 0, 3.5),
  right: new THREE.Vector3(3.9, 0, 0),
}
export const DIR_ANGLE: Record<Dir, number> = { left: -Math.PI / 2, center: 0, right: Math.PI / 2 }

const std = (color: THREE.ColorRepresentation, roughness = 0.6, metalness = 0.1, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })

/** Materiales compartidos por rol (no por objeto). */
export function createMaterials() {
  return {
    bodyPrimary: std(0x1a2336, 0.55, 0.35),
    bodySecondary: std(0x232e45, 0.5, 0.4),
    trim: std(0x3a4762, 0.35, 0.7),
    groundContact: std(0x0a0e18, 0.95, 0),
    signal: new THREE.MeshStandardMaterial({ color: 0x0b0f1a, emissive: LAB_COLORS.accent, emissiveIntensity: 1.6 }),
    hazard: new THREE.MeshStandardMaterial({ color: 0x2a0b10, emissive: BUG_HEX, emissiveIntensity: 1.2 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x0b1220, roughness: 0.15, metalness: 0.2, clearcoat: 1 }),
    task: {
      web: std(KIND_HEX.web, 0.42, 0.15),
      movil: std(KIND_HEX.movil, 0.42, 0.15),
      cloud: std(KIND_HEX.cloud, 0.5, 0.05),
    } as Record<TaskKind, THREE.MeshStandardMaterial>,
    hotfix: std(HOTFIX_HEX, 0.3, 0.6, { emissive: HOTFIX_HEX, emissiveIntensity: 0.25 }),
    bugShell: std(0x9e1426, 0.35, 0.3, { emissive: BUG_HEX, emissiveIntensity: 0.18 }),
    bugDark: std(0x2b0a10, 0.6, 0.2),
    bugEye: new THREE.MeshBasicMaterial({ color: 0xffd36b, toneMapped: false }),
  }
}
export type Materials = ReturnType<typeof createMaterials>

// ---------- Mundo ----------
export type World = {
  root: THREE.Group
  beltTex: THREE.Texture
  chuteTexes: THREE.Texture[]
  turntable: THREE.Group
  turntableMat: THREE.MeshStandardMaterial
  diverter: THREE.Group
  chuteLamps: Record<Dir, THREE.MeshStandardMaterial>
  padRims: Record<Dir, THREE.MeshStandardMaterial>
  padLights: Record<Dir, THREE.PointLight>
  screens: Record<Dir, THREE.MeshStandardMaterial>
  deviceTargets: Record<Dir, THREE.Vector3>
  dockHit: Record<Dir, THREE.Mesh>
  signs: Record<Dir, { canvas: HTMLCanvasElement; texture: THREE.Texture }>
  portalSign: { canvas: HTMLCanvasElement; texture: THREE.Texture }
  portalRing: THREE.Mesh
  portalGlow: THREE.Mesh
  portalGlowMat: THREE.MeshBasicMaterial
  rackLeds: THREE.InstancedMesh
  rollers: THREE.InstancedMesh
  turret: { root: THREE.Group; head: THREE.Group; muzzle: THREE.Object3D }
  kanbans: { canvas: HTMLCanvasElement; texture: THREE.Texture; seed: number }[]
}

export function buildWorld(
  mats: Materials,
  labels: Record<Dir, string>,
  portalLabel: string,
  coarse: boolean,
  lang: "es" | "en",
): World {
  const root = new THREE.Group()

  // Piso técnico
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.92, metalness: 0 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  root.add(floor)

  // Cresta del Ávila al fondo, con la cumbre encendida
  const ridgeShape = new THREE.Shape()
  const W = 78
  const H = 10
  const px = (x: number) => (x / 1440 - 0.5) * W
  const py = (y: number) => ((200 - y) / 200) * H
  ridgeShape.moveTo(px(0), 0)
  RIDGE_POINTS.forEach(([x, y]) => ridgeShape.lineTo(px(x), py(y)))
  ridgeShape.lineTo(px(1440), 0)
  ridgeShape.closePath()
  const ridge = new THREE.Mesh(new THREE.ShapeGeometry(ridgeShape), new THREE.MeshBasicMaterial({ color: 0x111a2d, fog: false }))
  ridge.position.set(6, -0.5, -34)
  root.add(ridge)
  const ridgeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(RIDGE_POINTS.map(([x, y]) => new THREE.Vector3(px(x), py(y), 0.02))),
    new THREE.LineBasicMaterial({ color: LAB_COLORS.accent, transparent: true, opacity: 0.75, fog: false }),
  )
  ridge.add(ridgeLine)
  const summit = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(230,240,255,1)"), blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  )
  summit.position.set(px(SUMMIT.x), py(SUMMIT.y), 0.1)
  summit.scale.setScalar(3.2)
  ridge.add(summit)

  // Estrellas
  const starGeo = new THREE.BufferGeometry()
  const starPos: number[] = []
  for (let i = 0; i < 260; i += 1) {
    const a = (i * 137.508 * Math.PI) / 180
    const r = 30 + ((i * 7919) % 40)
    starPos.push(Math.cos(a) * r * 1.4, 12 + ((i * 3571) % 24), -40 - ((i * 104729) % 30) + Math.sin(a) * 4)
  }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3))
  root.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc9d7f2, size: 0.18, fog: false, transparent: true, opacity: 0.8 })))

  // ---- Banda principal ----
  const beltLen = JUNCTION_Z - BELT_START_Z + 0.4
  const beltMidZ = (BELT_START_Z + JUNCTION_Z) / 2 - 0.2
  const beltBody = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.3, beltLen, 2, 0.06), mats.bodySecondary)
  beltBody.position.set(0, 0.17, beltMidZ)
  beltBody.castShadow = true
  beltBody.receiveShadow = true
  root.add(beltBody)
  const beltTex = beltTexture()
  beltTex.repeat.set(1, beltLen / 1.4)
  const beltTop = new THREE.Mesh(new THREE.PlaneGeometry(1.6, beltLen), new THREE.MeshStandardMaterial({ map: beltTex, roughness: 0.85 }))
  beltTop.rotation.x = -Math.PI / 2
  beltTop.position.set(0, TOP_Y - 0.005, beltMidZ)
  beltTop.receiveShadow = true
  root.add(beltTop)
  // barandas con tira de luz
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, beltLen), mats.trim)
    rail.position.set(side * 0.93, TOP_Y + 0.06, beltMidZ)
    rail.castShadow = true
    root.add(rail)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, beltLen - 0.4), mats.signal)
    strip.position.set(side * 1.01, TOP_Y + 0.06, beltMidZ)
    root.add(strip)
  }
  // rodillos laterales (instanciados) y patas
  const rollerCount = Math.floor(beltLen / 0.7)
  const rollers = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 12), mats.trim, rollerCount * 2)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
  let ri = 0
  for (let i = 0; i < rollerCount; i += 1) {
    for (const side of [-1, 1]) {
      m4.compose(new THREE.Vector3(side * 1.04, 0.17, BELT_START_Z + 0.2 + i * 0.7), q, new THREE.Vector3(1, 1, 1))
      rollers.setMatrixAt(ri++, m4)
    }
  }
  root.add(rollers)

  // ---- Plato giratorio (cruce) ----
  const turntable = new THREE.Group()
  const turntableMat = std(0x1d2740, 0.4, 0.5, { emissive: 0x000000 })
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.38, 0.32, 48), turntableMat)
  disc.position.y = 0.17
  disc.castShadow = true
  disc.receiveShadow = true
  turntable.add(disc)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.035, 8, 64), mats.signal)
  rim.rotation.x = Math.PI / 2
  rim.position.y = TOP_Y
  turntable.add(rim)
  root.add(turntable)

  const diverter = new THREE.Group()
  diverter.position.y = TOP_Y
  const arrow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 1.1),
    new THREE.MeshBasicMaterial({ map: arrowTexture(), transparent: true, opacity: 0.9, depthWrite: false, color: 0xa9c6ff, toneMapped: false }),
  )
  arrow.rotation.x = -Math.PI / 2
  arrow.rotation.z = Math.PI // la textura apunta hacia -z; la giramos para que apunte a +z
  arrow.position.set(0, 0.012, 0.15)
  diverter.add(arrow)
  // compuertas: dos paletas que encauzan hacia la salida elegida
  for (const side of [-1, 1]) {
    const blade = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.34, 1.0, 2, 0.04), mats.trim)
    blade.position.set(side * 0.62, 0.17, 0.62)
    blade.rotation.y = side * -0.35
    blade.castShadow = true
    diverter.add(blade)
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.8), mats.signal)
    tip.position.set(side * 0.62, 0.36, 0.62)
    tip.rotation.y = side * -0.35
    diverter.add(tip)
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 20), mats.bodyPrimary)
  hub.position.y = 0.15
  diverter.add(hub)
  root.add(diverter)

  // ---- Canaletas de salida y muelles ----
  const chuteTex = beltTexture()
  const chuteTexes: THREE.Texture[] = []
  const chuteLamps = {} as Record<Dir, THREE.MeshStandardMaterial>
  const padRims = {} as Record<Dir, THREE.MeshStandardMaterial>
  const padLights = {} as Record<Dir, THREE.PointLight>
  const dockHit = {} as Record<Dir, THREE.Mesh>
  const signs = {} as Record<Dir, { canvas: HTMLCanvasElement; texture: THREE.Texture }>
  const kinds: Record<Dir, TaskKind> = { left: "web", center: "movil", right: "cloud" }
  const keys: Record<Dir, string> = { left: "←", center: "↓", right: "→" }

  for (const dir of ["left", "center", "right"] as Dir[]) {
    const pad = PAD_POS[dir]
    const kind = kinds[dir]
    const color = new THREE.Color(KIND_HEX[kind])
    const angle = DIR_ANGLE[dir]
    const start = 1.25
    const end = pad.length() - 0.85
    const len = end - start
    const chute = new THREE.Group()
    chute.rotation.y = angle
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.28, len, 2, 0.05), mats.bodySecondary)
    body.position.set(0, 0.15, start + len / 2)
    body.receiveShadow = true
    body.castShadow = true
    chute.add(body)
    const t = chuteTex.clone()
    t.repeat.set(1, len / 1.4)
    t.needsUpdate = true
    chuteTexes.push(t)
    const top = new THREE.Mesh(new THREE.PlaneGeometry(1.2, len), new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 }))
    top.rotation.x = -Math.PI / 2
    top.position.set(0, TOP_Y - 0.03, start + len / 2)
    top.receiveShadow = true
    chute.add(top)
    const lamp = new THREE.MeshStandardMaterial({ color: 0x0b0f1a, emissive: color, emissiveIntensity: 0.25 })
    chuteLamps[dir] = lamp
    for (const side of [-1, 1]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, len), lamp)
      strip.position.set(side * 0.72, TOP_Y + 0.02, start + len / 2)
      chute.add(strip)
    }
    root.add(chute)

    // Muelle
    const padGroup = new THREE.Group()
    padGroup.position.copy(pad)
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.75, 0.3, 1.75, 3, 0.1), mats.bodyPrimary)
    base.position.y = 0.15
    base.castShadow = true
    base.receiveShadow = true
    padGroup.add(base)
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x0b0f1a, emissive: color, emissiveIntensity: 0.9 })
    padRims[dir] = rimMat
    const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 8, 4), rimMat)
    rimMesh.rotation.set(Math.PI / 2, 0, Math.PI / 4)
    rimMesh.position.y = 0.31
    padGroup.add(rimMesh)
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshBasicMaterial({ map: taskDecalTexture(kind, false), transparent: true, opacity: 0.55, depthWrite: false }),
    )
    plate.rotation.x = -Math.PI / 2
    plate.position.y = 0.305
    padGroup.add(plate)
    const light = new THREE.PointLight(color, coarse ? 0 : 1.2, 5, 2)
    light.position.set(0, 1.4, 0)
    padLights[dir] = light
    padGroup.add(light)
    root.add(padGroup)

    // Zona táctil generosa sobre muelle + canaleta
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.6), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.copy(pad).setY(0.6)
    hit.userData.dir = dir
    dockHit[dir] = hit
    root.add(hit)

    // Letrero en el piso
    const sign = signTexture(kind, labels[dir], keys[dir])
    signs[dir] = sign
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 0.65),
      new THREE.MeshBasicMaterial({ map: sign.texture, transparent: true, depthWrite: false }),
    )
    signMesh.rotation.x = -Math.PI / 2
    if (dir === "center") signMesh.position.set(0, 0.012, 4.85)
    else signMesh.position.set(pad.x, 0.012, 1.45)
    root.add(signMesh)
  }

  // ---- Dispositivos ----
  const screens = {} as Record<Dir, THREE.MeshStandardMaterial>
  const deviceTargets = {} as Record<Dir, THREE.Vector3>

  // Portátil (WEB) detrás del muelle izquierdo
  {
    const g = new THREE.Group()
    g.position.set(-4.05, 0, -2.05)
    g.rotation.y = 0.32
    const base = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.12, 1.5, 2, 0.05), mats.trim)
    base.position.y = 0.06
    base.castShadow = true
    g.add(base)
    const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.2), new THREE.MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.7 }))
    kb.rotation.x = -Math.PI / 2
    kb.position.set(0, 0.125, 0.08)
    g.add(kb)
    const lid = new THREE.Group()
    lid.position.set(0, 0.12, -0.72)
    lid.rotation.x = -0.32
    const back = new THREE.Mesh(new RoundedBoxGeometry(2.3, 1.45, 0.08, 2, 0.04), mats.trim)
    back.position.y = 0.72
    back.castShadow = true
    lid.add(back)
    const screenMat = new THREE.MeshStandardMaterial({
      map: browserScreenTexture(),
      emissive: 0xffffff,
      emissiveMap: browserScreenTexture(),
      emissiveIntensity: 0.65,
      roughness: 0.3,
    })
    screens.left = screenMat
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.28), screenMat)
    screen.position.set(0, 0.73, 0.045)
    lid.add(screen)
    g.add(lid)
    root.add(g)
    deviceTargets.left = new THREE.Vector3(-4.0, 1.0, -2.3)
  }

  // Teléfono (MÓVIL) en atril, a la derecha del muelle central
  {
    const g = new THREE.Group()
    g.position.set(2.05, 0, 3.75)
    g.rotation.y = -0.45
    const stand = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.16, 0.9, 2, 0.05), mats.trim)
    stand.position.y = 0.08
    stand.castShadow = true
    g.add(stand)
    const phone = new THREE.Group()
    phone.position.set(0, 0.16, -0.12)
    phone.rotation.x = -0.95
    const shell = new THREE.Mesh(new RoundedBoxGeometry(0.95, 1.75, 0.1, 4, 0.12), mats.bodyPrimary)
    shell.position.y = 0.87
    shell.castShadow = true
    phone.add(shell)
    const screenMat = new THREE.MeshStandardMaterial({
      map: phoneScreenTexture(),
      emissive: 0xffffff,
      emissiveMap: phoneScreenTexture(),
      emissiveIntensity: 0.65,
      roughness: 0.25,
    })
    screens.center = screenMat
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 1.6), screenMat)
    screen.position.set(0, 0.87, 0.052)
    phone.add(screen)
    g.add(phone)
    root.add(g)
    deviceTargets.center = new THREE.Vector3(1.95, 0.9, 3.55)
  }

  // Rack de servidores (CLOUD) detrás del muelle derecho
  let rackLeds: THREE.InstancedMesh
  {
    const g = new THREE.Group()
    g.position.set(4.1, 0, -2.15)
    g.rotation.y = -0.32
    const cab = new THREE.Mesh(new RoundedBoxGeometry(1.5, 2.6, 1.2, 2, 0.06), mats.bodyPrimary)
    cab.position.y = 1.3
    cab.castShadow = true
    g.add(cab)
    const front = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.4), new THREE.MeshStandardMaterial({ map: rackTexture(), roughness: 0.5, metalness: 0.4 }))
    front.position.set(0, 1.3, 0.605)
    g.add(front)
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0b0f1a, emissive: KIND_HEX.cloud, emissiveIntensity: 0.2 })
    screens.right = screenMat
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.04), screenMat)
    topStrip.position.set(0, 2.55, 0.61)
    g.add(topStrip)
    rackLeds = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.07, 0.05, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
      24,
    )
    const c = new THREE.Color()
    for (let i = 0; i < 24; i += 1) {
      const row = Math.floor(i / 3)
      const col = i % 3
      m4.makeTranslation(-0.48 + col * 0.11, 2.4 - row * 0.3, 0.62)
      rackLeds.setMatrixAt(i, m4)
      rackLeds.setColorAt(i, c.set(i % 4 === 0 ? 0x4f8cff : 0x34d399))
    }
    g.add(rackLeds)
    root.add(g)
    deviceTargets.right = new THREE.Vector3(4.1, 1.6, -1.6)
  }


  // ---- Kit del taller: tableros kanban, cajas del backlog y cableado ----
  const kanbans: World["kanbans"] = []
  for (const side of [-1, 1]) {
    const seed = side < 0 ? 11 : 29
    const k = kanbanTexture(lang, seed)
    kanbans.push({ ...k, seed })
    const g = new THREE.Group()
    g.position.set(side * 8.6, 0, -6.6)
    g.rotation.y = side * -0.5
    for (const px2 of [-1.7, 1.7]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 10), mats.trim)
      post.position.set(px2, 0.7, 0)
      g.add(post)
      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.08, 0.5, 2, 0.03), mats.bodySecondary)
      foot.position.set(px2, 0.04, 0)
      g.add(foot)
    }
    const frame = new THREE.Mesh(new RoundedBoxGeometry(4.3, 2.75, 0.14, 2, 0.05), mats.trim)
    frame.position.y = 2.6
    frame.castShadow = true
    g.add(frame)
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(4.1, 2.56),
      new THREE.MeshStandardMaterial({ map: k.texture, emissive: 0xffffff, emissiveMap: k.texture, emissiveIntensity: 0.28, roughness: 0.7 }),
    )
    face.position.set(0, 2.6, 0.075)
    g.add(face)
    root.add(g)
  }

  // Cajas de tickets apiladas junto al portal
  const crateSpots: [number, number, number, number][] = [
    [-2.7, 0.35, -10.2, 0.2], [-3.5, 0.35, -9.6, -0.3], [-2.95, 1.05, -9.9, 0.5], [-4.2, 0.35, -10.6, 0.1],
    [2.8, 0.35, -9.9, -0.2], [3.6, 0.35, -10.5, 0.35], [3.15, 1.05, -10.2, -0.1],
  ]
  const crates = new THREE.InstancedMesh(new RoundedBoxGeometry(0.7, 0.7, 0.7, 2, 0.06), std(0xffffff, 0.6, 0.1), crateSpots.length)
  const crateColors = [0x22314f, 0x1f3b37, 0x2a3346, 0x3a3020]
  crateSpots.forEach(([x, y, z, r], i) => {
    m4.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r, 0)), new THREE.Vector3(1, 1, 1))
    crates.setMatrixAt(i, m4)
    crates.setColorAt(i, new THREE.Color(crateColors[i % crateColors.length]))
  })
  crates.castShadow = true
  crates.receiveShadow = true
  root.add(crates)

  // Cableado de datos que sale de cada dispositivo hacia el fondo
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x0b0f1a, emissive: LAB_COLORS.primary, emissiveIntensity: 0.7 })
  const cablePaths: [number, number][][] = [
    [[-4.6, -2.6], [-6.2, -5.2], [-6.6, -9.5], [-9.5, -13]],
    [[4.6, -2.6], [6.2, -5.2], [6.6, -9.5], [9.5, -13]],
    [[-1.2, -10.9], [-1.9, -12.6], [-1.4, -16]],
  ]
  for (const pts of cablePaths) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0.04, z)))
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.035, 6), cableMat))
  }

  // ---- Portal del backlog ----
  const portal = new THREE.Group()
  portal.position.set(0, 0, BELT_START_Z - 0.35)
  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.42, 2.7, 0.6, 2, 0.06), mats.bodyPrimary)
    pillar.position.set(side * 1.45, 1.35, 0)
    pillar.castShadow = true
    portal.add(pillar)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.3, 0.05), mats.signal)
    strip.position.set(side * 1.22, 1.35, 0.3)
    portal.add(strip)
  }
  const beam = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.42, 0.6, 2, 0.06), mats.bodyPrimary)
  beam.position.y = 2.85
  beam.castShadow = true
  portal.add(beam)
  const portalSign = portalSignTexture(portalLabel)
  const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.49), new THREE.MeshBasicMaterial({ map: portalSign.texture, transparent: true }))
  signMesh.position.set(0, 2.86, 0.31)
  portal.add(signMesh)
  const portalGlowMat = new THREE.MeshBasicMaterial({
    map: glowTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  })
  const portalGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), portalGlowMat)
  portalGlow.position.set(0, 1.35, -0.05)
  portal.add(portalGlow)
  const portalRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.045, 8, 48, Math.PI * 1.6), mats.signal)
  portalRing.position.set(0, 1.35, 0)
  portal.add(portalRing)
  root.add(portal)

  // ---- Torreta QA ----
  const turret = new THREE.Group()
  turret.position.set(1.85, 0, -4.6)
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.5, 20), mats.bodyPrimary)
  tBase.position.y = 0.25
  tBase.castShadow = true
  turret.add(tBase)
  const tRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 6, 32), mats.hazard)
  tRing.rotation.x = Math.PI / 2
  tRing.position.y = 0.5
  turret.add(tRing)
  const head = new THREE.Group()
  head.position.y = 0.72
  const housing = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.34, 0.5, 2, 0.08), mats.trim)
  housing.castShadow = true
  head.add(housing)
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 12), mats.bodySecondary)
  barrel.rotation.x = Math.PI / 2
  barrel.position.z = 0.4
  head.add(barrel)
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), mats.hazard)
  lens.position.z = 0.651
  head.add(lens)
  const muzzle = new THREE.Object3D()
  muzzle.position.z = 0.66
  head.add(muzzle)
  turret.add(head)
  root.add(turret)

  return {
    root,
    beltTex,
    chuteTexes,
    turntable,
    turntableMat,
    diverter,
    chuteLamps,
    padRims,
    padLights,
    screens,
    deviceTargets,
    dockHit,
    signs,
    portalSign,
    portalRing,
    portalGlow,
    portalGlowMat,
    rackLeds,
    rollers,
    turret: { root: turret, head, muzzle },
    kanbans,
  }
}

// ---------- Tareas y bugs ----------
export type Pieces = {
  geo: Record<TaskKind, THREE.BufferGeometry>
  decalGeo: Record<TaskKind, THREE.BufferGeometry>
  decals: Record<TaskKind, THREE.MeshBasicMaterial>
  hotfixDecals: Record<TaskKind, THREE.MeshBasicMaterial>
  hotfixRingGeo: THREE.BufferGeometry
  shadowGeo: THREE.BufferGeometry
  shadowMat: THREE.MeshBasicMaterial
  proxyGeo: THREE.BufferGeometry
  proxyMat: THREE.MeshBasicMaterial
  bug: {
    body: THREE.BufferGeometry
    head: THREE.BufferGeometry
    eye: THREE.BufferGeometry
    leg: THREE.BufferGeometry
    seam: THREE.BufferGeometry
    antenna: THREE.BufferGeometry
  }
}

export function createPieces(): Pieces {
  const decal = (kind: TaskKind, hot: boolean) =>
    new THREE.MeshBasicMaterial({ map: taskDecalTexture(kind, hot), transparent: true, depthWrite: false })
  const shadowCanvas = document.createElement("canvas")
  shadowCanvas.width = shadowCanvas.height = 64
  const sctx = shadowCanvas.getContext("2d")!
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, "rgba(0,0,0,0.55)")
  grad.addColorStop(1, "rgba(0,0,0,0)")
  sctx.fillStyle = grad
  sctx.fillRect(0, 0, 64, 64)
  return {
    geo: {
      web: new RoundedBoxGeometry(1.15, 0.42, 0.8, 3, 0.09),
      movil: new RoundedBoxGeometry(0.62, 0.5, 0.98, 3, 0.11),
      cloud: new THREE.CylinderGeometry(0.5, 0.52, 0.42, 32),
    },
    decalGeo: {
      web: new THREE.PlaneGeometry(0.66, 0.66),
      movil: new THREE.PlaneGeometry(0.54, 0.54),
      cloud: new THREE.CircleGeometry(0.42, 32),
    },
    decals: { web: decal("web", false), movil: decal("movil", false), cloud: decal("cloud", false) },
    hotfixDecals: { web: decal("web", true), movil: decal("movil", true), cloud: decal("cloud", true) },
    hotfixRingGeo: new THREE.TorusGeometry(0.78, 0.035, 6, 40),
    shadowGeo: new THREE.PlaneGeometry(1.5, 1.5),
    shadowMat: new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }),
    proxyGeo: new THREE.SphereGeometry(0.8, 8, 6),
    proxyMat: new THREE.MeshBasicMaterial({ visible: false }),
    bug: {
      body: new THREE.SphereGeometry(0.5, 24, 16),
      head: new THREE.SphereGeometry(0.2, 16, 12),
      eye: new THREE.SphereGeometry(0.055, 8, 6),
      leg: new THREE.BoxGeometry(0.42, 0.045, 0.05),
      seam: new THREE.BoxGeometry(0.035, 0.03, 0.7),
      antenna: new THREE.CylinderGeometry(0.015, 0.015, 0.36, 5),
    },
  }
}

export function createTaskMesh(kind: TaskKind, pieces: Pieces, mats: Materials) {
  const root = new THREE.Group()
  const shadow = new THREE.Mesh(pieces.shadowGeo, pieces.shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  shadow.scale.setScalar(kind === "web" ? 1.0 : 0.85)
  root.add(shadow)
  const lift = new THREE.Group()
  root.add(lift)
  const body = new THREE.Mesh(pieces.geo[kind], mats.task[kind])
  body.position.y = 0.21
  body.castShadow = true
  lift.add(body)
  const decal = new THREE.Mesh(pieces.decalGeo[kind], pieces.decals[kind])
  decal.rotation.x = -Math.PI / 2
  decal.position.y = (kind === "movil" ? 0.5 : 0.42) + 0.006
  lift.add(decal)
  const ring = new THREE.Mesh(pieces.hotfixRingGeo, mats.hotfix)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.22
  ring.visible = false
  lift.add(ring)
  return { root, lift, body, decal, ring, shadow }
}

export function createBugMesh(pieces: Pieces, mats: Materials) {
  const root = new THREE.Group()
  const shadow = new THREE.Mesh(pieces.shadowGeo, pieces.shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  shadow.scale.set(0.8, 1, 1)
  root.add(shadow)
  const lift = new THREE.Group()
  root.add(lift)
  const body = new THREE.Mesh(pieces.bug.body, mats.bugShell)
  body.scale.set(0.82, 0.52, 1.1)
  body.position.y = 0.3
  body.castShadow = true
  lift.add(body)
  const seam = new THREE.Mesh(pieces.bug.seam, mats.bugDark)
  seam.position.set(0, 0.56, -0.04)
  lift.add(seam)
  const head = new THREE.Mesh(pieces.bug.head, mats.bugDark)
  head.position.set(0, 0.3, 0.58)
  lift.add(head)
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(pieces.bug.eye, mats.bugEye)
    eye.position.set(side * 0.1, 0.38, 0.72)
    lift.add(eye)
    const ant = new THREE.Mesh(pieces.bug.antenna, mats.bugDark)
    ant.position.set(side * 0.09, 0.5, 0.78)
    ant.rotation.set(0.9, 0, side * -0.4)
    lift.add(ant)
  }
  const legs: THREE.Group[] = []
  for (let i = 0; i < 6; i += 1) {
    const side = i < 3 ? -1 : 1
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.3, 0.22, -0.3 + (i % 3) * 0.3)
    const leg = new THREE.Mesh(pieces.bug.leg, mats.bugDark)
    leg.position.x = side * 0.2
    leg.rotation.z = side * -0.5
    pivot.add(leg)
    lift.add(pivot)
    legs.push(pivot)
  }
  const proxy = new THREE.Mesh(pieces.proxyGeo, pieces.proxyMat)
  proxy.position.y = 0.4
  root.add(proxy)
  return { root, lift, body, legs, proxy, shadow }
}
