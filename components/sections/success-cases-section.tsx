"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CASES } from "@/lib/cases"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Stethoscope,
  ShoppingBag,
  Truck,
  Bike,
  Building2,
  Bot,
} from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    heading: "Casos de éxito",
    intro:
      "Proyectos reales entregados a clientes en Venezuela y la región. Algunos nombres de marca están bajo NDA; los resultados son medidos, no marketing. Las fotos son imágenes de referencia de cada sector (Unsplash).",
    resultsLabel: "Resultados medidos",
    open: "Ver caso completo",
    stackLabel: "Stack",
    metricsLabels: {
      projects: "Proyectos entregados",
      clients: "Clientes activos",
      satisfaction: "Satisfacción del cliente",
      uptime: "Uptime promedio en producción",
    },
    projects: [
      {
        title: "Portal y agenda online para clínica dental",
        client: "Clínica odontológica",
        description:
          "Rediseñamos el sitio web y montamos un sistema de reservas en línea con recordatorios automáticos por correo y WhatsApp.",
        results: [
          "+35% reservas online en 3 meses",
          "Reducción del 50% en ausencias",
          "Sitio 100/100 en Lighthouse mobile",
        ],
      },
      {
        title: "Tienda online para marca de moda",
        client: "Retail",
        description:
          "Migración desde una plantilla genérica a un e-commerce propio con checkout optimizado, pasarela local y panel de inventario.",
        results: [
          "+60% conversión en móvil",
          "Tiempo de carga bajó de 4.8s a 1.6s",
          "Panel único para ventas físicas y online",
        ],
      },
      {
        title: "ERP interno para operador logístico",
        client: "Logística",
        description:
          "Reemplazamos hojas de cálculo por un sistema web con control de rutas, facturación y reportes en tiempo real.",
        results: [
          "−40% tiempo en tareas administrativas",
          "Facturación automatizada por ruta",
          "Trazabilidad completa por guía",
        ],
      },
      {
        title: "App móvil para delivery regional",
        client: "Food-tech",
        description:
          "App nativa para clientes y repartidores con pedidos en vivo, tracking por GPS y pagos integrados.",
        results: [
          "+5.000 descargas en el primer trimestre",
          "Tiempo promedio de entrega 28 min",
          "4.7★ de calificación en tienda",
        ],
      },
      {
        title: "Dashboard BI para inmobiliaria",
        client: "Real estate",
        description:
          "Centralizamos datos de CRM, portal web y marketing en un tablero único para que el equipo comercial priorice leads calientes.",
        results: [
          "Decisiones comerciales con data de hoy, no del mes anterior",
          "−30% tiempo de respuesta a prospectos",
          "Pipeline visible para toda la gerencia",
        ],
      },
      {
        title: "Chatbot de atención para hotel boutique",
        client: "Hospitalidad",
        description:
          "Asistente conversacional en WhatsApp que resuelve dudas frecuentes, confirma reservas y escala al equipo humano cuando hace falta.",
        results: [
          "70% de consultas resueltas sin intervención humana",
          "Respuesta 24/7 en español e inglés",
          "Liberó a recepción para atención presencial",
        ],
      },
    ],
  },
  en: {
    heading: "Success stories",
    intro:
      "Real projects delivered to clients in Venezuela and the region. Some brand names are under NDA; the results are measured, not marketing. Photos are reference images of each industry (Unsplash).",
    resultsLabel: "Measured results",
    open: "See full case",
    stackLabel: "Stack",
    metricsLabels: {
      projects: "Projects delivered",
      clients: "Active clients",
      satisfaction: "Client satisfaction",
      uptime: "Average production uptime",
    },
    projects: [
      {
        title: "Website and online booking for a dental clinic",
        client: "Dental clinic",
        description:
          "We redesigned the website and built an online booking system with automated email and WhatsApp reminders.",
        results: [
          "+35% online bookings in 3 months",
          "50% reduction in no-shows",
          "100/100 Lighthouse mobile score",
        ],
      },
      {
        title: "Online store for a fashion brand",
        client: "Retail",
        description:
          "Migration from a generic template to a custom e-commerce with optimized checkout, local payment gateway and inventory panel.",
        results: [
          "+60% mobile conversion",
          "Load time dropped from 4.8s to 1.6s",
          "Single panel for in-store and online sales",
        ],
      },
      {
        title: "Internal ERP for a logistics operator",
        client: "Logistics",
        description:
          "We replaced spreadsheets with a web system that handles route management, billing and real-time reporting.",
        results: [
          "−40% time on admin tasks",
          "Automated billing per route",
          "Full traceability per waybill",
        ],
      },
      {
        title: "Mobile app for regional delivery",
        client: "Food-tech",
        description:
          "Native app for customers and drivers with live orders, GPS tracking and integrated payments.",
        results: [
          "+5,000 downloads in the first quarter",
          "28 min average delivery time",
          "4.7★ app store rating",
        ],
      },
      {
        title: "BI dashboard for a real estate firm",
        client: "Real estate",
        description:
          "We centralized CRM, web portal and marketing data into a single dashboard so the sales team could prioritize hot leads.",
        results: [
          "Business decisions on today's data, not last month's",
          "−30% prospect response time",
          "Pipeline visible to the entire leadership",
        ],
      },
      {
        title: "Customer support chatbot for a boutique hotel",
        client: "Hospitality",
        description:
          "Conversational assistant on WhatsApp that handles FAQs, confirms reservations and escalates to humans when needed.",
        results: [
          "70% of inquiries resolved without human intervention",
          "24/7 response in Spanish and English",
          "Freed up the front desk for in-person guests",
        ],
      },
    ],
  },
}

// Fotos de contexto de Unsplash (ver public/projects/CREDITOS.md); no son de los clientes.
const photos = [
  { src: "/projects/clinica-dental.webp", es: "Consultorio dental moderno", en: "Modern dental office" },
  { src: "/projects/tienda-moda.webp", es: "Percheros con ropa en una tienda", en: "Clothing racks in a store" },
  { src: "/projects/logistica-almacen.webp", es: "Estanterías de almacén con cajas", en: "Warehouse shelving with boxes" },
  { src: "/projects/delivery-moto.webp", es: "Repartidor en scooter de noche", en: "Delivery rider on a scooter at night" },
  { src: "/projects/inmobiliaria-edificio.webp", es: "Edificio residencial con balcones", en: "Residential building with balconies" },
  { src: "/projects/hotel-lobby.webp", es: "Lobby de hotel", en: "Hotel lobby" },
]
const anchors = ["caso-clinica", "caso-ecommerce", "caso-logistica", "caso-delivery", "caso-bi", "caso-chatbot"]
const icons = [Stethoscope, ShoppingBag, Truck, Bike, Building2, Bot]
const techStacks = [
  ["Next.js", "Tailwind", "Supabase", "Resend"],
  ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
  ["React", "Node.js", "PostgreSQL", "Docker"],
  ["React Native", "Node.js", "MongoDB", "Mapbox"],
  ["Next.js", "PostgreSQL", "Metabase", "AWS"],
  ["OpenAI", "Node.js", "WhatsApp API", "Redis"],
]

export default function SuccessCasesSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  const metrics = [
    { number: "30+", label: t.metricsLabels.projects },
    { number: "20+", label: t.metricsLabels.clients },
    { number: "4.9/5", label: t.metricsLabels.satisfaction },
    { number: "99.9%", label: t.metricsLabels.uptime },
  ]

  return (
    <section id="casos" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-lg text-muted-foreground">{t.intro}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {t.projects.map((project, index) => {
            const Icon = icons[index]
            return (
              <Card
                key={index}
                id={anchors[index]}
                className="group relative flex scroll-mt-24 flex-col overflow-hidden rounded-[14px] border-border bg-card pt-0 shadow-none transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_oklch(0.546_0.215_263/0.45)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <Image
                    src={photos[index].src}
                    alt={photos[index][lang]}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-2">
                    <Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                    <div className="min-w-0">
                      <CardTitle className="text-card-foreground text-base leading-snug">
                        <Link href={`/casos-de-exito/${CASES[index].slug}`} className="after:absolute after:inset-0 hover:text-primary">
                          {project.title}
                        </Link>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{project.client}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <CardDescription className="text-muted-foreground mb-5">{project.description}</CardDescription>

                  <div className="mb-5">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">{t.resultsLabel}</h3>
                    <div className="space-y-2">
                      {project.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <span className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {t.open}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-foreground mb-2 text-sm">{t.stackLabel}</h3>
                    <div className="flex flex-wrap gap-2">
                      {techStacks[index].map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="rounded-full border-border bg-background text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <dl className="dark grid grid-cols-2 gap-x-8 gap-y-10 rounded-[20px] bg-background p-8 text-foreground md:grid-cols-4 md:p-10">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col border-t border-border pt-5">
              <dt className="order-2 mt-1.5 text-sm text-muted-foreground">{metric.label}</dt>
              <dd className="order-1 text-4xl font-bold tabular-nums text-accent">{metric.number}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
