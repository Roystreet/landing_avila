// Catálogo del Lab: los minijuegos de Avila System. Textos ES/EN y metadatos de ruta.

export type LabGameSlug = "sube-el-avila" | "sprint-de-entrega" | "arma-tu-app"

type Localized = { es: string; en: string }

export type LabGame = {
  slug: LabGameSlug
  title: Localized
  pitch: Localized
  description: Localized
  verb: Localized
  duration: Localized
  controls: { es: string[]; en: string[] }
}

export const LAB_GAMES: LabGame[] = [
  {
    slug: "sube-el-avila",
    title: { es: "Sube el Ávila", en: "Climb the Ávila" },
    pitch: {
      es: "Corre de noche por el sendero hasta el Pico Naiguatá esquivando bugs, cambios de alcance y deadlines.",
      en: "Run the night trail up to Pico Naiguatá, dodging bugs, scope changes and deadlines.",
    },
    description: {
      es: "Un runner en 3D por la montaña que se ve desde Caracas. Recoge commits, toma café para recuperar energía y llega a la cima antes de quedarte sin linterna.",
      en: "A 3D runner up the mountain Caracas looks at every day. Collect commits, grab coffee to recover energy and reach the summit before your headlamp runs out.",
    },
    verb: { es: "Esquiva y salta", en: "Dodge and jump" },
    duration: { es: "≈ 2 min", en: "≈ 2 min" },
    controls: {
      es: ["← → o A D para cambiar de carril", "Espacio o ↑ para saltar", "En celular: desliza"],
      en: ["← → or A D to change lanes", "Space or ↑ to jump", "On mobile: swipe"],
    },
  },
  {
    slug: "sprint-de-entrega",
    title: { es: "Sprint de entrega", en: "Delivery Sprint" },
    pitch: {
      es: "60 segundos para clasificar features en el pipeline correcto y frenar los bugs antes de producción.",
      en: "60 seconds to route features down the right pipeline and stop bugs before production.",
    },
    description: {
      es: "Las tareas bajan por la banda del backlog: envía cada una a Web, Móvil o Cloud y aplasta los bugs. Encadena aciertos para multiplicar el puntaje.",
      en: "Tasks roll down the backlog belt: send each one to Web, Mobile or Cloud and squash the bugs. Chain hits to multiply your score.",
    },
    verb: { es: "Clasifica rápido", en: "Sort fast" },
    duration: { es: "60 s", en: "60 s" },
    controls: {
      es: ["← ↓ → o toca el destino", "Toca un bug o pulsa Espacio para aplastarlo"],
      en: ["← ↓ → or tap the destination", "Tap a bug or press Space to squash it"],
    },
  },
  {
    slug: "arma-tu-app",
    title: { es: "Arma tu app", en: "Build your app" },
    pitch: {
      es: "Elige plataforma y módulos, y mira cómo tu producto se arma pieza por pieza en 3D.",
      en: "Pick a platform and modules, and watch your product assemble piece by piece in 3D.",
    },
    description: {
      es: "Un configurador en 3D: combina web, móvil, pagos, IA, integraciones y más. Cuando te guste, envíalo a cotización con todo ya marcado.",
      en: "A 3D configurator: combine web, mobile, payments, AI, integrations and more. When you like it, send it to a quote with everything pre-filled.",
    },
    verb: { es: "Combina y gira", en: "Combine and orbit" },
    duration: { es: "Libre", en: "Free play" },
    controls: {
      es: ["Toca los módulos para agregarlos", "Arrastra para girar la escena"],
      en: ["Tap modules to add them", "Drag to orbit the scene"],
    },
  },
]

export function getLabGame(slug: string) {
  return LAB_GAMES.find((g) => g.slug === slug)
}
