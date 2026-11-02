"use client"

import { useState, type ComponentType } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage, type Language } from "@/components/providers/language-provider"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { AgendaScene, CheckoutScene, RoutesScene } from "./scenes"

// Resultados tomados de los casos publicados en /casos-de-exito (con su ancla).
const copy = {
  es: {
    heading: "Resultados medidos, no promesas",
    intro: "Tres proyectos reales. Algunos clientes están bajo NDA; las cifras son las que medimos.",
    caption: "Las interfaces son ilustrativas: recrean lo que construimos sin exponer datos de clientes. Fotos de contexto: Unsplash.",
    all: "Ver todos los casos",
    open: "Ver el caso",
    projects: [
      { sector: "Clínica dental", description: "Sitio y agenda online con recordatorios automáticos por correo y WhatsApp.", metric: "+35%", metricLabel: "reservas online en 3 meses" },
      { sector: "Operador logístico", description: "Sistema web con control de rutas, facturación y reportes en tiempo real.", metric: "−40%", metricLabel: "tiempo en tareas administrativas" },
      { sector: "Marca de moda", description: "Tienda propia con checkout optimizado y pasarela de pago local.", metric: "+60%", metricLabel: "conversión en móvil" },
    ],
  },
  en: {
    heading: "Measured results, not promises",
    intro: "Three real projects. Some clients are under NDA; the numbers are the ones we measured.",
    caption: "Interfaces are illustrative: they recreate what we built without exposing client data. Context photos: Unsplash.",
    all: "See all cases",
    open: "See the case",
    projects: [
      { sector: "Dental clinic", description: "Website and online booking with automated email and WhatsApp reminders.", metric: "+35%", metricLabel: "online bookings in 3 months" },
      { sector: "Logistics operator", description: "Web system with route control, invoicing and real-time reports.", metric: "−40%", metricLabel: "time on admin tasks" },
      { sector: "Fashion brand", description: "Own store with an optimized checkout and local payment gateway.", metric: "+60%", metricLabel: "mobile conversion" },
    ],
  },
}

type Scene = ComponentType<{ play?: boolean; lang: Language; className?: string }>

// Fotos de contexto (Unsplash, ver public/projects/CREDITOS.md); no son de los clientes.
const cases: { anchor: string; Scene: Scene; photo: string; photoAlt: { es: string; en: string }; sceneClass: string; stageClass?: string; scrim?: string }[] = [
  {
    anchor: "clinica-dental",
    Scene: AgendaScene,
    photo: "/projects/clinica-dental.webp",
    photoAlt: { es: "Consultorio dental moderno con sillón y equipos", en: "Modern dental office with chair and equipment" },
    sceneClass: "w-full max-w-[420px]",
  },
  {
    anchor: "erp-logistica",
    Scene: RoutesScene,
    photo: "/projects/logistica-almacen.webp",
    photoAlt: { es: "Estanterías de almacén con cajas en paletas", en: "Warehouse shelving with boxes on pallets" },
    sceneClass: "w-[78%] max-w-[260px]",
    stageClass: "items-end justify-end sm:p-5",
    scrim: "bg-[linear-gradient(200deg,oklch(0.17_0.025_265/0)_30%,oklch(0.17_0.025_265/0.55)_100%)]",
  },
  {
    anchor: "tienda-moda",
    Scene: CheckoutScene,
    photo: "/projects/tienda-moda.webp",
    photoAlt: { es: "Percheros con ropa en una tienda", en: "Clothing racks in a store" },
    sceneClass: "!w-[168px]",
  },
]

export default function Projects() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight md:text-5xl">{t.heading}</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{t.intro}</p>
          </div>
          <Link href="/casos-de-exito" className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-primary md:self-auto">
            {t.all}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-5 lg:grid-cols-2 lg:grid-rows-2">
          {t.projects.map((project, i) => (
            <li key={project.sector} className={i === 0 ? "lg:row-span-2" : undefined}>
              <CaseCard {...cases[i]} featured={i === 0} lang={lang} project={project} open={t.open} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t.caption}</p>
      </div>
    </section>
  )
}

function CaseCard({
  anchor,
  Scene,
  photo,
  photoAlt,
  sceneClass,
  stageClass,
  scrim,
  featured,
  lang,
  project,
  open,
}: (typeof cases)[number] & {
  featured: boolean
  lang: Language
  project: (typeof copy)["es"]["projects"][number]
  open: string
}) {
  const { ref, inView } = useInView<HTMLAnchorElement>()
  const [replay, setReplay] = useState(0)

  return (
    <Link
      ref={ref}
      href={`/casos-de-exito/${anchor}`}
      onPointerEnter={() => inView && setReplay((n) => n + 1)}
      className={cn(
        "group flex h-full overflow-hidden rounded-[14px] border border-border bg-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_oklch(0.546_0.215_263/0.45)]",
        featured ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-[oklch(0.17_0.025_265)] p-6",
          stageClass,
          featured ? "min-h-[340px] flex-1 md:p-10" : "min-h-[240px] sm:w-[52%] sm:shrink-0",
        )}
      >
        <Image
          src={photo}
          alt={photoAlt[lang]}
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 52vw, 100vw"}
          className="object-cover object-[30%_40%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span aria-hidden="true" className={cn("absolute inset-0", scrim ?? "bg-[linear-gradient(180deg,oklch(0.17_0.025_265/0.35)_0%,oklch(0.17_0.025_265/0.6)_100%)]")} />
        <Scene key={replay} play={inView} lang={lang} className={cn("relative", sceneClass)} />
      </div>
      <div className={cn("flex flex-col p-6", featured ? "md:p-8" : "flex-1")}>
        <p className={cn("font-bold leading-none tabular-nums text-primary", featured ? "text-6xl" : "text-5xl")}>{project.metric}</p>
        <p className="mt-2 text-sm font-semibold">{project.metricLabel}</p>
        <p className="mt-5 text-sm font-semibold text-muted-foreground">{project.sector}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
          {open}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
