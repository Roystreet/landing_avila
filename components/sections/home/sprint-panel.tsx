"use client"

import { Check } from "lucide-react"
import type { Language } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"

// Panel ilustrativo del seguimiento que recibe cada cliente: en qué tramo va su proyecto.
// Anima desde CSS al pintar (sin depender de la hidratación), así no parpadea al cargar.
const copy = {
  es: {
    project: "App de reservas",
    sprint: "Sprint 4 de 6",
    stages: ["Descubrir", "Prototipo", "Desarrollo", "Lanzar"],
    progress: "Desarrollo",
    done: ["Pagos con pasarela local", "Recordatorios por WhatsApp", "Panel de citas del día"],
    next: "Demo en vivo · viernes 10:00",
    message: "Listo el build del sprint 4 para que lo pruebes.",
    from: "Equipo Ávila",
  },
  en: {
    project: "Booking app",
    sprint: "Sprint 4 of 6",
    stages: ["Discover", "Prototype", "Build", "Launch"],
    progress: "Development",
    done: ["Local payment gateway", "WhatsApp reminders", "Today's appointments panel"],
    next: "Live demo · Friday 10:00",
    message: "Sprint 4 build is ready for you to try.",
    from: "Ávila team",
  },
}

export function SprintPanel({ lang, className }: { lang: Language; className?: string }) {
  const t = copy[lang]
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-[18px] bg-white p-5 text-[oklch(0.17_0.025_265)] shadow-[0_30px_60px_-24px_oklch(0.05_0.03_265/0.8)] sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-base font-bold">{t.project}</p>
          <p className="text-xs font-semibold tabular-nums text-primary">{t.sprint}</p>
        </div>

        <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label={t.progress}>
          {t.stages.map((stage, i) => (
            <li key={stage} className="min-w-0">
              <span className="block h-1.5 overflow-hidden rounded-full bg-[oklch(0.929_0.013_255)]">
                <span
                  className={cn("block h-full rounded-full bg-primary", i < 2 && "w-full", i === 2 && "sprint-fill w-[66%]", i > 2 && "w-0")}
                />
              </span>
              <span className={cn("mt-2 block truncate text-xs", i <= 2 ? "font-semibold" : "text-[oklch(0.446_0.037_257)]")}>{stage}</span>
            </li>
          ))}
        </ol>

        <ul className="mt-5 space-y-2.5">
          {t.done.map((item, i) => (
            <li key={item} className="sprint-item flex items-center gap-2.5 text-sm" style={{ animationDelay: `${0.9 + i * 0.35}s` }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.93_0.06_150)] text-[oklch(0.45_0.13_150)]">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 border-t border-[oklch(0.929_0.013_255)] pb-12 pt-4 text-right text-xs font-semibold text-[oklch(0.446_0.037_257)] sm:pb-10">{t.next}</p>
      </div>

      <div className="sprint-message absolute -bottom-9 left-3 flex max-w-[270px] items-start gap-2.5 rounded-2xl bg-[oklch(0.27_0.04_264)] px-4 py-3 text-white shadow-[0_20px_40px_-18px_oklch(0.05_0.03_265/0.8)] ring-1 ring-white/10 sm:-left-8">
        <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />
        <p className="text-sm leading-snug">
          {t.message}
          <span className="mt-1 block text-xs text-[oklch(0.78_0.03_257)]">{t.from}</span>
        </p>
      </div>
    </div>
  )
}
