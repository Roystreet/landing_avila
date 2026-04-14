"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.heading}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subheading}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.map((service, index) => {
            const Icon = icons[index]
            return (
              <Card
                key={index}
                className="bg-card border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden"
              >
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">{service.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {techStacks[index].map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
