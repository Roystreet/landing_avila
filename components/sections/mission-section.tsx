"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Compass,
  Telescope,
  Gem,
  Search,
  PenTool,
  Hammer,
  Rocket,
  LineChart,
  ArrowRight,
} from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    eyebrow: "Lo que hacemos y cómo",
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
    processEyebrow: "Nuestro proceso",
    processTitle: "De la idea al producto en 5 etapas",
    processSubtitle: "Un flujo repetible que aplicamos en todos los proyectos, ajustado a la escala de cada cliente.",
    process: [
      {
        title: "Descubrimos",
        description:
          "Mapeamos el problema, los usuarios y las restricciones. Salimos con un alcance, una arquitectura propuesta y un estimado fundamentado.",
      },
      {
        title: "Diseñamos",
        description:
          "Prototipos navegables, flujos de usuario y definición técnica. Alineamos expectativas antes de invertir en desarrollo.",
      },
      {
        title: "Construimos",
        description:
          "Sprints de 2 semanas con demos en vivo. Código revisado por pares, tests automatizados y despliegues continuos en ambiente de staging.",
      },
      {
        title: "Lanzamos",
        description:
          "Puesta en producción con monitoreo, alertas y checklist de rollback. Acompañamos el hypercare de las primeras semanas.",
      },
      {
        title: "Evolucionamos",
        description:
          "Soporte, optimización y nuevas iteraciones según los datos reales de uso. El software no se termina: se mejora.",
      },
    ],
  },
  en: {
    eyebrow: "What we do and how",
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
    processEyebrow: "Our process",
    processTitle: "From idea to product in 5 stages",
    processSubtitle:
      "A repeatable flow we apply to every project, scaled to each client's needs.",
    process: [
      {
        title: "Discover",
        description:
          "We map the problem, users and constraints. We come out with scope, a proposed architecture and a well-founded estimate.",
      },
      {
        title: "Design",
        description:
          "Clickable prototypes, user flows and technical definition. We align expectations before investing in development.",
      },
      {
        title: "Build",
        description:
          "Two-week sprints with live demos. Peer-reviewed code, automated tests and continuous deployments to staging.",
      },
      {
        title: "Launch",
        description:
          "Production rollout with monitoring, alerts and a rollback checklist. We stay with you through the first-weeks hypercare.",
      },
      {
        title: "Evolve",
        description:
          "Support, optimization and new iterations based on real usage data. Software isn't finished — it's improved.",
      },
    ],
  },
}

export default function MissionSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  const pillarIcons = [Compass, Telescope, Gem]
  const processIcons = [Search, PenTool, Hammer, Rocket, LineChart]

  return (
    <section id="mision" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{t.eyebrow}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {t.title} <span className="text-primary">{t.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">{t.intro}</p>
        </div>

        {/* Pillars */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {t.pillars.map((item, index) => {
            const Icon = pillarIcons[index]
            return (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold">{item.eyebrow}</span>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3 leading-snug">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-5 text-sm">{item.description}</p>
                  <ul className="space-y-2 border-t border-border pt-4">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Capabilities strip */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.capabilitiesTitle}</h3>
            <p className="text-muted-foreground">{t.capabilitiesSubtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {t.capabilities.map((cap, i) => (
              <div
                key={i}
                className="px-5 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default"
              >
                <span className="text-sm text-card-foreground font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process timeline */}
        <div>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">{t.processEyebrow}</Badge>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.processTitle}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.processSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {t.process.map((p, i) => {
              const Icon = processIcons[i]
              return (
                <div
                  key={i}
                  className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-card-foreground mb-2">{p.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
