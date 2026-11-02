"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { Ridge, SUMMIT } from "@/components/brand/ridge"
import { WHATSAPP_URL } from "@/lib/contact"
import { SprintPanel } from "./sprint-panel"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"

const copy = {
  es: {
    title: "Construimos el software que tu negocio usa todos los días.",
    description:
      "Agendas en línea, ERPs, apps y automatizaciones con IA para pymes, startups y empresas de Latinoamérica. Desde Caracas, con 8 años de oficio.",
    ctaPrimary: "Cotizar mi proyecto",
    ctaSecondary: "Escribir por WhatsApp",
    stats: [
      { value: "30+", label: "proyectos entregados" },
      { value: "4.9/5", label: "satisfacción de clientes" },
      { value: "8", label: "años desarrollando" },
    ],
    caption: "Así ves el avance de tu proyecto (ejemplo ilustrativo)",
  },
  en: {
    title: "We build the software your business runs on every day.",
    description:
      "Online booking, ERPs, apps and AI automations for SMBs, startups and companies across Latin America. From Caracas, with 8 years of craft.",
    ctaPrimary: "Quote my project",
    ctaSecondary: "Message us on WhatsApp",
    stats: [
      { value: "30+", label: "projects delivered" },
      { value: "4.9/5", label: "client satisfaction" },
      { value: "8", label: "years building" },
    ],
    caption: "This is how you follow your project (illustrative example)",
  },
}

export default function Hero() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const stackRef = useRef<HTMLDivElement>(null)
  // Inclinación de las interfaces siguiendo el cursor (solo puntero fino y sin "reducir movimiento")
  useEffect(() => {
    const el = stackRef.current
    if (!el) return
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!finePointer || reduce) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5
        const y = e.clientY / window.innerHeight - 0.5
        el.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`)
        el.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`)
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <section className="dark relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.15_0.022_265)_0%,oklch(0.17_0.025_265)_45%,oklch(0.24_0.05_262)_100%)] text-foreground">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-32 pt-14 sm:px-6 md:pb-40 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-44">
        <div className="relative z-10">
          <h1 className="max-w-[15ch] text-[2.5rem] font-bold leading-[1.04] sm:text-6xl lg:text-[4rem]">{t.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cotizacion"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </Link>
            <a
              href={WHATSAPP_URL}
              data-wa-inline
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[oklch(0.45_0.03_260)] px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-foreground hover:bg-white/5"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-[#25D366]" />
              {t.ctaSecondary}
            </a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            {t.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-sm leading-snug text-muted-foreground">{s.label}</dt>
                <dd className="order-1 text-3xl font-bold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative z-10 [perspective:1400px]">
          <div
            ref={stackRef}
            className="relative mx-auto w-full max-w-[460px] transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]"
          >
            <SprintPanel lang={lang} />
          </div>
          <figcaption className="mt-14 text-right text-xs text-muted-foreground">{t.caption}</figcaption>
        </figure>
      </div>

      <div className="absolute inset-x-0 bottom-0 [--ridge-fill:oklch(0.12_0.02_265)]">
        <div className="relative">
          <Ridge draw className="h-28 md:h-40" />
          <span
            aria-hidden="true"
            className="summit-light absolute h-3 w-3 rounded-full bg-[oklch(0.92_0.06_240)] shadow-[0_0_0_6px_oklch(0.68_0.17_258/0.25),0_0_24px_4px_oklch(0.68_0.17_258/0.5)]"
            style={{ left: `${(SUMMIT.x / 1440) * 100}%`, top: `${(SUMMIT.y / 200) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
