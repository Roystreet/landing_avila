// Datos de "Arma tu app": plataformas, módulos, mapeo al formulario de cotización
// y el código compacto que permite compartir un armado por enlace.
import type { Language } from "@/components/providers/language-provider"

export type PlatformId = "web" | "mobile" | "both"

export type ModuleId = "login" | "payments" | "dashboard" | "ai" | "api" | "notifications" | "maps" | "inventory" | "cloud"

// Ids del formulario de cotización (components/sections/quote-section.tsx)
type QuoteService = "web" | "apps" | "sistemas" | "cloud" | "ia" | "otro"

type Localized = { es: string; en: string }

export const PLATFORMS: { id: PlatformId; code: string; label: Localized; hint: Localized }[] = [
  { id: "web", code: "w", label: { es: "Web", en: "Web" }, hint: { es: "Sitio o sistema en el navegador", en: "Site or system in the browser" } },
  { id: "mobile", code: "m", label: { es: "Móvil", en: "Mobile" }, hint: { es: "App para iOS y Android", en: "App for iOS and Android" } },
  { id: "both", code: "b", label: { es: "Web + Móvil", en: "Web + Mobile" }, hint: { es: "Un producto en los dos frentes", en: "One product on both fronts" } },
]

export const MODULES: {
  id: ModuleId
  code: string
  label: Localized
  hint: Localized
  service: QuoteService
}[] = [
  { id: "login", code: "L", label: { es: "Login y usuarios", en: "Login & users" }, hint: { es: "Cuentas, roles y permisos", en: "Accounts, roles and permissions" }, service: "sistemas" },
  { id: "payments", code: "P", label: { es: "Pagos", en: "Payments" }, hint: { es: "Cobros, facturas y pasarelas", en: "Charges, invoices and gateways" }, service: "sistemas" },
  { id: "dashboard", code: "D", label: { es: "Panel y reportes", en: "Dashboard & reports" }, hint: { es: "Indicadores y exportes", en: "KPIs and exports" }, service: "sistemas" },
  { id: "ai", code: "I", label: { es: "Agente de IA", en: "AI agent" }, hint: { es: "Atiende, responde y automatiza", en: "Answers, assists and automates" }, service: "ia" },
  { id: "api", code: "A", label: { es: "Integraciones y API", en: "Integrations & API" }, hint: { es: "Conecta tus otros sistemas", en: "Connects your other systems" }, service: "sistemas" },
  { id: "notifications", code: "N", label: { es: "Notificaciones", en: "Notifications" }, hint: { es: "Push, correo y WhatsApp", en: "Push, email and WhatsApp" }, service: "sistemas" },
  { id: "maps", code: "M", label: { es: "Mapas y rutas", en: "Maps & routes" }, hint: { es: "Ubicación y seguimiento", en: "Location and tracking" }, service: "sistemas" },
  { id: "inventory", code: "V", label: { es: "Inventario", en: "Inventory" }, hint: { es: "Stock, almacenes y pedidos", en: "Stock, warehouses and orders" }, service: "sistemas" },
  { id: "cloud", code: "C", label: { es: "Nube y escalabilidad", en: "Cloud & scale" }, hint: { es: "Infraestructura que crece contigo", en: "Infrastructure that grows with you" }, service: "cloud" },
]

export type Build = { platform: PlatformId | null; modules: ModuleId[] }

export function encodeBuild(b: Build): string {
  const p = PLATFORMS.find((x) => x.id === b.platform)?.code ?? "x"
  const m = MODULES.filter((x) => b.modules.includes(x.id))
    .map((x) => x.code)
    .join("")
  return `${p}.${m}`
}

export function decodeBuild(code: string | null): Build | null {
  if (!code) return null
  const [p, m = ""] = code.split(".")
  const platform = PLATFORMS.find((x) => x.code === p)?.id ?? null
  if (!platform) return null
  const modules = MODULES.filter((x) => m.includes(x.code)).map((x) => x.id)
  return { platform, modules }
}

export function quoteServices(b: Build): string[] {
  const set = new Set<string>()
  if (b.platform === "web" || b.platform === "both") set.add("web")
  if (b.platform === "mobile" || b.platform === "both") set.add("apps")
  MODULES.forEach((m) => b.modules.includes(m.id) && set.add(m.service))
  return [...set]
}

function joinList(items: string[], lang: Language) {
  if (items.length <= 1) return items.join("")
  const last = items[items.length - 1]
  return `${items.slice(0, -1).join(", ")} ${lang === "es" ? "y" : "and"} ${last}`
}

export function buildSummary(b: Build, lang: Language) {
  const platform = PLATFORMS.find((p) => p.id === b.platform)?.label[lang] ?? ""
  const mods = MODULES.filter((m) => b.modules.includes(m.id)).map((m) => m.label[lang])
  if (lang === "es") {
    return mods.length ? `Armado en el Lab: ${platform} con ${joinList(mods, lang)}.` : `Armado en el Lab: ${platform}.`
  }
  return mods.length ? `Built in the Lab: ${platform} with ${joinList(mods, lang)}.` : `Built in the Lab: ${platform}.`
}

export function quoteHref(b: Build, lang: Language) {
  const params = new URLSearchParams({ servicios: quoteServices(b).join(","), detalle: buildSummary(b, lang) })
  return `/cotizacion?${params.toString()}`
}

// Combinaciones coherentes para "Sorpréndeme": cada una es un producto plausible.
export const SURPRISES: Build[] = [
  { platform: "mobile", modules: ["login", "maps", "payments", "notifications"] },
  { platform: "web", modules: ["login", "payments", "inventory", "dashboard"] },
  { platform: "both", modules: ["login", "ai", "notifications", "dashboard", "api"] },
  { platform: "web", modules: ["dashboard", "api", "cloud", "ai"] },
  { platform: "both", modules: ["login", "payments", "maps", "notifications", "cloud"] },
  { platform: "mobile", modules: ["login", "ai", "payments"] },
]
