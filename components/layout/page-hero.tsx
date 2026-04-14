"use client"

import { useLanguage } from "@/components/providers/language-provider"

type HeroCopy = {
  titleA: string
  titleHighlight: string
  titleB?: string
  subtitle: string
}

export function PageHero({ copy }: { copy: { es: HeroCopy; en: HeroCopy } }) {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t.titleA}
          {t.titleHighlight && (
            <>
              {" "}
              <span className="text-primary">{t.titleHighlight}</span>
            </>
          )}
          {t.titleB && ` ${t.titleB}`}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
      </div>
    </div>
  )
}
