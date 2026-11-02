"use client"

import { useLanguage } from "@/components/providers/language-provider"

// Testimonios anonimizados de proyectos reales (ver about-section). Logos solo con autorización.
const copy = {
  es: {
    heading: "Lo que dicen quienes ya trabajaron con nosotros",
    note: "Comentarios anonimizados de proyectos reales.",
    quotes: [
      {
        text: "Pasamos de Excel a un sistema que todos usan a diario. La implementación fue gradual y el equipo se adaptó sin fricción.",
        author: "Gerente de operaciones",
        company: "Operador logístico",
      },
      {
        text: "Entendieron nuestro negocio antes de proponer tecnología. Con el checkout nuevo, la conversión en móvil subió un 60%.",
        author: "Fundadora",
        company: "Marca de moda D2C",
      },
    ],
  },
  en: {
    heading: "What people who worked with us say",
    note: "Anonymized comments from real projects.",
    quotes: [
      {
        text: "We went from Excel to a system everyone uses daily. The rollout was gradual and the team adapted without friction.",
        author: "Operations manager",
        company: "Logistics operator",
      },
      {
        text: "They understood our business before proposing technology. With the new checkout, mobile conversion went up 60%.",
        author: "Founder",
        company: "D2C fashion brand",
      },
    ],
  },
}

export default function Trust() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section className="bg-background pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border pt-12">
          <h2 className="max-w-xl text-2xl font-bold leading-tight md:text-3xl">{t.heading}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.note}</p>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            {t.quotes.map((q) => (
              <figure key={q.author}>
                <blockquote className="text-xl font-medium leading-relaxed md:text-2xl md:leading-snug">
                  <span aria-hidden="true" className="mr-1 font-bold text-primary">“</span>
                  {q.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{q.author}</span>
                  <span className="text-muted-foreground"> · {q.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
