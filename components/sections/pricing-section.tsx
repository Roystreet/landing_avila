"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Globe,
  Smartphone,
  LayoutDashboard,
  Cloud,
  Bot,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

type Tier = {
  name: string
  price: string
  unit?: string
  tagline: string
  features: string[]
  featured?: boolean
}

type Category = {
  id: string
  icon: typeof Globe
  label: string
  description: string
  tiers: [Tier, Tier, Tier]
}

const categories: Category[] = [
  {
    id: "web",
    icon: Globe,
    label: "Desarrollo Web",
    description: "Sitios web, landings y portales corporativos optimizados para conversión y SEO.",
    tiers: [
      {
        name: "Esencial",
        price: "$499",
        tagline: "Presencia digital profesional",
        features: [
          "Landing page de hasta 5 secciones",
          "Diseño responsive y optimización móvil",
          "Formulario de contacto con validación",
          "SEO técnico básico + sitemap",
          "Despliegue en Vercel / Netlify",
          "1 ronda de revisiones",
        ],
      },
      {
        name: "Profesional",
        price: "$1,299",
        tagline: "Sitio corporativo con CMS",
        featured: true,
        features: [
          "Hasta 10 páginas + blog / CMS headless",
          "Integración con Google Analytics 4",
          "Multilenguaje (ES / EN)",
          "Animaciones y micro-interacciones",
          "Optimización Core Web Vitals",
          "3 rondas de revisiones",
          "Capacitación al equipo (1h)",
        ],
      },
      {
        name: "Premium",
        price: "$2,999",
        tagline: "Portal a medida y escalable",
        features: [
          "Arquitectura Next.js + diseño a medida",
          "CMS headless (Sanity / Strapi)",
          "Área de usuarios y autenticación",
          "Integración CRM / HubSpot / Salesforce",
          "A/B testing y analítica avanzada",
          "Revisiones ilimitadas hasta entrega",
          "3 meses de soporte incluido",
        ],
      },
    ],
  },
  {
    id: "apps",
    icon: Smartphone,
    label: "Aplicaciones",
    description: "Apps móviles y de escritorio nativas o híbridas, publicadas en tiendas oficiales.",
    tiers: [
      {
        name: "Esencial",
        price: "$1,499",
        tagline: "MVP móvil funcional",
        features: [
          "App híbrida (React Native / Expo)",
          "Hasta 5 pantallas principales",
          "Autenticación email + social",
          "Backend serverless incluido",
          "Publicación en 1 tienda",
          "Diseño UI/UX base",
        ],
      },
      {
        name: "Profesional",
        price: "$3,999",
        tagline: "App multiplataforma completa",
        featured: true,
        features: [
          "iOS + Android + backend propio",
          "Hasta 15 pantallas y flujos completos",
          "Push notifications + analítica",
          "Pagos integrados (Stripe / local)",
          "Panel de administración web",
          "Publicación en ambas tiendas",
          "2 meses de soporte post-lanzamiento",
        ],
      },
      {
        name: "Premium",
        price: "$7,999",
        tagline: "Producto escalable con módulos",
        features: [
          "Arquitectura modular y escalable",
          "Funcionalidades offline-first",
          "Integraciones con APIs externas",
          "Modo multi-rol y permisos avanzados",
          "Dashboard analítico en tiempo real",
          "CI/CD automatizado + testing",
          "6 meses de soporte + roadmap",
        ],
      },
    ],
  },
  {
    id: "sistemas",
    icon: LayoutDashboard,
    label: "Sistemas Web",
    description: "Plataformas empresariales: ERP, CRM, dashboards internos y herramientas operativas.",
    tiers: [
      {
        name: "Esencial",
        price: "$2,999",
        tagline: "Sistema interno ágil",
        features: [
          "Hasta 4 módulos funcionales",
          "Autenticación con roles básicos",
          "Base de datos PostgreSQL",
          "Dashboard con métricas clave",
          "Exportación de reportes (CSV / PDF)",
          "Despliegue en cloud gestionado",
        ],
      },
      {
        name: "Profesional",
        price: "$7,999",
        tagline: "Plataforma empresarial completa",
        featured: true,
        features: [
          "Hasta 10 módulos personalizados",
          "Permisos granulares por rol",
          "Integraciones (facturación, bancos)",
          "Workflows y notificaciones",
          "API REST documentada",
          "Auditoría y logs de actividad",
          "Capacitación completa al equipo",
        ],
      },
      {
        name: "Premium",
        price: "$14,999",
        tagline: "Sistema crítico a medida",
        features: [
          "Arquitectura de microservicios",
          "Alta disponibilidad (99.9% SLA)",
          "Multi-tenant / multi-empresa",
          "Business Intelligence integrado",
          "Integraciones ERP legacy",
          "Seguridad nivel empresarial",
          "12 meses de soporte + SLA",
        ],
      },
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    label: "Cloud & DevOps",
    description: "Migración, infraestructura como código, monitoreo y optimización de costos en la nube.",
    tiers: [
      {
        name: "Esencial",
        price: "$499",
        unit: "/mes",
        tagline: "Infra gestionada básica",
        features: [
          "Setup inicial AWS / GCP / Azure",
          "1 ambiente (producción)",
          "Monitoreo básico con alertas",
          "Backups automáticos diarios",
          "Reporte mensual de costos",
          "Soporte en horario laboral",
        ],
      },
      {
        name: "Profesional",
        price: "$1,299",
        unit: "/mes",
        tagline: "Infra multi-ambiente",
        featured: true,
        features: [
          "Staging + producción + DR",
          "Infraestructura como código (Terraform)",
          "CI/CD completo con GitHub Actions",
          "Observabilidad (logs + métricas + traces)",
          "Optimización mensual de costos",
          "Migración desde on-premise",
          "Soporte 12/5",
        ],
      },
      {
        name: "Premium",
        price: "$2,999",
        unit: "/mes",
        tagline: "Operación crítica 24/7",
        features: [
          "Arquitectura Kubernetes gestionada",
          "Auto-scaling y balanceo global",
          "Seguridad avanzada + WAF",
          "Compliance (ISO / PCI / HIPAA)",
          "DR con RPO/RTO definidos",
          "On-call 24/7/365",
          "Arquitecto cloud dedicado",
        ],
      },
    ],
  },
  {
    id: "ia",
    icon: Bot,
    label: "Agentes de IA",
    description: "Chatbots, copilotos y automatizaciones inteligentes integradas a tu operación.",
    tiers: [
      {
        name: "Esencial",
        price: "$999",
        tagline: "Chatbot para atención al cliente",
        features: [
          "Agente entrenado con tus documentos",
          "Integración en web o WhatsApp",
          "Hasta 1,000 conversaciones/mes",
          "Panel de administración",
          "Handoff a humano configurable",
          "1 mes de afinamiento incluido",
        ],
      },
      {
        name: "Profesional",
        price: "$2,499",
        tagline: "Copiloto interno para equipos",
        featured: true,
        features: [
          "Agente conectado a tus sistemas",
          "RAG sobre base de conocimiento privada",
          "Automatización de flujos repetitivos",
          "Integraciones (Slack, email, CRM)",
          "Hasta 5,000 conversaciones/mes",
          "Métricas de uso y calidad",
          "3 meses de soporte y ajustes",
        ],
      },
      {
        name: "Premium",
        price: "$5,999",
        tagline: "Plataforma multi-agente a medida",
        features: [
          "Varios agentes especializados",
          "Orquestación y toma de decisiones",
          "Fine-tuning con datos propios",
          "Evaluación continua y guardrails",
          "Despliegue en tu cloud privado",
          "Integraciones a la medida",
          "Soporte dedicado + roadmap",
        ],
      },
    ],
  },
]

export default function PricingSection() {
  const [active, setActive] = useState<string>(categories[0].id)
  const current = categories.find((c) => c.id === active) ?? categories[0]

  return (
    <section id="precios" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Planes y precios</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Precios claros para cada <span className="text-primary">tipo de proyecto</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Elige el servicio que necesitas y el plan que mejor se ajusta. Todos incluyen código propiedad del cliente,
            documentación y soporte post-entrega. ¿Necesitas algo a medida? Pide una cotización.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = cat.id === active
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Category description */}
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">{current.description}</p>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {current.tiers.map((tier, index) => (
            <Card
              key={`${current.id}-${tier.name}`}
              className={`relative transition-all duration-500 hover:scale-[1.02] ${
                tier.featured
                  ? "bg-gradient-to-b from-[#1F1810] to-card border-primary/50 shadow-2xl shadow-primary/10 md:-translate-y-2"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground border-primary px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Más popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">{tier.tagline}</p>
                </div>

                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">desde</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${tier.featured ? "text-primary" : "text-card-foreground"}`}
                    >
                      {tier.price}
                    </span>
                    {tier.unit && <span className="text-muted-foreground text-sm">{tier.unit}</span>}
                    {!tier.unit && <span className="text-muted-foreground text-sm">USD</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tier.featured ? "bg-primary/20" : "bg-primary/10"
                        }`}
                      >
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="#cotizacion">
                  <Button
                    className={`w-full group ${
                      tier.featured
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-card-foreground/5 hover:bg-primary hover:text-primary-foreground text-card-foreground border border-border"
                    } transition-all duration-300`}
                  >
                    Solicitar este plan
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom CTA */}
        <div className="mt-16 max-w-3xl mx-auto text-center p-8 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            ¿Tu proyecto no encaja en ningún plan?
          </h3>
          <p className="text-muted-foreground mb-6">
            Algunos proyectos requieren un alcance a medida. Cuéntanos qué necesitas y te armamos una propuesta
            específica con tiempos, equipo y presupuesto detallados.
          </p>
          <Link href="#cotizacion">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
            >
              Pedir cotización personalizada
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
