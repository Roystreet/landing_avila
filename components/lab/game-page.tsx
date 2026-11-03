"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { LAB_GAMES, getLabGame, type LabGameSlug } from "@/lib/lab-games"
import { GamePreview } from "@/components/lab/game-preview"
import type { LabGameProps } from "@/components/lab/ui"
import CtaBand from "@/components/sections/home/cta-band"
import type { ComponentType } from "react"

function StageLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#4F8CFF]" aria-hidden="true" />
    </div>
  )
}

// Cada juego se descarga solo al abrir su página: Three.js no pesa en el resto del sitio.
const GAMES: Record<LabGameSlug, ComponentType<LabGameProps>> = {
  "sube-el-avila": dynamic(() => import("@/components/lab/games/summit/summit-game"), { ssr: false, loading: StageLoading }),
  "sprint-de-entrega": dynamic(() => import("@/components/lab/games/sprint/sprint-game"), { ssr: false, loading: StageLoading }),
  "arma-tu-app": dynamic(() => import("@/components/lab/games/builder/builder-game"), { ssr: false, loading: StageLoading }),
}

const copy = {
  es: { back: "Lab", how: "Cómo se juega", more: "Más juegos del Lab", play: "Jugar" },
  en: { back: "Lab", how: "How to play", more: "More from the Lab", play: "Play" },
}

export function GamePage({ slug }: { slug: LabGameSlug }) {
  const { lang } = useLanguage()
  const t = copy[lang]
  const game = getLabGame(slug)!
  const Game = GAMES[slug]
  const others = LAB_GAMES.filter((g) => g.slug !== slug)

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="dark bg-background text-foreground">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 rounded-full py-2 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Link>
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <h1 className="truncate text-base font-bold md:text-lg">{game.title[lang]}</h1>
          <span className="ml-auto hidden text-sm text-muted-foreground sm:inline">
            {game.verb[lang]} · {game.duration[lang]}
          </span>
        </div>
        <div
          className="relative h-[calc(100svh-7.5rem)] min-h-[520px] w-full select-none overflow-hidden bg-[#0B0F1A] md:max-h-[860px]"
          style={{ touchAction: "none" }}
        >
          <Game lang={lang} />
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t.how}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{game.description[lang]}</p>
            <ul className="mt-6 space-y-2 text-base text-foreground">
              {game.controls[lang].map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t.more}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((g) => (
                <Link
                  key={g.slug}
                  href={`/lab/${g.slug}`}
                  className="group overflow-hidden rounded-[14px] border border-border bg-card transition-shadow hover:shadow-[0_18px_40px_-24px_oklch(0.546_0.215_263/0.5)]"
                >
                  <GamePreview slug={g.slug} className="aspect-[16/10]" />
                  <div className="flex items-center justify-between gap-3 p-4">
                    <span className="font-semibold">{g.title[lang]}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {t.play}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </div>
  )
}
