"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { GamePreview } from "@/components/lab/game-preview"
import { trackLabEvent } from "@/lib/gtag"

const copy = {
  es: {
    title: "¿Te atreves a subir el Ávila?",
    body: "Tres juegos en 3D hechos por nuestro equipo. Así se siente lo que construimos.",
    cta: "Ir al Lab",
  },
  en: {
    title: "Dare to climb the Ávila?",
    body: "Three 3D games made by our team. That's how what we build feels.",
    cta: "Go to the Lab",
  },
}

// Franja discreta hacia el Lab: no compite con la cotización, que sigue siendo el cierre de la home.
export default function LabTeaser() {
  const { lang } = useLanguage()
  const t = copy[lang]
  return (
    <section className="bg-background px-4 pb-10 sm:px-6 lg:px-8">
      <Link
        href="/lab/sube-el-avila"
        onClick={() => trackLabEvent("lab_teaser_click", { from: "home" })}
        className="group mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-shadow hover:shadow-[0_18px_40px_-24px_oklch(0.546_0.215_263/0.5)] sm:flex-row sm:items-center"
      >
        <GamePreview slug="sube-el-avila" className="aspect-[16/9] w-full sm:aspect-auto sm:h-36 sm:w-64 sm:shrink-0" />
        <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{t.body}</p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors group-hover:border-primary group-hover:text-primary">
            {t.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </section>
  )
}
