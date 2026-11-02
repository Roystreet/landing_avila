"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Ridge } from "@/components/brand/ridge"

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
    <section className="dark relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.15_0.022_265)_0%,oklch(0.17_0.025_265)_50%,oklch(0.24_0.05_262)_100%)] text-foreground">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 md:pb-36 md:pt-20 lg:px-8">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] md:text-6xl">
          {t.titleA}
          {t.titleHighlight && (
            <>
              {" "}
              {t.titleHighlight}
            </>
          )}
          {t.titleB && ` ${t.titleB}`}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{t.subtitle}</p>
      </div>
      <Ridge draw className="absolute inset-x-0 bottom-0 h-20 [--ridge-fill:oklch(0.984_0.003_248)] [--ridge-line:oklch(0.68_0.17_258/0.6)] md:h-28" />
    </section>
  )
}
