"use client"

import { Code, Smartphone, Cloud, Database, Shield, Brain } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    heading: "Nuestros servicios",
    subheading:
      "Servicios especializados que combinan tecnologías modernas con una metodología de entrega disciplinada.",
    services: [
      {
        title: "Desarrollo Web",
        description:
          "Sitios, landings y portales construidos con React, Next.js y TypeScript — optimizados para velocidad, SEO y conversión.",
      },
      {
        title: "Aplicaciones Móviles",
        description:
          "Apps nativas e híbridas con React Native, Flutter y Swift/Kotlin, publicadas en App Store y Google Play.",
      },
      {
        title: "Cloud & DevOps",
        description:
          "Infraestructura cloud-native en AWS, Azure y GCP con microservicios, Kubernetes, CI/CD e infraestructura como código.",
      },
      {
        title: "Sistemas Empresariales",
        description:
          "ERP, CRM y plataformas internas a medida que ordenan operaciones, automatizan procesos y centralizan datos.",
      },
      {
        title: "Ciberseguridad",
        description:
          "Auditorías de seguridad, pentesting, Zero Trust y protección de aplicaciones y APIs contra amenazas comunes.",
      },
      {
        title: "IA & Automatización",
        description:
          "Integración de modelos de IA, chatbots, RAG sobre tu base de conocimiento y automatización de flujos repetitivos.",
      },
    ],
  },
  en: {
    heading: "Our services",
    subheading:
      "Specialized services combining modern technology with a disciplined delivery methodology.",
    services: [
      {
        title: "Web Development",
        description:
          "Websites, landing pages and portals built with React, Next.js and TypeScript — optimized for speed, SEO and conversion.",
      },
      {
        title: "Mobile Applications",
        description:
          "Native and hybrid apps with React Native, Flutter and Swift/Kotlin, published to App Store and Google Play.",
      },
      {
        title: "Cloud & DevOps",
        description:
          "Cloud-native infrastructure on AWS, Azure and GCP with microservices, Kubernetes, CI/CD and infrastructure as code.",
      },
      {
        title: "Enterprise Systems",
        description:
          "Custom ERP, CRM and internal platforms that streamline operations, automate processes and centralize data.",
      },
      {
        title: "Cybersecurity",
        description:
          "Security audits, pentesting, Zero Trust and protection of applications and APIs against common threats.",
      },
      {
        title: "AI & Automation",
        description:
          "AI model integration, chatbots, RAG over your knowledge base and automation of repetitive workflows.",
      },
    ],
  },
}

const icons = [Code, Smartphone, Cloud, Database, Shield, Brain]
const anchors = ["web", "movil", "cloud", "sistemas", "seguridad", "ia"]
const techStacks = [
  ["React", "Next.js", "TypeScript", "Vercel"],
  ["React Native", "Flutter", "Swift", "Kotlin"],
  ["AWS", "Kubernetes", "Docker", "Terraform"],
  ["PostgreSQL", "MongoDB", "Redis", "GraphQL"],
  ["Zero Trust", "OAuth 2.0", "JWT", "Encryption"],
  ["OpenAI", "LangChain", "TensorFlow", "PyTorch"],
]

export default function ServicesSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section id="servicios" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="border-b border-border">
          {t.services.map((service, index) => {
            const Icon = icons[index]
            return (
              <li
                key={service.title}
                id={anchors[index]}
                className="grid scroll-mt-24 gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10 md:py-10"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-7 w-7 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="text-xl font-bold md:text-2xl">{service.title}</h2>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">{service.description}</p>
                <ul className="flex flex-wrap content-start gap-2" aria-label="Stack">
                  {techStacks[index].map((tech) => (
                    <li key={tech} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                      {tech}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
