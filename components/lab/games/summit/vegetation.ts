// Vegetación por pisos del Ávila con modelos CC0 de Kenney:
// abajo palmas y bosque, en el medio selva nublada, arriba subpáramo con rocas y arbustos.
// Se agrupa en tramos para dibujar solo lo cercano a la cámara.
import * as THREE from "three"
import { createRng } from "@/components/lab/engine/core"
import { instance, single, type KitName, type NatureKit } from "@/components/lab/games/summit/assets"
import {
  fbm,
  groundY,
  sharedGlow,
  SLOPE,
  terrainOffset,
  TRACK_LENGTH,
  TRAIL_HALF,
  WORLD_END,
  WORLD_START,
} from "@/components/lab/games/summit/world"

const CHUNK = 120

type Weighted = [KitName, number, [number, number]][] // modelo, peso, escala

const ZONES: { trees: Weighted; under: Weighted; ground: Weighted }[] = [
  {
    // Piso bajo: palmas y bosque seco
    trees: [
      ["tree_palmTall", 3, [5.5, 7.5]],
      ["tree_palmDetailedTall", 2, [5.5, 7]],
      ["tree_default_dark", 3, [4, 5.5]],
      ["tree_oak_dark", 2, [4.5, 6]],
    ],
    under: [
      ["plant_bushLarge", 3, [3, 4.5]],
      ["plant_bushDetailed", 2, [2.5, 3.5]],
      ["flower_redA", 2, [2.5, 3.5]],
      ["flower_yellowB", 2, [2.5, 3.2]],
    ],
    ground: [
      ["grass_large", 3, [2.4, 3.4]],
      ["rock_largeA", 1, [1.5, 3]],
    ],
  },
  {
    // Selva nublada: árboles densos, hongos, troncos caídos
    trees: [
      ["tree_detailed_dark", 3, [5, 7]],
      ["tree_tall_dark", 1, [5, 6.5]],
      ["tree_default_dark", 2, [4.5, 6]],
      ["tree_fat_darkh", 2, [5, 6.5]],
      ["tree_oak_dark", 2, [5, 6.5]],
    ],
    under: [
      ["grass_leafsLarge", 4, [3, 4.5]],
      ["mushroom_redGroup", 1, [1.6, 2.2]],
      ["mushroom_tanGroup", 1, [1.6, 2.2]],
      ["stump_oldTall", 1, [1.8, 2.4]],
      ["log_large", 1, [2.2, 2.8]],
    ],
    ground: [
      ["grass_large", 2, [2.4, 3.2]],
      ["plant_bushSmall", 2, [3, 4]],
    ],
  },
  {
    // Subpáramo: arbustos bajos, piedras altas y flores moradas
    trees: [
      ["tree_pineRoundB", 2, [3.5, 5]],
      ["tree_pineSmallC", 3, [3, 4.5]],
      ["tree_pineTallA_detailed", 1, [4, 5.5]],
    ],
    under: [
      ["rock_tallB", 2, [2, 3.6]],
      ["stone_tallC", 2, [2, 3.2]],
      ["flower_purpleC", 3, [3, 4]],
      ["plant_bushSmall", 2, [3, 4]],
    ],
    ground: [
      ["grass_large", 2, [2.2, 3]],
      ["rock_largeC", 2, [1.8, 3.5]],
      ["rock_largeE", 1, [1.8, 3.5]],
    ],
  },
]

function zoneOf(progress: number, jitter: number) {
  const p = progress + jitter
  return p < 0.33 ? 0 : p < 0.7 ? 1 : 2
}

function pick(list: Weighted, r: number) {
  const total = list.reduce((a, [, w]) => a + w, 0)
  let k = r * total
  for (const item of list) {
    k -= item[1]
    if (k <= 0) return item
  }
  return list[list.length - 1]
}

/** `lite` (celulares): menos plantas, sin sombras de vegetación y menos distancia de dibujo. */
export function populateWithKit(root: THREE.Group, kit: NatureKit, lite = false) {
  const rng = createRng(4242)
  const nChunks = Math.ceil((WORLD_END + WORLD_START) / CHUNK)
  // buckets[chunk][modelo] = matrices
  const buckets: Map<KitName, { m: THREE.Matrix4[]; c: THREE.Color[]; shadow: boolean }>[] = Array.from({ length: nChunks }, () => new Map())
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)

  const h = (x: number, z: number) => groundY(z) + terrainOffset(x, z)
  const normal = new THREE.Vector3()
  const align = new THREE.Quaternion()
  const yawQ = new THREE.Quaternion()
  const place = (name: KitName, x: number, z: number, scale: number, shadow: boolean, sink = 0.05, tint = 1, hug = false) => {
    // Respeta el claro del campamento en la cumbre
    if (Math.abs(z + TRACK_LENGTH + 2) < 14 && Math.abs(x) < 12) return
    const chunk = Math.min(nChunks - 1, Math.max(0, Math.floor((WORLD_START - z) / CHUNK)))
    const e = 0.6
    normal.set(-(h(x + e, z) - h(x - e, z)) / (2 * e), 1, -(h(x, z + e) - h(x, z - e)) / (2 * e)).normalize()
    const steep = 1 - normal.y
    // Hundido según la pendiente para que nada flote en la ladera
    const y = h(x, z) - sink - steep * scale * (hug ? 0.9 : 0.6)
    yawQ.setFromAxisAngle(up, rng.next() * Math.PI * 2)
    if (hug) {
      // Rocas y plantas bajas se apoyan sobre el terreno inclinado
      align.setFromUnitVectors(up, normal)
      q.copy(align).multiply(yawQ)
    } else q.copy(yawQ)
    m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(scale, scale * rng.range(0.92, 1.12), scale))
    let b = buckets[chunk].get(name)
    if (!b) {
      b = { m: [], c: [], shadow }
      buckets[chunk].set(name, b)
    }
    b.m.push(m.clone())
    const v = tint * rng.range(0.78, 1.12)
    b.c.push(new THREE.Color(v, v * rng.range(0.96, 1.05), v))
  }

  // Árboles: más densos a la derecha (ladera) y en la selva nublada
  for (let i = 0; i < (lite ? 3400 : 5200); i += 1) {
    const z = rng.range(-WORLD_END, WORLD_START)
    const progress = THREE.MathUtils.clamp(-z / TRACK_LENGTH, 0, 1)
    const zone = zoneOf(progress, rng.range(-0.05, 0.05))
    const side = rng.chance(0.64) ? 1 : -1
    const x = side * (TRAIL_HALF + 2.4 + Math.pow(rng.next(), 1.5) * (side > 0 ? 62 : 40))
    if (side < 0 && Math.abs(x) < TRAIL_HALF + 3.2) continue
    if (side < 0 && terrainOffset(x, z) < -40) continue
    const density = [0.55, 0.85, 0.32][zone]
    if (rng.next() > density) continue
    if (fbm(x * 0.03 + 40, z * 0.03) < 0.4) continue
    const [name, , [a, b]] = pick(ZONES[zone].trees, rng.next())
    place(name, x, z, rng.range(a, b), !lite && Math.abs(x) < 16, 0.15)
  }

  // Sotobosque cerca del sendero: lo que se ve pasar a los lados
  for (let i = 0; i < (lite ? 2600 : 4200); i += 1) {
    const z = rng.range(-WORLD_END, WORLD_START)
    const progress = THREE.MathUtils.clamp(-z / TRACK_LENGTH, 0, 1)
    const zone = zoneOf(progress, rng.range(-0.04, 0.04))
    const side = rng.chance(0.6) ? 1 : -1
    const x = side * (TRAIL_HALF + 0.55 + Math.pow(rng.next(), 2) * 14)
    if (side < 0 && x > -TRAIL_HALF - 1.4) continue // deja libre el barandal
    const near = Math.abs(x) < TRAIL_HALF + 6
    const list = rng.chance(0.55) ? ZONES[zone].under : ZONES[zone].ground
    const [name, , [a, b]] = pick(list, rng.next())
    place(name, x, z, rng.range(a, b) * (near ? 0.85 : 1), !lite && near && name.startsWith("rock"), 0.02, 1, true)
  }

  const chunks: THREE.Group[] = buckets.map((bucket) => {
    const g = new THREE.Group()
    bucket.forEach((b, name) => g.add(instance(kit[name], b.m, { castShadow: b.shadow, colors: b.c })))
    root.add(g)
    return g
  })

  // Barandal de madera (Kenney) siguiendo la pendiente del lado del barranco
  const fenceMats: THREE.Matrix4[] = []
  const tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.atan(SLOPE))
  const yaw = new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2)
  const fq = tilt.clone().multiply(yaw)
  for (let z = WORLD_START; z > -TRACK_LENGTH - 4; z -= 3.6) {
    const x = -TRAIL_HALF - 0.4
    const zc = z - 1.8
    fenceMats.push(new THREE.Matrix4().compose(new THREE.Vector3(x, groundY(zc) + terrainOffset(x, zc) - 0.05, zc), fq, new THREE.Vector3(3.6, 3, 3)))
  }
  root.add(instance(kit.fence_simple, fenceMats, { castShadow: false }))

  // Campamento en la cumbre: carpa, fogata y troncos para sentarse
  const camp = new THREE.Group()
  const summitZ = -TRACK_LENGTH - 2
  camp.position.set(0, groundY(summitZ), summitZ)
  const tent = single(kit.tent_detailedOpen)
  tent.scale.setScalar(3.2)
  tent.position.set(3.4, 0, -3)
  tent.rotation.y = -0.6
  const ring = single(kit.campfire_stones)
  ring.scale.setScalar(2.4)
  ring.position.set(-2.4, 0, -1.5)
  const seat1 = single(kit.log_large)
  seat1.scale.setScalar(1.4)
  seat1.position.set(-3.9, 0, -0.6)
  seat1.rotation.y = 0.5
  const seat2 = single(kit.log_large)
  seat2.scale.setScalar(1.4)
  seat2.position.set(-1.2, 0, -3)
  seat2.rotation.y = -1.1
  camp.add(tent, ring, seat1, seat2)
  const fireLight = new THREE.PointLight(0xff9a3c, 18, 14, 1.6)
  fireLight.position.set(-2.4, 0.8, -1.5)
  const flameMat = new THREE.SpriteMaterial({ map: sharedGlow(), color: 0xffa040, blending: THREE.AdditiveBlending, depthWrite: false })
  const flames = Array.from({ length: 5 }, (_, i) => {
    const f = new THREE.Sprite(flameMat.clone())
    f.position.set(-2.4 + (i - 2) * 0.12, 0.35, -1.5)
    camp.add(f)
    return f
  })
  camp.add(fireLight)
  root.add(camp)

  // Luciérnagas que acompañan al jugador en el bosque
  const ffCount = 90
  const ffBase = new Float32Array(ffCount * 3)
  const ffPos = new Float32Array(ffCount * 3)
  for (let i = 0; i < ffCount; i += 1) {
    ffBase.set([rng.range(-14, 14), rng.range(0.4, 3.5), rng.range(-40, 10)], i * 3)
  }
  const ffGeo = new THREE.BufferGeometry()
  ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPos, 3))
  const ffMat = new THREE.PointsMaterial({ map: sharedGlow(), color: 0xd8ff8a, size: 0.35, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const fireflies = new THREE.Points(ffGeo, ffMat)
  fireflies.frustumCulled = false
  root.add(fireflies)

  // Mar de nubes sobre el valle: aparece cuando ya subiste por encima de él
  const deckY = groundY(-TRACK_LENGTH * 0.6) - 4
  const cloudMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: { time: { value: 0 }, opacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float time; uniform float opacity; varying vec3 vWorld;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
      float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=0.5; } return v; }
      void main(){
        vec2 p = vWorld.xz * 0.012 + vec2(time * 0.01, time * 0.004);
        float d = fbm(p);
        float edge = smoothstep(-14.0, -60.0, vWorld.x);
        float a = smoothstep(0.38, 0.75, d) * edge * opacity;
        vec3 col = mix(vec3(0.33,0.39,0.55), vec3(0.78,0.84,0.97), smoothstep(0.45, 0.9, d));
        gl_FragColor = vec4(col, a * 0.92);
      }`,
  })
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(1600, 2600, 1, 1).rotateX(-Math.PI / 2), cloudMat)
  deck.position.set(-760, deckY, -TRACK_LENGTH / 2)
  deck.renderOrder = 2
  root.add(deck)

  return {
    update(dt: number, elapsed: number, playerZ: number) {
      // Solo los tramos cercanos se dibujan
      for (let i = 0; i < chunks.length; i += 1) {
        const zTop = WORLD_START - i * CHUNK
        const zBottom = zTop - CHUNK
        chunks[i].visible = zBottom < playerZ + 40 && zTop > playerZ - (lite ? 230 : 320)
      }
      const progress = THREE.MathUtils.clamp(-playerZ / TRACK_LENGTH, 0, 1)
      cloudMat.uniforms.time.value = elapsed
      cloudMat.uniforms.opacity.value = THREE.MathUtils.smoothstep(progress, 0.5, 0.68)
      // Luciérnagas solo en el bosque bajo y la selva nublada
      const ffAlpha = 1 - THREE.MathUtils.smoothstep(progress, 0.62, 0.74)
      ffMat.opacity = ffAlpha
      fireflies.visible = ffAlpha > 0.01
      if (fireflies.visible) {
        for (let i = 0; i < ffCount; i += 1) {
          const bx = ffBase[i * 3]
          const by = ffBase[i * 3 + 1]
          let bz = ffBase[i * 3 + 2]
          // Se reciclan alrededor del jugador
          bz = ((((bz - playerZ) % 50) + 50) % 50) - 40 + playerZ
          const ox = Math.sin(elapsed * 0.7 + i) * 0.6
          const oy = Math.sin(elapsed * 1.3 + i * 1.7) * 0.3
          const x = Math.abs(bx) < TRAIL_HALF ? bx + Math.sign(bx || 1) * TRAIL_HALF : bx
          ffPos[i * 3] = x + ox
          ffPos[i * 3 + 1] = groundY(bz) + Math.max(0, terrainOffset(x, bz)) + by + oy
          ffPos[i * 3 + 2] = bz
        }
        ffGeo.attributes.position.needsUpdate = true
        ffMat.size = 0.28 + Math.sin(elapsed * 3) * 0.06
      }
      // Fogata
      fireLight.intensity = 16 + Math.sin(elapsed * 13) * 3 + Math.sin(elapsed * 31) * 2
      flames.forEach((f, i) => {
        const k = (elapsed * 1.6 + i / flames.length) % 1
        f.position.y = 0.3 + k * 1.1
        f.scale.setScalar(0.9 * (1 - k) + 0.2)
        f.material.opacity = 1 - k
      })
      void dt
    },
  }
}
