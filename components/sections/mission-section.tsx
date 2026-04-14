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

export default function MissionSection() {
  const pillars = [
    {
      icon: Compass,
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
      icon: Telescope,
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
      icon: Gem,
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
  ]

  const process = [
    {
      step: "01",
      icon: Search,
      title: "Descubrimos",
      description:
        "Mapeamos el problema, los usuarios y las restricciones. Salimos con un alcance, una arquitectura propuesta y un estimado fundamentado.",
    },
    {
      step: "02",
      icon: PenTool,
      title: "Diseñamos",
      description:
        "Prototipos navegables, flujos de usuario y definición técnica. Alineamos expectativas antes de invertir en desarrollo.",
    },
    {
      step: "03",
      icon: Hammer,
      title: "Construimos",
      description:
        "Sprints de 2 semanas con demos en vivo. Código revisado por pares, tests automatizados y despliegues continuos en ambiente de staging.",
    },
    {
      step: "04",
      icon: Rocket,
      title: "Lanzamos",
      description:
        "Puesta en producción con monitoreo, alertas y checklist de rollback. Acompañamos el hypercare de las primeras semanas.",
    },
    {
      step: "05",
      icon: LineChart,
      title: "Evolucionamos",
      description:
        "Soporte, optimización y nuevas iteraciones según los datos reales de uso. El software no se termina: se mejora.",
    },
  ]

  const capabilities = [
    "Sitios web y landing pages",
    "Aplicaciones móviles (iOS / Android)",
    "Sistemas web empresariales (ERP / CRM)",
    "Migración e infraestructura cloud",
    "Agentes de IA y automatización",
    "Integraciones y APIs",
  ]

  return (
    <section id="mision" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Lo que hacemos y cómo</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Ingeniería de software <span className="text-primary">sin humo</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Somos un equipo técnico que convierte objetivos de negocio en productos digitales que funcionan, escalan y se
            mantienen. Sin promesas vacías, sin arquitecturas infladas: solo el software que tu operación necesita.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {pillars.map((item, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
              <CardContent className="p-8 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                    <item.icon className="h-6 w-6 text-primary" />
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
          ))}
        </div>

        {/* Capabilities strip */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">En qué trabajamos</h3>
            <p className="text-muted-foreground">Seis frentes, un mismo estándar de ingeniería</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {capabilities.map((cap, i) => (
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
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Nuestro proceso</Badge>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              De la idea al producto en 5 etapas
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un flujo repetible que aplicamos en todos los proyectos, ajustado a la escala de cada cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {process.map((p, i) => (
              <div
                key={i}
                className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors">
                    {p.step}
                  </span>
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">{p.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
