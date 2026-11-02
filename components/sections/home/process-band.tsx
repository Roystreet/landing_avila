"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

const copy = {
  es: {
    heading: "De la idea a la cumbre",
    intro: "Así avanzamos en cada proyecto, sin importar su tamaño. Siempre sabes en qué tramo estás.",
    steps: [
      { title: "Descubrimiento", description: "Taller con tu equipo y un documento de alcance con tiempos y presupuesto." },
      { title: "Prototipo", description: "Pantallas navegables para validar la idea antes de programar." },
      { title: "Desarrollo", description: "Sprints de 2 semanas con una demo en vivo de cada avance." },
      { title: "Lanzamiento", description: "Puesta en producción con monitoreo y acompañamiento cercano." },
      { title: "Evolución", description: "Soporte y mejoras guiadas por el uso real." },
    ],
  },
  en: {
    heading: "From idea to summit",
    intro: "This is how every project moves forward, whatever its size. You always know which stretch you're on.",
    steps: [
      { title: "Discovery", description: "A workshop with your team and a scope document with timeline and budget." },
      { title: "Prototype", description: "Clickable screens to validate the idea before writing code." },
      { title: "Development", description: "Two-week sprints with a live demo of every increment." },
      { title: "Launch", description: "Production release with monitoring and close support." },
      { title: "Evolution", description: "Support and improvements driven by real usage." },
    ],
  },
}

// Ascenso: cada parada está más alta que la anterior. Lienzo 1440 × 190.
const WAYPOINTS = [
  [144, 150],
  [432, 116],
  [720, 84],
  [1008, 52],
  [1296, 20],
] as const
const ASCENT =
  "M0 172 C60 166 100 152 144 150 S200 166 250 160 S380 120 432 116 S500 128 560 118 S680 88 720 84 S800 96 850 86 S960 56 1008 52 S1080 62 1130 50 S1250 22 1296 20 S1400 34 1440 40"
const ASCENT_FILL = `${ASCENT} L1440 190 L0 190Z`

export default function ProcessBand() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(1)

  // El recorrido avanza con el scroll; con "reducir movimiento" queda completo
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.85 - rect.top) / (rect.height * 0.9)
      setProgress(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const reached = (i: number) => progress >= (i / (t.steps.length - 1)) * 0.92 + 0.02

  return (
    <section className="bg-background px-4 sm:px-6 lg:px-8">
      <div ref={ref} className="dark mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-background text-foreground">
        <div className="px-6 pt-12 md:px-12 md:pt-14">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{t.heading}</h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{t.intro}</p>
        </div>

        {/* Escritorio: perfil de ascenso con paradas */}
        <div className="relative mt-10 hidden md:block">
          <div className="relative">
            <svg viewBox="0 0 1440 190" preserveAspectRatio="none" aria-hidden="true" className="block h-44 w-full">
              <path d={ASCENT_FILL} fill="oklch(0.215 0.03 265)" />
              <path d={ASCENT} fill="none" stroke="oklch(0.36 0.04 262)" strokeWidth="1.5" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
              <path
                d={ASCENT}
                fill="none"
                stroke="oklch(0.68 0.17 258)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - progress}
                className="transition-[stroke-dashoffset] duration-200 ease-out"
              />
            </svg>
            {WAYPOINTS.map(([x, y], i) => (
              <span
                key={i}
                aria-hidden="true"
                className={cn(
                  "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-[background-color,border-color,color,box-shadow] duration-300",
                  reached(i)
                    ? "border-[oklch(0.68_0.17_258)] bg-primary text-white shadow-[0_0_0_6px_oklch(0.68_0.17_258/0.18)]"
                    : "border-[oklch(0.45_0.03_260)] bg-background text-muted-foreground",
                )}
                style={{ left: `${(x / 1440) * 100}%`, top: `${(y / 190) * 100}%` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <ol className="grid grid-cols-5 bg-[oklch(0.215_0.03_265)] px-4 pb-12 pt-2">
            {t.steps.map((step, i) => (
              <li key={step.title} className={cn("px-3 transition-opacity duration-300", reached(i) ? "opacity-100" : "opacity-55")}>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Móvil: riel vertical que se llena con el scroll */}
        <ol className="relative mx-6 mb-12 mt-10 space-y-7 md:hidden">
          <span aria-hidden="true" className="absolute bottom-2 left-4 top-2 w-px bg-border" />
          <span
            aria-hidden="true"
            className="absolute left-4 top-2 w-px origin-top bg-[oklch(0.68_0.17_258)] transition-transform duration-200"
            style={{ height: "calc(100% - 1rem)", transform: `scaleY(${progress})` }}
          />
          {t.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4">
              <span
                className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-300",
                  reached(i) ? "border-[oklch(0.68_0.17_258)] bg-primary text-white" : "border-[oklch(0.45_0.03_260)] bg-background text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="pt-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
