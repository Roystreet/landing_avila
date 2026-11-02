"use client"

import { useState } from "react"
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
import { useLanguage } from "@/components/providers/language-provider"

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

const copy = {
  es: {
    badge: "Planes y precios",
    title: "Precios claros para cada",
    titleHighlight: "tipo de proyecto",
    intro:
      "Elige el servicio que necesitas y el plan que mejor se ajusta. Todos incluyen código propiedad del cliente, documentación y soporte post-entrega. ¿Necesitas algo a medida? Pide una cotización.",
    fromLabel: "desde",
    popular: "Más popular",
    requestPlan: "Solicitar este plan",
    customTitle: "¿Tu proyecto no encaja en ningún plan?",
    customDesc:
      "Algunos proyectos requieren un alcance a medida. Cuéntanos qué necesitas y te armamos una propuesta específica con tiempos, equipo y presupuesto detallados.",
    customCta: "Pedir cotización personalizada",
    categories: [
      {
        id: "web",
        icon: Globe,
        label: "Desarrollo Web",
        description:
          "Sitios web, landings y portales corporativos optimizados para conversión y SEO.",
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
        description:
          "Apps móviles y de escritorio nativas o híbridas, publicadas en tiendas oficiales.",
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
        description:
          "Plataformas empresariales: ERP, CRM, dashboards internos y herramientas operativas.",
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
        description:
          "Migración, infraestructura como código, monitoreo y optimización de costos en la nube.",
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
        description:
          "Chatbots, copilotos y automatizaciones inteligentes integradas a tu operación.",
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
    ] as Category[],
  },
  en: {
    badge: "Plans and pricing",
    title: "Clear pricing for every",
    titleHighlight: "project type",
    intro:
      "Pick the service you need and the plan that fits best. All plans include client-owned code, documentation and post-launch support. Need something custom? Request a quote.",
    fromLabel: "from",
    popular: "Most popular",
    requestPlan: "Request this plan",
    customTitle: "Your project doesn't fit any of these plans?",
    customDesc:
      "Some projects need a custom scope. Tell us what you need and we'll put together a specific proposal with timeline, team and detailed budget.",
    customCta: "Request a custom quote",
    categories: [
      {
        id: "web",
        icon: Globe,
        label: "Web Development",
        description: "Websites, landing pages and corporate portals optimized for conversion and SEO.",
        tiers: [
          {
            name: "Essential",
            price: "$499",
            tagline: "Professional digital presence",
            features: [
              "Landing page with up to 5 sections",
              "Responsive design and mobile optimization",
              "Contact form with validation",
              "Basic technical SEO + sitemap",
              "Deployment on Vercel / Netlify",
              "1 round of revisions",
            ],
          },
          {
            name: "Professional",
            price: "$1,299",
            tagline: "Corporate website with CMS",
            featured: true,
            features: [
              "Up to 10 pages + blog / headless CMS",
              "Google Analytics 4 integration",
              "Multilanguage (ES / EN)",
              "Animations and micro-interactions",
              "Core Web Vitals optimization",
              "3 rounds of revisions",
              "Team training (1h)",
            ],
          },
          {
            name: "Premium",
            price: "$2,999",
            tagline: "Custom-built, scalable portal",
            features: [
              "Next.js architecture + custom design",
              "Headless CMS (Sanity / Strapi)",
              "User area and authentication",
              "CRM integration (HubSpot / Salesforce)",
              "A/B testing and advanced analytics",
              "Unlimited revisions until delivery",
              "3 months of support included",
            ],
          },
        ],
      },
      {
        id: "apps",
        icon: Smartphone,
        label: "Applications",
        description: "Native and hybrid mobile and desktop apps, published to official stores.",
        tiers: [
          {
            name: "Essential",
            price: "$1,499",
            tagline: "Functional mobile MVP",
            features: [
              "Hybrid app (React Native / Expo)",
              "Up to 5 main screens",
              "Email + social authentication",
              "Serverless backend included",
              "Publishing on 1 store",
              "Base UI/UX design",
            ],
          },
          {
            name: "Professional",
            price: "$3,999",
            tagline: "Complete cross-platform app",
            featured: true,
            features: [
              "iOS + Android + dedicated backend",
              "Up to 15 screens and complete flows",
              "Push notifications + analytics",
              "Integrated payments (Stripe / local)",
              "Web admin panel",
              "Publishing on both stores",
              "2 months of post-launch support",
            ],
          },
          {
            name: "Premium",
            price: "$7,999",
            tagline: "Scalable product with modules",
            features: [
              "Modular and scalable architecture",
              "Offline-first functionality",
              "External API integrations",
              "Multi-role mode and advanced permissions",
              "Real-time analytics dashboard",
              "Automated CI/CD + testing",
              "6 months of support + roadmap",
            ],
          },
        ],
      },
      {
        id: "sistemas",
        icon: LayoutDashboard,
        label: "Web Systems",
        description:
          "Enterprise platforms: ERP, CRM, internal dashboards and operational tools.",
        tiers: [
          {
            name: "Essential",
            price: "$2,999",
            tagline: "Agile internal system",
            features: [
              "Up to 4 functional modules",
              "Authentication with basic roles",
              "PostgreSQL database",
              "Dashboard with key metrics",
              "Report export (CSV / PDF)",
              "Managed cloud deployment",
            ],
          },
          {
            name: "Professional",
            price: "$7,999",
            tagline: "Complete enterprise platform",
            featured: true,
            features: [
              "Up to 10 custom modules",
              "Granular role-based permissions",
              "Integrations (billing, banks)",
              "Workflows and notifications",
              "Documented REST API",
              "Audit logs and activity tracking",
              "Full team training",
            ],
          },
          {
            name: "Premium",
            price: "$14,999",
            tagline: "Custom mission-critical system",
            features: [
              "Microservices architecture",
              "High availability (99.9% SLA)",
              "Multi-tenant / multi-company",
              "Integrated Business Intelligence",
              "Legacy ERP integrations",
              "Enterprise-grade security",
              "12 months of support + SLA",
            ],
          },
        ],
      },
      {
        id: "cloud",
        icon: Cloud,
        label: "Cloud & DevOps",
        description:
          "Migration, infrastructure as code, monitoring and cost optimization in the cloud.",
        tiers: [
          {
            name: "Essential",
            price: "$499",
            unit: "/mo",
            tagline: "Basic managed infrastructure",
            features: [
              "Initial setup on AWS / GCP / Azure",
              "1 environment (production)",
              "Basic monitoring with alerts",
              "Automated daily backups",
              "Monthly cost report",
              "Business-hours support",
            ],
          },
          {
            name: "Professional",
            price: "$1,299",
            unit: "/mo",
            tagline: "Multi-environment infrastructure",
            featured: true,
            features: [
              "Staging + production + DR",
              "Infrastructure as code (Terraform)",
              "Full CI/CD with GitHub Actions",
              "Observability (logs + metrics + traces)",
              "Monthly cost optimization",
              "On-premise migration",
              "12/5 support",
            ],
          },
          {
            name: "Premium",
            price: "$2,999",
            unit: "/mo",
            tagline: "24/7 critical operations",
            features: [
              "Managed Kubernetes architecture",
              "Auto-scaling and global balancing",
              "Advanced security + WAF",
              "Compliance (ISO / PCI / HIPAA)",
              "DR with defined RPO/RTO",
              "On-call 24/7/365",
              "Dedicated cloud architect",
            ],
          },
        ],
      },
      {
        id: "ia",
        icon: Bot,
        label: "AI Agents",
        description:
          "Chatbots, copilots and intelligent automations integrated into your operation.",
        tiers: [
          {
            name: "Essential",
            price: "$999",
            tagline: "Customer support chatbot",
            features: [
              "Agent trained on your documents",
              "Web or WhatsApp integration",
              "Up to 1,000 conversations/month",
              "Admin panel",
              "Configurable human handoff",
              "1 month of fine-tuning included",
            ],
          },
          {
            name: "Professional",
            price: "$2,499",
            tagline: "Internal copilot for teams",
            featured: true,
            features: [
              "Agent connected to your systems",
              "RAG over private knowledge base",
              "Automation of repetitive workflows",
              "Integrations (Slack, email, CRM)",
              "Up to 5,000 conversations/month",
              "Usage and quality metrics",
              "3 months of support and adjustments",
            ],
          },
          {
            name: "Premium",
            price: "$5,999",
            tagline: "Custom multi-agent platform",
            features: [
              "Multiple specialized agents",
              "Orchestration and decision making",
              "Fine-tuning with proprietary data",
              "Continuous evaluation and guardrails",
              "Deployment in your private cloud",
              "Custom integrations",
              "Dedicated support + roadmap",
            ],
          },
        ],
      },
    ] as Category[],
  },
}

export default function PricingSection() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [active, setActive] = useState<string>(t.categories[0].id)
  const current = t.categories.find((c) => c.id === active) ?? t.categories[0]

  return (
    <section id="precios" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">
            {t.title} {t.titleHighlight}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.intro}</p>
        </div>

        <div role="tablist" aria-label={t.title} className="mt-12 flex flex-wrap gap-2">
          {t.categories.map((cat) => {
            const isActive = cat.id === active
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <cat.icon className="h-4 w-4" aria-hidden="true" />
                {cat.label}
              </button>
            )
          })}
        </div>
        <p className="mt-5 max-w-2xl text-muted-foreground">{current.description}</p>

        <div role="tabpanel" className="mt-10 grid gap-5 md:grid-cols-3">
          {current.tiers.map((tier) => (
            <div
              key={`${current.id}-${tier.name}`}
              className={`flex flex-col rounded-[14px] border p-7 md:p-8 ${
                tier.featured
                  ? "dark border-transparent bg-background text-foreground shadow-[0_24px_48px_-24px_oklch(0.17_0.025_265/0.6)]"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                {tier.featured && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {t.popular}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>

              <div className="mt-6 border-b border-border pb-6">
                <p className="text-xs text-muted-foreground">{t.fromLabel}</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className={`text-4xl font-bold tabular-nums ${tier.featured ? "text-accent" : ""}`}>{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.unit ?? "USD"}</span>
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-accent" : "text-primary"}`} aria-hidden="true" />
                    <span className={tier.featured ? "" : "text-muted-foreground"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#cotizacion"
                className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                  tier.featured
                    ? "mt-8 bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                    : "mt-8 border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {t.requestPlan}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">{t.customTitle}</h3>
            <p className="mt-2 max-w-xl text-muted-foreground">{t.customDesc}</p>
          </div>
          <Link
            href="#cotizacion"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] md:self-auto"
          >
            {t.customCta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
