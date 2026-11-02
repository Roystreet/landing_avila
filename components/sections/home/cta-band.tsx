"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { Ridge, SUMMIT } from "@/components/brand/ridge"
import { WHATSAPP_URL } from "@/lib/contact"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"

const copy = {
  es: {
    heading: "Cuéntanos qué quieres resolver.",
    description: "Te respondemos en menos de 24 horas hábiles. La primera llamada es gratuita y sin compromiso.",
    cta: "Cotizar mi proyecto",
    whatsapp: "Escribir por WhatsApp",
  },
  en: {
    heading: "Tell us what you want to solve.",
    description: "We reply within 24 business hours. The first call is free, with no commitment.",
    cta: "Quote my project",
    whatsapp: "Message us on WhatsApp",
  },
}

export default function CtaBand() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section className="bg-background px-4 pb-20 sm:px-6 md:pb-24 lg:px-8">
      <div className="dark relative mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,oklch(0.17_0.025_265)_0%,oklch(0.24_0.05_262)_100%)] text-foreground">
        <div className="relative z-10 flex flex-col gap-8 px-6 pb-28 pt-12 lg:flex-row lg:items-start lg:justify-between md:px-12 md:pb-32 md:pt-14">
          <div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight md:text-5xl">{t.heading}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/cotizacion"
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
            >
              {t.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </Link>
            <a
              href={WHATSAPP_URL}
              data-wa-inline
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[oklch(0.45_0.03_260)] px-7 py-3.5 text-base font-semibold transition-colors hover:border-foreground hover:bg-white/5"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-[#25D366]" />
              {t.whatsapp}
            </a>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 [--ridge-fill:oklch(0.12_0.02_265)]">
          <div className="relative">
            <Ridge className="h-24 md:h-32" />
            <span
              aria-hidden="true"
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.92_0.06_240)] shadow-[0_0_0_5px_oklch(0.68_0.17_258/0.25),0_0_20px_4px_oklch(0.68_0.17_258/0.5)]"
              style={{ left: `${(SUMMIT.x / 1440) * 100}%`, top: `${(SUMMIT.y / 200) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
