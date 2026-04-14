"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, Lightbulb, CheckCircle, Star, Award, Code, Globe } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    heading: "¿Por qué Avila System?",
    intro:
      "No prometemos revoluciones. Somos un equipo técnico enfocado en entregar software que funciona, mantener buena documentación y acompañar a nuestros clientes más allá del lanzamiento.",
    features: [
      {
        title: "Equipo senior con experiencia real",
        description:
          "Desarrolladores con años construyendo productos para empresas en Venezuela y la región, no un catálogo de buzzwords.",
      },
      {
        title: "Metodología ágil aplicada",
        description:
          "Sprints cortos, demos frecuentes, CI/CD y tests automatizados. Avanzamos con visibilidad, sin sorpresas al final.",
      },
      {
        title: "Soporte post-lanzamiento",
        description:
          "Monitoreo, alertas y atención responsiva. Tu producto sigue vivo después del deploy y nosotros también.",
      },
      {
        title: "Mejora continua",
        description:
          "Iteramos con base en datos reales de uso y feedback de usuarios. El software bueno se refina con el tiempo.",
      },
    ],
    stats: [
      { number: "30+", label: "Proyectos entregados" },
      { number: "4.9/5", label: "Satisfacción cliente" },
      { number: "5+", label: "Años de experiencia" },
      { number: "99.9%", label: "Uptime en producción" },
      { number: "15+", label: "Tecnologías en uso" },
      { number: "6", label: "Industrias atendidas" },
    ],
    testimonialsHeading: "Lo que dicen nuestros clientes",
    testimonialsSubheading:
      "Comentarios anonimizados de proyectos reales. Publicamos logos con autorización previa.",
    testimonials: [
      {
        name: "Gerente de operaciones",
        company: "Operador logístico",
        content:
          "Pasamos de Excel a un sistema que todos usan a diario. La implementación fue gradual y el equipo se adaptó sin fricción.",
        result: "−40% tiempo admin",
      },
      {
        name: "Fundadora",
        company: "Marca de moda D2C",
        content:
          "Entendieron nuestro negocio antes de proponer tecnología. El checkout nuevo nos dobló la conversión en móvil.",
        result: "+60% conversión",
      },
      {
        name: "Dueño",
        company: "Clínica odontológica",
        content:
          "Los recordatorios automáticos redujeron drásticamente las ausencias. La inversión se pagó sola en pocos meses.",
        result: "−50% ausencias",
      },
    ],
  },
  en: {
    heading: "Why Avila System?",
    intro:
      "We don't promise revolutions. We're a technical team focused on delivering software that works, keeping good documentation and supporting our clients beyond launch.",
    features: [
      {
        title: "Senior team with real experience",
        description:
          "Developers with years building products for companies in Venezuela and the region — not a catalog of buzzwords.",
      },
      {
        title: "Agile methodology, actually applied",
        description:
          "Short sprints, frequent demos, CI/CD and automated tests. We move with visibility and no last-minute surprises.",
      },
      {
        title: "Post-launch support",
        description:
          "Monitoring, alerts and responsive attention. Your product is still alive after deploy — and so are we.",
      },
      {
        title: "Continuous improvement",
        description:
          "We iterate based on real usage data and user feedback. Good software gets better over time.",
      },
    ],
    stats: [
      { number: "30+", label: "Projects delivered" },
      { number: "4.9/5", label: "Client satisfaction" },
      { number: "5+", label: "Years of experience" },
      { number: "99.9%", label: "Production uptime" },
      { number: "15+", label: "Technologies in use" },
      { number: "6", label: "Industries served" },
    ],
    testimonialsHeading: "What our clients say",
    testimonialsSubheading:
      "Anonymized feedback from real projects. We publish logos with prior authorization.",
    testimonials: [
      {
        name: "Operations manager",
        company: "Logistics operator",
        content:
          "We went from Excel to a system that everyone uses daily. Gradual rollout and the team adopted it without friction.",
        result: "−40% admin time",
      },
      {
        name: "Founder",
        company: "D2C fashion brand",
        content:
          "They understood our business before proposing technology. The new checkout doubled our mobile conversion.",
        result: "+60% conversion",
      },
      {
        name: "Owner",
        company: "Dental clinic",
        content:
          "Automated reminders drastically cut no-shows. The investment paid for itself in just a few months.",
        result: "−50% no-shows",
      },
    ],
  },
}

const featureIcons = [Brain, Zap, Shield, Lightbulb]
const statIcons = [CheckCircle, Star, Award, Shield, Code, Globe]

export default function AboutSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <>
      {/* About Section */}
      <section id="nosotros" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t.heading}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t.intro}</p>
              <div className="space-y-6">
                {t.features.map((feature, index) => {
                  const Icon = featureIcons[index]
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {t.stats.map((stat, index) => {
                const Icon = statIcons[index]
                return (
                  <div
                    key={index}
                    className="text-center p-6 bg-muted rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.testimonialsHeading}</h2>
            <p className="text-lg text-muted-foreground">{t.testimonialsSubheading}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
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
