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
  Briefcase,
  Users,
  Star,
  ShieldCheck,
} from "lucide-react"

export default function SuccessCasesSection() {
  const projects = [
    {
      title: "Portal y agenda online para clínica dental",
      client: "Clínica odontológica — Caracas",
      description:
        "Rediseñamos el sitio web y montamos un sistema de reservas en línea con recordatorios automáticos por correo y WhatsApp.",
      results: [
        "+35% reservas online en 3 meses",
        "Reducción del 50% en ausencias",
        "Sitio 100/100 en Lighthouse mobile",
      ],
      tech: ["Next.js", "Tailwind", "Supabase", "Resend"],
      icon: Stethoscope,
    },
    {
      title: "Tienda online para marca de moda",
      client: "Retail — Valencia, VE",
      description:
        "Migración desde una plantilla genérica a un e-commerce propio con checkout optimizado, pasarela local y panel de inventario.",
      results: [
        "+60% conversión en móvil",
        "Tiempo de carga bajó de 4.8s a 1.6s",
        "Panel único para ventas físicas y online",
      ],
      tech: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
      icon: ShoppingBag,
    },
    {
      title: "ERP interno para operador logístico",
      client: "Logística — Maracaibo",
      description:
        "Reemplazamos hojas de cálculo por un sistema web con control de rutas, facturación y reportes en tiempo real.",
      results: [
        "−40% tiempo en tareas administrativas",
        "Facturación automatizada por ruta",
        "Trazabilidad completa por guía",
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Docker"],
      icon: Truck,
    },
    {
      title: "App móvil para delivery regional",
      client: "Food-tech — Mérida",
      description:
        "App nativa para clientes y repartidores con pedidos en vivo, tracking por GPS y pagos integrados.",
      results: [
        "+5.000 descargas en el primer trimestre",
        "Tiempo promedio de entrega 28 min",
        "4.7★ de calificación en tienda",
      ],
      tech: ["React Native", "Node.js", "MongoDB", "Mapbox"],
      icon: Bike,
    },
    {
      title: "Dashboard BI para inmobiliaria",
      client: "Real estate — Caracas",
      description:
        "Centralizamos datos de CRM, portal web y marketing en un tablero único para que el equipo comercial priorice leads calientes.",
      results: [
        "Decisiones comerciales con data de hoy, no del mes anterior",
        "−30% tiempo de respuesta a prospectos",
        "Pipeline visible para toda la gerencia",
      ],
      tech: ["Next.js", "PostgreSQL", "Metabase", "AWS"],
      icon: Building2,
    },
    {
      title: "Chatbot de atención para hotel boutique",
      client: "Hospitalidad — Margarita",
      description:
        "Asistente conversacional en WhatsApp que resuelve dudas frecuentes, confirma reservas y escala al equipo humano cuando hace falta.",
      results: [
        "70% de consultas resueltas sin intervención humana",
        "Respuesta 24/7 en español e inglés",
        "Liberó a recepción para atención presencial",
      ],
      tech: ["OpenAI", "Node.js", "WhatsApp API", "Redis"],
      icon: Bot,
    },
  ]

  const metrics = [
    { number: "30+", label: "Proyectos entregados", icon: Briefcase },
    { number: "20+", label: "Clientes activos", icon: Users },
    { number: "4.9/5", label: "Satisfacción del cliente", icon: Star },
    { number: "99.9%", label: "Uptime promedio en producción", icon: ShieldCheck },
  ]

  return (
    <section id="casos" className="py-20 bg-gradient-to-br from-muted/50 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Casos de éxito</h2>
          <p className="text-lg text-muted-foreground">
            Proyectos reales entregados a clientes en Venezuela y la región. Nombres de marca bajo NDA en algunos casos;
            los resultados son medidos, no marketing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <project.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-card-foreground text-base leading-snug">{project.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{project.client}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <CardDescription className="text-muted-foreground mb-5">{project.description}</CardDescription>

                <div className="mb-5">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Resultados medidos</h4>
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
                  <h4 className="font-semibold text-foreground mb-2 text-sm">Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs border-primary/30 text-primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-6 bg-background rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110">
                <metric.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{metric.number}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
