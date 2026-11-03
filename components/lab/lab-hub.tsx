"use client"

import Link from "next/link"
import { ArrowRight, Box, Gauge, Smartphone, Waves } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { Ridge } from "@/components/brand/ridge"
import { GamePreview } from "@/components/lab/game-preview"
import { LAB_GAMES } from "@/lib/lab-games"
import CtaBand from "@/components/sections/home/cta-band"
import { cn } from "@/lib/utils"

const copy = {
  es: {
    title: "Avila Lab",
    subtitle:
      "Tres juegos hechos por nuestro equipo para que pruebes, en tu navegador, el tipo de experiencia que podemos construir para tu producto.",
    play: "Jugar",
    builtTitle: "Lo que hay detrás",
    credits: "Vegetación, utilería y efectos de sonido: Nature Kit, Impact, Interface y Digital Audio de Kenney (kenney.nl), licencia CC0.",
    built: [
      { icon: Box, title: "3D en tiempo real", body: "Escenas hechas con Three.js y WebGL, modeladas en código, sin descargas pesadas." },
      { icon: Waves, title: "Sonido en capas", body: "Efectos reales con variación de tono, más música y ambiente generados en vivo con Web Audio." },
      { icon: Smartphone, title: "Táctil y teclado", body: "Se juegan con gestos en el celular y con teclado en la computadora." },
      { icon: Gauge, title: "Carga bajo demanda", body: "Cada juego se descarga solo cuando lo abres, así el resto del sitio sigue cargando igual de rápido." },
    ],
  },
  en: {
    title: "Avila Lab",
    subtitle:
      "Three games made by our team so you can try, in your browser, the kind of experience we can build for your product.",
    play: "Play",
    builtTitle: "What's behind it",
    credits: "Vegetation, props and sound effects: Nature Kit, Impact, Interface and Digital Audio by Kenney (kenney.nl), CC0 license.",
    built: [
      { icon: Box, title: "Real-time 3D", body: "Scenes made with Three.js and WebGL, modeled in code, with no heavy downloads." },
      { icon: Waves, title: "Layered sound", body: "Real sound effects with pitch variation, plus music and ambience generated live with Web Audio." },
      { icon: Smartphone, title: "Touch and keyboard", body: "Play with gestures on your phone and with the keyboard on your computer." },
      { icon: Gauge, title: "Loaded on demand", body: "Each game downloads only when you open it, so the rest of the site loads just as fast." },
    ],
  },
}

export function LabHub() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [featured, ...rest] = LAB_GAMES

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="dark relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.15_0.022_265)_0%,oklch(0.17_0.025_265)_50%,oklch(0.24_0.05_262)_100%)] text-foreground">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 md:pb-36 md:pt-20 lg:px-8">
          <h1 className="text-4xl font-bold leading-[1.08] md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{t.subtitle}</p>
        </div>
        <Ridge draw className="absolute inset-x-0 bottom-0 h-20 [--ridge-fill:oklch(0.984_0.003_248)] [--ridge-line:oklch(0.68_0.17_258/0.6)] md:h-28" />
      </section>

      <section className="bg-background px-4 pb-20 pt-4 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {[featured, ...rest].map((game, i) => (
            <Link
              key={game.slug}
              href={`/lab/${game.slug}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_oklch(0.546_0.215_263/0.55)]",
                i === 0 && "lg:col-span-2 lg:flex-row",
              )}
            >
              <GamePreview
                slug={game.slug}
                className={cn("aspect-[16/10] w-full", i === 0 && "lg:aspect-auto lg:min-h-[420px] lg:w-[62%]")}
              />
              <div className={cn("flex flex-1 flex-col p-6 md:p-8", i === 0 && "lg:justify-center")}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="rounded-full bg-secondary px-3 py-1">{game.verb[lang]}</span>
                  <span className="rounded-full bg-secondary px-3 py-1">{game.duration[lang]}</span>
                </div>
                <h2 className={cn("mt-4 font-bold", i === 0 ? "text-3xl md:text-4xl" : "text-2xl")}>{game.title[lang]}</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{game.pitch[lang]}</p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-[var(--primary-hover)]">
                  {t.play}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-7xl">
          <h2 className="text-2xl font-bold md:text-3xl">{t.builtTitle}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.built.map((item) => (
              <div key={item.title}>
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">{t.credits}</p>
        </div>
      </section>
      <CtaBand />
    </div>
  )
}
