"use client"

import { Brain, Lightbulb, Shield, Zap } from "lucide-react"
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
      { number: "8", label: "Años desarrollando software" },
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
          "Entendieron nuestro negocio antes de proponer tecnología. Con el checkout nuevo, la conversión en móvil subió un 60%.",
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
      { number: "8", label: "Years building software" },
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
          "They understood our business before proposing technology. With the new checkout, mobile conversion went up 60%.",
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

export default function AboutSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <>
      <section id="nosotros" className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">{t.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.intro}</p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {t.features.map((feature, index) => {
                const Icon = featureIcons[index]
                return (
                  <li key={feature.title} className="flex items-start gap-4 py-5">
                    <Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <dl className="dark grid content-start self-start grid-cols-2 gap-x-8 gap-y-10 rounded-[20px] bg-background p-8 text-foreground md:p-10">
            {t.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col border-t border-border pt-5">
                <dt className="order-2 mt-1.5 text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="order-1 text-4xl font-bold tabular-nums text-accent">{stat.number}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border pt-12">
            <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-4xl">{t.testimonialsHeading}</h2>
            <p className="mt-3 text-muted-foreground">{t.testimonialsSubheading}</p>
            <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
              {t.testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="flex flex-col">
                  <p className="text-3xl font-bold tabular-nums text-primary">{testimonial.result}</p>
                  <blockquote className="mt-4 text-lg font-medium leading-relaxed">“{testimonial.content}”</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold">{testimonial.name}</span>
                    <span className="text-muted-foreground"> · {testimonial.company}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
