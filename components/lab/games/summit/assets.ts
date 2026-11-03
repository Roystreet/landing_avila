// Modelos CC0 del Nature Kit de Kenney (www.kenney.nl), servidos desde /public/lab/models/nature.
// Se cargan una vez y se dibujan con InstancedMesh: miles de plantas en pocas llamadas de dibujo.
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export const KIT_MODELS = [
  "tree_palmTall",
  "tree_palmDetailedTall",
  "tree_default_dark",
  "tree_oak_dark",
  "tree_detailed_dark",
  "tree_tall_dark",
  "tree_fat_darkh",
  "tree_pineRoundB",
  "tree_pineSmallC",
  "tree_pineTallA_detailed",
  "plant_bushLarge",
  "plant_bushDetailed",
  "plant_bushSmall",
  "grass_large",
  "grass_leafsLarge",
  "flower_redA",
  "flower_yellowB",
  "flower_purpleC",
  "mushroom_redGroup",
  "mushroom_tanGroup",
  "stump_oldTall",
  "log_large",
  "rock_largeA",
  "rock_largeC",
  "rock_largeE",
  "rock_tallB",
  "rock_tallE",
  "stone_tallC",
  "fence_simple",
  "campfire_stones",
  "tent_detailedOpen",
] as const

export type KitName = (typeof KIT_MODELS)[number]

/** Cada modelo queda como lista de (geometría horneada, material) lista para instanciar. */
export type KitPart = { geometry: THREE.BufferGeometry; material: THREE.MeshStandardMaterial }
export type NatureKit = Record<KitName, KitPart[]>

// Tonos ajustados a la noche: los colores originales de Kenney son de mediodía.
const NIGHT_TINT: Record<string, number> = {
  leafsDark: 0x2f6a45,
  leafsGreen: 0x3f8a52,
  grass: 0x3c7a48,
  woodBark: 0x6b4a32,
  woodBarkDark: 0x4a3426,
  dirt: 0x5b4c3e,
  stone: 0x8a8f9c,
}

export async function loadNatureKit(onProgress?: (k: number) => void): Promise<NatureKit> {
  const loader = new GLTFLoader()
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  let done = 0
  const entries = await Promise.all(
    KIT_MODELS.map(async (name) => {
      const gltf = await loader.loadAsync(`/lab/models/nature/${name}.glb`)
      const root = gltf.scene
      root.updateMatrixWorld(true)
      const parts: KitPart[] = []
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        const src = mesh.material as THREE.MeshStandardMaterial
        const key = src.name || "default"
        // Un material compartido por nombre: menos cambios de estado y tinte nocturno coherente
        let mat = materials.get(key)
        if (!mat) {
          mat = new THREE.MeshStandardMaterial({
            name: key,
            color: NIGHT_TINT[key] ?? src.color,
            roughness: 0.88,
            metalness: 0,
            flatShading: true,
          })
          materials.set(key, mat)
        }
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
        geometry.computeBoundingSphere()
        parts.push({ geometry, material: mat })
      })
      done += 1
      onProgress?.(done / KIT_MODELS.length)
      return [name, parts] as const
    }),
  )
  return Object.fromEntries(entries) as NatureKit
}

/** Crea un grupo de InstancedMesh (uno por parte del modelo) con las mismas transformaciones. */
export function instance(
  parts: KitPart[],
  matrices: THREE.Matrix4[],
  opts: { castShadow?: boolean; receiveShadow?: boolean; colors?: THREE.Color[] } = {},
) {
  const group = new THREE.Group()
  if (!matrices.length) return group
  for (const part of parts) {
    const im = new THREE.InstancedMesh(part.geometry, part.material, matrices.length)
    matrices.forEach((m, i) => im.setMatrixAt(i, m))
    if (opts.colors) opts.colors.forEach((c, i) => im.setColorAt(i, c))
    im.instanceMatrix.needsUpdate = true
    if (im.instanceColor) im.instanceColor.needsUpdate = true
    im.castShadow = !!opts.castShadow
    im.receiveShadow = opts.receiveShadow ?? true
    im.computeBoundingSphere()
    group.add(im)
  }
  return group
}

/** Una copia normal (no instanciada) para piezas únicas como la carpa de la cumbre. */
export function single(parts: KitPart[]) {
  const group = new THREE.Group()
  for (const part of parts) {
    const mesh = new THREE.Mesh(part.geometry, part.material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }
  return group
}
