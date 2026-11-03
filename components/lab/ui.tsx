"use client"

// Piezas de interfaz compartidas por los juegos del Lab: botones del HUD,
// tarjetas de inicio/fin y la llamada a cotizar al terminar una partida.
import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Share2, Volume2, VolumeX } from "lucide-react"
import { labAudio } from "@/components/lab/engine/audio"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"
import { WHATSAPP_URL } from "@/lib/contact"
import { RIDGE_POINTS, SUMMIT } from "@/components/brand/ridge"
import { trackLabEvent } from "@/lib/gtag"
import type { Language } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

export type LabGameProps = { lang: Language }

export function HudButton({
  label,
  onClick,
  children,
  pressed,
  className,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  pressed?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[oklch(0.17_0.025_265/0.82)] text-[oklch(0.92_0.02_255)] transition-colors hover:border-white/30 hover:text-white active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function useMuted() {
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    setMuted(labAudio.muted)
    return labAudio.subscribe(setMuted)
  }, [])
  return [muted, (m: boolean) => labAudio.setMuted(m)] as const
}

export function MuteButton({ lang }: { lang: Language }) {
  const [muted, setMuted] = useMuted()
  return (
    <HudButton
      label={muted ? (lang === "es" ? "Activar sonido" : "Unmute") : lang === "es" ? "Silenciar" : "Mute"}
      pressed={muted}
      onClick={() => {
        labAudio.unlock()
        setMuted(!muted)
      }}
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </HudButton>
  )
}

/** Capa que cubre el escenario para inicio, pausa y final. */
export function GameOverlay({ children, tone = "dim" }: { children: ReactNode; tone?: "dim" | "clear" }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center overflow-y-auto p-4",
        tone === "dim" ? "bg-[oklch(0.12_0.02_265/0.72)]" : "bg-transparent",
      )}
    >
      {children}
    </div>
  )
}

export function OverlayCard({
  title,
  kicker,
  children,
  className,
}: {
  title: string
  kicker?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        "lab-card-in pointer-events-auto w-full max-w-md rounded-[20px] border border-white/10 bg-[oklch(0.19_0.028_265)] p-6 text-[oklch(0.97_0.005_248)] shadow-[0_30px_80px_-30px_oklch(0.05_0.02_265)] md:p-8",
        className,
      )}
    >
      {kicker}
      <h2 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export function PrimaryButton({ children, onClick, autoFocus }: { children: ReactNode; onClick: () => void; autoFocus?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1D4FD8] active:scale-[0.98]"
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
    >
      {children}
    </button>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-7 items-center justify-center rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-sans text-xs font-semibold text-white">
      {children}
    </kbd>
  )
}

/** Valor del HUD con números de ancho fijo para que no salte al cambiar. */
export function HudStat({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[oklch(0.17_0.025_265/0.82)] px-3 py-2 text-white">
      {icon}
      <div className="leading-none">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{label}</div>
        <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
      </div>
    </div>
  )
}

/** Cierre de partida: lleva a cotizar o a WhatsApp sin romper el tono del juego. */
export function LabCta({
  lang,
  line,
  quoteHref = "/cotizacion",
  game,
}: {
  lang: Language
  line?: string
  quoteHref?: string
  game?: string
}) {
  const t =
    lang === "es"
      ? { quote: "Cotizar mi proyecto", wa: "WhatsApp" }
      : { quote: "Quote my project", wa: "WhatsApp" }
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      {line && <p className="text-sm leading-relaxed text-[oklch(0.82_0.03_257)]">{line}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={quoteHref}
          onClick={() => trackLabEvent("lab_quote_click", { game: game ?? "lab" })}
          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F1A] transition-colors hover:bg-[oklch(0.92_0.02_255)]"
        >
          {t.quote}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-inline
          onClick={() => trackLabEvent("lab_whatsapp_click", { game: game ?? "lab" })}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          {t.wa}
        </a>
      </div>
    </div>
  )
}

/** Banner corto centrado arriba para hitos, combos y avisos. */
export function EventBanner({ text, tone = "info", id }: { text: string; tone?: "info" | "good" | "bad"; id: number }) {
  return (
    <div
      key={id}
      className={cn(
        "lab-banner pointer-events-none rounded-full border px-4 py-1.5 text-sm font-bold shadow-lg",
        tone === "good" && "border-emerald-300/30 bg-emerald-400/15 text-emerald-100",
        tone === "bad" && "border-rose-300/30 bg-rose-500/20 text-rose-100",
        tone === "info" && "border-white/15 bg-[oklch(0.17_0.025_265/0.85)] text-white",
      )}
    >
      {text}
    </div>
  )
}

/**
 * Barra de vida del Lab: el relleno baja al instante y una estela clara marca lo perdido
 * antes de vaciarse; brilla al curar y late cuando queda poca.
 */
export function LifeBar({
  value,
  max = 100,
  label,
  icon,
  segments = 4,
  low = 0.3,
  className,
  showValue = true,
}: {
  value: number
  max?: number
  label: string
  icon?: ReactNode
  segments?: number
  low?: number
  className?: string
  showValue?: boolean
}) {
  const pct = Math.max(0, Math.min(1, value / max))
  const [ghost, setGhost] = useState(pct)
  const [fx, setFx] = useState<{ kind: "hurt" | "heal"; id: number } | null>(null)
  const prev = useRef(pct)

  useEffect(() => {
    const before = prev.current
    prev.current = pct
    if (pct < before - 0.001) {
      setFx({ kind: "hurt", id: Date.now() })
      const t = window.setTimeout(() => setGhost(pct), 380)
      return () => window.clearTimeout(t)
    }
    if (pct > before + 0.001) setFx({ kind: "heal", id: Date.now() })
    setGhost(pct)
  }, [pct])

  const isLow = pct <= low
  const color = pct > 0.6 ? "#4F8CFF" : pct > low ? "#FFC46B" : "#FF4D5E"

  return (
    <div
      key={fx?.kind === "hurt" ? fx.id : undefined}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn(
        "rounded-xl border bg-[oklch(0.17_0.025_265/0.82)] px-3 py-2 text-white transition-colors",
        isLow ? "border-[#FF4D5E]/60" : "border-white/10",
        fx?.kind === "hurt" && "lab-shake",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{label}</span>
        {showValue && (
          <span className={cn("ml-auto text-sm font-bold tabular-nums", isLow && "text-[#FF8A96]")}>{Math.round((value / max) * 100)}%</span>
        )}
      </div>
      <div
        className={cn("relative mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10", isLow && "lab-low")}
        style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}
      >
        {/* Estela de daño */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/80 transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(ghost, pct) * 100}%` }}
        />
        {/* Relleno */}
        <div
          key={fx?.kind === "heal" ? fx.id : undefined}
          className={cn("absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-150", fx?.kind === "heal" && "lab-heal")}
          style={{ width: `${pct * 100}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
        {Array.from({ length: segments - 1 }, (_, i) => (
          <span key={i} className="absolute inset-y-0 w-0.5 bg-[oklch(0.17_0.025_265)]" style={{ left: `${((i + 1) / segments) * 100}%` }} />
        ))}
      </div>
    </div>
  )
}

/** Dibuja la tarjeta del récord (1080×1080) con la cresta de marca. */
async function scoreCard(title: string, score: string, stats: { label: string; value: string }[], footer: string) {
  const c = document.createElement("canvas")
  c.width = c.height = 1080
  const g = c.getContext("2d")!
  const sky = g.createLinearGradient(0, 0, 0, 1080)
  sky.addColorStop(0, "#070A12")
  sky.addColorStop(1, "#1B2A52")
  g.fillStyle = sky
  g.fillRect(0, 0, 1080, 1080)
  for (let i = 0; i < 90; i += 1) {
    g.fillStyle = `rgba(219,231,255,${0.2 + ((i * 37) % 10) / 14})`
    g.fillRect((i * 263) % 1080, (i * 151) % 560, 2, 2)
  }
  // Cresta del Ávila y luz de la cumbre
  const sx = 1080 / 1440
  g.beginPath()
  g.moveTo(0, 1080)
  RIDGE_POINTS.forEach(([x, y]) => g.lineTo(x * sx, 760 + y * 1.2))
  g.lineTo(1080, 1080)
  g.closePath()
  g.fillStyle = "#0B0F1A"
  g.fill()
  g.beginPath()
  RIDGE_POINTS.forEach(([x, y], i) => (i ? g.lineTo(x * sx, 760 + y * 1.2) : g.moveTo(x * sx, 760 + y * 1.2)))
  g.strokeStyle = "rgba(79,140,255,0.8)"
  g.lineWidth = 3
  g.stroke()
  const glow = g.createRadialGradient(SUMMIT.x * sx, 760 + SUMMIT.y * 1.2, 0, SUMMIT.x * sx, 760 + SUMMIT.y * 1.2, 90)
  glow.addColorStop(0, "rgba(219,231,255,1)")
  glow.addColorStop(0.2, "rgba(79,140,255,0.6)")
  glow.addColorStop(1, "rgba(79,140,255,0)")
  g.fillStyle = glow
  g.fillRect(0, 600, 1080, 400)
  if (document.fonts?.ready) await document.fonts.ready
  const font = getComputedStyle(document.body).fontFamily || "system-ui"
  g.fillStyle = "#94A3B8"
  g.font = `600 40px ${font}`
  g.fillText("AVILA LAB", 80, 130)
  g.fillStyle = "#FFFFFF"
  g.font = `800 76px ${font}`
  g.fillText(title, 80, 220)
  g.fillStyle = "#4F8CFF"
  g.font = `800 190px ${font}`
  g.fillText(score, 76, 430)
  g.font = `600 40px ${font}`
  stats.slice(0, 3).forEach((st, i) => {
    const x = 80 + i * 320
    g.fillStyle = "#94A3B8"
    g.fillText(st.label.toUpperCase(), x, 520)
    g.fillStyle = "#FFFFFF"
    g.font = `700 56px ${font}`
    g.fillText(st.value, x, 590)
    g.font = `600 40px ${font}`
  })
  g.fillStyle = "#DBE7FF"
  g.font = `600 36px ${font}`
  g.fillText(footer, 80, 1020)
  return new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"))
}

/** "Comparte tu récord": imagen + enlace por el menú nativo; si no hay, WhatsApp. */
export function ShareScore({
  lang,
  game,
  title,
  score,
  stats,
}: {
  lang: Language
  game: string
  title: string
  score: number
  stats: { label: string; value: string }[]
}) {
  const [busy, setBusy] = useState(false)
  const url = typeof window !== "undefined" ? `${window.location.origin}/lab/${game}` : `https://avilasystem.com/lab/${game}`
  const scoreText = score.toLocaleString(lang === "es" ? "es-VE" : "en-US")
  const text =
    lang === "es"
      ? `Hice ${scoreText} puntos en ${title} del Avila Lab. ¿Me superas?`
      : `I scored ${scoreText} in ${title} at Avila Lab. Can you beat me?`

  const share = async () => {
    setBusy(true)
    trackLabEvent("lab_share", { game, score })
    try {
      const blob = await scoreCard(title, scoreText, stats, url.replace(/^https?:\/\//, ""))
      const file = blob ? new File([blob], `avila-lab-${game}.png`, { type: "image/png" }) : null
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, url })
      } else if (navigator.share) {
        await navigator.share({ text, url })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener")
      }
    } catch {
      // el usuario canceló
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-5 py-3 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5 disabled:opacity-60"
    >
      <Share2 className="h-4 w-4" />
      {lang === "es" ? "Compartir récord" : "Share score"}
    </button>
  )
}
