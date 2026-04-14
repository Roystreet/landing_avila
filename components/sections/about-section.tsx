import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, Lightbulb, CheckCircle, Star, Award, Code, Globe } from "lucide-react"

export default function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: "Equipo de élite certificado",
      description:
        "Desarrolladores senior con certificaciones en tecnologías de vanguardia y experiencia en proyectos Fortune 500",
    },
    {
      icon: Zap,
      title: "Metodologías ágiles avanzadas",
      description: "DevOps, CI/CD, testing automatizado y entregas continuas que garantizan calidad y velocidad",
    },
    {
      icon: Shield,
      title: "Soporte técnico 24/7/365",
      description: "Monitoreo proactivo, alertas inteligentes y respuesta inmediata ante cualquier incidencia",
    },
    {
      icon: Lightbulb,
      title: "Innovación constante",
      description:
        "Investigación continua en IA, blockchain, IoT y tecnologías emergentes para mantener ventaja competitiva",
    },
  ]

  const stats = [
    { number: "150+", label: "Proyectos Completados", icon: CheckCircle },
    { number: "99.8%", label: "Satisfacción Cliente", icon: Star },
    { number: "8+", label: "Años Experiencia", icon: Award },
    { number: "24/7", label: "Soporte Técnico", icon: Shield },
    { number: "50+", label: "Tecnologías Dominadas", icon: Code },
    { number: "15+", label: "Industrias Impactadas", icon: Globe },
  ]

  const testimonials = [
    {
      name: "María González",
      company: "CEO, TechStart Unicorn",
      content:
        "Avila System no solo transformó nuestro proceso de ventas, sino que revolucionó completamente nuestra industria. Su nivel técnico es simplemente extraordinario.",
      rating: 5,
      avatar: "MG",
      result: "+500% crecimiento",
    },
    {
      name: "Carlos Rodríguez",
      company: "CTO, Innovacorp Fortune 500",
      content:
        "La migración a cloud que realizaron superó todas nuestras expectativas. Ahora procesamos 10x más datos con 50% menos costos. Genios absolutos.",
      rating: 5,
      avatar: "CR",
      result: "10x performance",
    },
    {
      name: "Ana Martínez",
      company: "Fundadora, EcoSolutions Global",
      content:
        "Desarrollaron nuestra app móvil en tiempo récord con calidad de código excepcional. 2M+ descargas en 6 meses. Simplemente los mejores.",
      rating: 5,
      avatar: "AM",
      result: "2M+ usuarios",
    },
  ]

  return (
    <>
      {/* About Section */}
      <section id="nosotros" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">¿Por qué somos diferentes?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                No somos una consultora más. Somos arquitectos de la transformación digital, ingenieros de soluciones
                imposibles y visionarios que convierten ideas audaces en realidades tecnológicas que cambian el mundo.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-muted rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Testimonios de Clientes Rockstar</h2>
            <p className="text-lg text-muted-foreground">La confianza de líderes visionarios es nuestro mayor logro</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {testimonial.result}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
