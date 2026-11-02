"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    heading: "¿Qué necesitas resolver?",
    intro: "Empezamos por el problema de tu negocio, no por la tecnología. Estos son los tres caminos más comunes.",
    groups: [
      {
        need: "Lanzar un producto",
        who: "Para startups y marcas que salen al mercado.",
        services: [
          { title: "Desarrollo web", description: "Sitios y plataformas rápidas, listas para vender.", href: "/servicios#web" },
          { title: "Apps móviles", description: "iOS y Android, publicadas en las tiendas.", href: "/servicios#movil" },
        ],
      },
      {
        need: "Ordenar tu operación",
        who: "Para empresas que hoy viven en hojas de cálculo.",
        services: [
          { title: "Sistemas empresariales", description: "ERP, CRM y herramientas internas a tu medida.", href: "/servicios#sistemas" },
          { title: "Integraciones y APIs", description: "Conectamos tus sistemas, pagos y datos.", href: "/servicios" },
        ],
      },
      {
        need: "Automatizar y crecer",
        who: "Para equipos que quieren hacer más con lo mismo.",
        services: [
          { title: "IA y automatización", description: "Agentes y flujos que resuelven tareas repetitivas.", href: "/servicios#ia" },
          { title: "Cloud y DevOps", description: "Infraestructura que escala sin sorpresas.", href: "/servicios#cloud" },
        ],
      },
    ],
  },
  en: {
    heading: "What do you need to solve?",
    intro: "We start from your business problem, not the technology. These are the three most common paths.",
    groups: [
      {
        need: "Launch a product",
        who: "For startups and brands going to market.",
        services: [
          { title: "Web development", description: "Fast sites and platforms, ready to sell.", href: "/servicios#web" },
          { title: "Mobile apps", description: "iOS and Android, published to the stores.", href: "/servicios#movil" },
        ],
      },
      {
        need: "Organize your operation",
        who: "For companies that live in spreadsheets today.",
        services: [
          { title: "Enterprise systems", description: "ERP, CRM and internal tools built for you.", href: "/servicios#sistemas" },
          { title: "Integrations & APIs", description: "We connect your systems, payments and data.", href: "/servicios" },
        ],
      },
      {
        need: "Automate and grow",
        who: "For teams that want to do more with the same.",
        services: [
          { title: "AI & automation", description: "Agents and workflows that handle repetitive work.", href: "/servicios#ia" },
          { title: "Cloud & DevOps", description: "Infrastructure that scales without surprises.", href: "/servicios#cloud" },
        ],
      },
    ],
  },
}

export default function ServicesGrid() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{t.heading}</h2>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:justify-self-end">{t.intro}</p>
        </div>

        <div className="mt-14 grid border-t border-foreground/80 md:grid-cols-3">
          {t.groups.map((group, g) => (
            <div key={group.need} className={`pt-8 md:px-8 md:pb-2 ${g === 0 ? "md:pl-0" : "md:border-l md:border-border"} ${g === 2 ? "md:pr-0" : ""} ${g > 0 ? "mt-10 md:mt-0" : ""}`}>
              <h3 className="text-2xl font-bold">{group.need}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{group.who}</p>
              <ul className="mt-7 space-y-2">
                {group.services.map((service) => (
                  <li key={service.title}>
                    <Link
                      href={service.href}
                      className="group -mx-3 flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-card hover:shadow-[0_8px_24px_-16px_oklch(0.17_0.025_265/0.35)]"
                    >
                      <span className="flex-1">
                        <span className="block font-semibold">{service.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{service.description}</span>
                      </span>
                      <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
