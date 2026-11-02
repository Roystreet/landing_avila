"use client"

import { ArrowRight, Compass, Gem, Telescope } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    title: "Ingeniería de software",
    titleHighlight: "sin humo",
    intro:
      "Somos un equipo técnico que convierte objetivos de negocio en productos digitales que funcionan, escalan y se mantienen. Sin promesas vacías, sin arquitecturas infladas: solo el software que tu operación necesita.",
    pillars: [
      {
        eyebrow: "Misión",
        title: "Construir software que resuelve problemas reales",
        description:
          "Acompañamos a empresas en Venezuela y LATAM a diseñar, desarrollar y operar productos digitales — desde sitios web y aplicaciones móviles hasta sistemas empresariales, infraestructura cloud y agentes de IA — combinando ingeniería sólida con una entrega disciplinada.",
        highlights: [
          "Discovery técnico antes de escribir una línea",
          "Entregas incrementales cada 2 semanas",
          "Código propiedad del cliente, sin candados",
        ],
      },
      {
        eyebrow: "Visión",
        title: "Ser el socio técnico al que vuelves",
        description:
          "Queremos ser la consultora que nuestros clientes recomiendan no por marketing, sino porque el software que entregamos sigue funcionando, sigue creciendo y sigue generando valor años después del lanzamiento.",
        highlights: [
          "Relaciones medidas en años, no en proyectos",
          "Transferencia de conocimiento al equipo interno",
          "Documentación y soporte post-entrega",
        ],
      },
      {
        eyebrow: "Valores",
        title: "Transparencia, oficio y compromiso",
        description:
          "Precios claros, alcances por escrito, comunicación directa. No prometemos magia: prometemos criterio técnico, fechas realistas y un equipo que se hace responsable de lo que construye.",
        highlights: [
          "Presupuesto fijo o por hitos, tú decides",
          "Tests automatizados y revisiones de código",
          "Un punto de contacto claro durante todo el proyecto",
        ],
      },
    ],
    capabilitiesTitle: "En qué trabajamos",
    capabilitiesSubtitle: "Seis frentes, un mismo estándar de ingeniería",
    capabilities: [
      "Sitios web y landing pages",
      "Aplicaciones móviles (iOS / Android)",
      "Sistemas web empresariales (ERP / CRM)",
      "Migración e infraestructura cloud",
      "Agentes de IA y automatización",
      "Integraciones y APIs",
    ],
  },
  en: {
    title: "Software engineering",
    titleHighlight: "without fluff",
    intro:
      "We are a technical team that turns business goals into digital products that work, scale and keep running. No empty promises, no bloated architectures — just the software your operation actually needs.",
    pillars: [
      {
        eyebrow: "Mission",
        title: "Build software that solves real problems",
        description:
          "We help companies in Venezuela and across LATAM design, build and operate digital products — from websites and mobile apps to enterprise systems, cloud infrastructure and AI agents — combining solid engineering with disciplined delivery.",
        highlights: [
          "Technical discovery before writing a single line",
          "Incremental deliveries every 2 weeks",
          "Client-owned code — no lock-in",
        ],
      },
      {
        eyebrow: "Vision",
        title: "Be the technical partner you come back to",
        description:
          "We want to be the consultancy our clients recommend not because of marketing, but because the software we ship keeps working, keeps growing and keeps generating value years after launch.",
        highlights: [
          "Relationships measured in years, not projects",
          "Knowledge transfer to your internal team",
          "Documentation and post-launch support",
        ],
      },
      {
        eyebrow: "Values",
        title: "Transparency, craft and commitment",
        description:
          "Clear pricing, written scope, direct communication. We don't promise magic — we promise technical judgment, realistic deadlines and a team that owns what it builds.",
        highlights: [
          "Fixed price or milestone-based — you choose",
          "Automated tests and peer code reviews",
          "A single point of contact throughout the project",
        ],
      },
    ],
    capabilitiesTitle: "What we work on",
    capabilitiesSubtitle: "Six focus areas, one engineering standard",
    capabilities: [
      "Websites and landing pages",
      "Mobile applications (iOS / Android)",
      "Enterprise web systems (ERP / CRM)",
      "Cloud migration and infrastructure",
      "AI agents and automation",
      "Integrations and APIs",
    ],
  },
}

export default function MissionSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  const pillarIcons = [Compass, Telescope, Gem]

  return (
    <section id="mision" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">
            {t.title} {t.titleHighlight}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.intro}</p>
        </div>

        <div className="mt-14 grid border-t border-foreground/80 lg:grid-cols-3">
          {t.pillars.map((item, index) => {
            const Icon = pillarIcons[index]
            return (
              <div
                key={item.eyebrow}
                className={`pt-8 lg:px-8 lg:pb-2 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-border"} ${index === 2 ? "lg:pr-0" : ""} ${index > 0 ? "mt-10 lg:mt-0" : ""}`}
              >
                <h3 className="flex items-center gap-3 text-2xl font-bold">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  {item.eyebrow}
                </h3>
                <p className="mt-4 text-lg font-semibold leading-snug">{item.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-20 grid gap-6 border-t border-border pt-12 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t.capabilitiesTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.capabilitiesSubtitle}</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {t.capabilities.map((cap) => (
              <li key={cap} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
