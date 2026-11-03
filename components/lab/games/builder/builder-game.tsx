"use client"

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Bell,
  ChartColumnIncreasing,
  Check,
  Cloud,
  CreditCard,
  Hand,
  KeyRound,
  Link2,
  MapPin,
  Monitor,
  MonitorSmartphone,
  Package,
  Plug,
  RotateCcw,
  Shuffle,
  Smartphone,
  Sparkles,
} from "lucide-react"
import { labAudio } from "@/components/lab/engine/audio"
import { prefersReducedMotion } from "@/components/lab/engine/core"
import { GameOverlay, HudButton, MuteButton, OverlayCard, type LabGameProps } from "@/components/lab/ui"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"
import { WHATSAPP_URL } from "@/lib/contact"
import { cn } from "@/lib/utils"
import {
  MODULES,
  PLATFORMS,
  SURPRISES,
  buildSummary,
  decodeBuild,
  encodeBuild,
  quoteHref,
  type Build,
  type ModuleId,
  type PlatformId,
} from "./catalog"
import type { BuilderScene } from "./scene"

type IconType = ComponentType<{ className?: string }>

const PLATFORM_ICONS: Record<PlatformId, IconType> = { web: Monitor, mobile: Smartphone, both: MonitorSmartphone }
const MODULE_ICONS: Record<ModuleId, IconType> = {
  login: KeyRound,
  payments: CreditCard,
  dashboard: ChartColumnIncreasing,
  ai: Sparkles,
  api: Plug,
  notifications: Bell,
  maps: MapPin,
  inventory: Package,
  cloud: Cloud,
}

const copy = {
  es: {
    appTitle: "Tu app",
    step1: "Plataforma",
    step2: "Módulos",
    pickFirst: "Primero elige una plataforma",
    empty: "Elige plataforma para empezar",
    modulesCount: (n: number) => (n === 1 ? "1 módulo" : `${n} módulos`),
    surprise: "Sorpréndeme",
    done: "Listo",
    reset: "Empezar de nuevo",
    dragHint: "Arrastra para girar · toca un pad vacío para agregar",
    add: "Agregar",
    readyTitle: "Tu app está lista para cotizar",
    readyBody: "Envíala a cotización con todo marcado y te preparamos una propuesta a medida, sin compromiso.",
    quote: "Cotizar este proyecto",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    keep: "Seguir armando",
    waText: "Hola, armé esto en el Lab de Avila System:",
  },
  en: {
    appTitle: "Your app",
    step1: "Platform",
    step2: "Modules",
    pickFirst: "Pick a platform first",
    empty: "Pick a platform to start",
    modulesCount: (n: number) => (n === 1 ? "1 module" : `${n} modules`),
    surprise: "Surprise me",
    done: "Done",
    reset: "Start over",
    dragHint: "Drag to orbit · tap an empty pad to add",
    add: "Add",
    readyTitle: "Your app is ready to quote",
    readyBody: "Send it to a quote with everything pre-filled and we'll prepare a tailored proposal, no strings attached.",
    quote: "Quote this project",
    copy: "Copy link",
    copied: "Link copied",
    keep: "Keep building",
    waText: "Hi, I built this in the Avila System Lab:",
  },
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return desktop
}

export default function BuilderGame({ lang }: LabGameProps) {
  const t = copy[lang]
  const stageRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<BuilderScene | null>(null)
  const staggerRef = useRef(false)
  const audioStarted = useRef(false)
  const reducedRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [platform, setPlatform] = useState<PlatformId | null>(null)
  const [modules, setModules] = useState<ModuleId[]>([])
  const [phase, setPhase] = useState<"build" | "celebrate" | "done">("build")
  const [hover, setHover] = useState<{ id: ModuleId; active: boolean } | null>(null)
  const [dragged, setDragged] = useState(false)
  const [copied, setCopied] = useState(false)
  const [popKey, setPopKey] = useState(0)
  const isDesktop = useIsDesktop()

  const build: Build = { platform, modules }

  const toggleModule = useCallback((id: ModuleId) => {
    setModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
    setPopKey((k) => k + 1)
  }, [])

  // Montaje de la escena (solo cliente)
  useEffect(() => {
    let cancelled = false
    reducedRef.current = prefersReducedMotion()
    import("./scene").then(({ BuilderScene }) => {
      if (cancelled || !stageRef.current) return
      const scene = new BuilderScene(stageRef.current, {
        reducedMotion: reducedRef.current,
        cb: {
          onHover: (id, active) => setHover(id ? { id, active } : null),
          onToggle: (id) => toggleModule(id),
          onFirstDrag: () => setDragged(true),
        },
      })
      scene.setLabelElement(labelRef.current)
      sceneRef.current = scene
      setReady(true)
      // Armado compartido por enlace
      const restored = decodeBuild(new URLSearchParams(window.location.search).get("build"))
      if (restored) {
        staggerRef.current = true
        setPlatform(restored.platform)
        setModules(restored.modules)
      }
    })
    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
      labAudio.stopAmbient()
    }
  }, [toggleModule])

  useEffect(() => {
    sceneRef.current?.setTitle(t.appTitle)
  }, [t.appTitle, ready])

  useEffect(() => {
    if (!ready) return
    sceneRef.current?.setBuild({ platform, modules }, { stagger: staggerRef.current })
    staggerRef.current = false
  }, [platform, modules, ready])

  // Encuadre: la cámara se corre para no quedar tapada por el panel o la hoja inferior
  useEffect(() => {
    if (!ready) return
    const target = isDesktop ? panelRef.current : sheetRef.current
    if (!target) return
    const update = () => {
      if (isDesktop) sceneRef.current?.setInsets(target.offsetWidth + 32, 0)
      else sceneRef.current?.setInsets(0, target.offsetHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(target)
    return () => ro.disconnect()
  }, [ready, isDesktop])

  useEffect(() => {
    if (phase !== "done") return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhase("build")
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase])

  const firstGesture = () => {
    labAudio.unlock()
    if (!audioStarted.current) {
      audioStarted.current = true
      labAudio.startAmbient("build")
    }
  }

  const surprise = () => {
    const current = encodeBuild(build)
    const options = SURPRISES.filter((s) => encodeBuild(s) !== current)
    const pick = options[Math.floor(Math.random() * options.length)]
    labAudio.play("whoosh")
    staggerRef.current = true
    setPlatform(pick.platform)
    setModules(pick.modules)
    setPopKey((k) => k + 1)
  }

  const reset = () => {
    setModules([])
    setPlatform(null)
    setPhase("build")
    labAudio.play("remove")
  }

  const finish = () => {
    if (!platform) return
    try {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?build=${encodeBuild(build)}`)
    } catch {
      // sin historial disponible
    }
    sceneRef.current?.celebrate()
    setPhase("celebrate")
    window.setTimeout(() => setPhase((p) => (p === "celebrate" ? "done" : p)), reducedRef.current ? 0 : 1300)
  }

  const shareUrl = () => `${window.location.origin}/lab/arma-tu-app?build=${encodeBuild(build)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      setCopied(true)
      labAudio.play("click")
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt(t.copy, shareUrl())
    }
  }

  const summaryLine = platform
    ? `${PLATFORMS.find((p) => p.id === platform)!.label[lang]} · ${t.modulesCount(modules.length)}`
    : t.empty
  const hoverMod = hover ? MODULES.find((m) => m.id === hover.id) : null

  const platformButtons = (compact: boolean) => (
    <div role="radiogroup" aria-label={t.step1} className="grid grid-cols-3 gap-2">
      {PLATFORMS.map((p) => {
        const Icon = PLATFORM_ICONS[p.id]
        const on = platform === p.id
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setPlatform(p.id)}
            title={p.hint[lang]}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-xl border text-center font-semibold transition-colors",
              compact ? "px-1 py-2 text-xs" : "px-2 py-3 text-sm",
              on
                ? "border-[#4F8CFF] bg-[#2563EB]/20 text-white shadow-[inset_0_0_0_1px_#4F8CFF]"
                : "border-white/10 bg-white/[0.03] text-[oklch(0.82_0.03_257)] hover:border-white/30 hover:text-white",
            )}
          >
            <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
            <span className="leading-tight">{p.label[lang]}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="absolute inset-0 overflow-hidden text-white" onPointerDownCapture={firstGesture}>
      <div ref={stageRef} className="absolute inset-0" />

      {/* Etiqueta flotante sobre el módulo enfocado */}
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-150"
      >
        {hoverMod && (
          <div className="mb-2 whitespace-nowrap rounded-lg border border-white/15 bg-[oklch(0.17_0.025_265/0.92)] px-3 py-1.5 text-center shadow-lg">
            <div className="text-sm font-bold">
              {hover?.active ? hoverMod.label[lang] : `+ ${t.add}: ${hoverMod.label[lang]}`}
            </div>
            <div className="text-[11px] text-[oklch(0.78_0.03_257)]">{hoverMod.hint[lang]}</div>
          </div>
        )}
      </div>

      {/* HUD superior */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex gap-2 md:left-4 md:top-4">
        <MuteButton lang={lang} />
        <HudButton label={t.reset} onClick={reset}>
          <RotateCcw className="h-5 w-5" />
        </HudButton>
      </div>
      {ready && !dragged && phase === "build" && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[oklch(0.17_0.025_265/0.82)] px-4 py-2 text-xs font-medium text-[oklch(0.85_0.03_257)] sm:flex md:left-[calc(50%-186px)]">
          <Hand className="h-4 w-4" />
          {t.dragHint}
        </div>
      )}

      {/* Panel lateral (escritorio) */}
      <div
        ref={panelRef}
        className={cn(
          "absolute bottom-4 right-4 top-4 z-10 hidden w-[340px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[oklch(0.16_0.024_265/0.92)] transition-opacity md:flex",
          phase !== "build" && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">1 · {t.step1}</h2>
          <div className="mt-3">{platformButtons(false)}</div>
          <h2 className="mt-6 text-xs font-bold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">2 · {t.step2}</h2>
          {!platform && <p className="mt-2 text-xs text-[oklch(0.7_0.03_257)]">{t.pickFirst}</p>}
          <ul className="mt-3 space-y-1.5">
            {MODULES.map((m) => {
              const Icon = MODULE_ICONS[m.id]
              const on = modules.includes(m.id)
              const focused = hover?.id === m.id
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    disabled={!platform}
                    onClick={() => toggleModule(m.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      on ? "border-[#4F8CFF]/70 bg-[#2563EB]/15" : "border-white/[0.07] bg-white/[0.02] hover:border-white/25",
                      focused && "border-white/50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        on ? "bg-[#2563EB] text-white" : "bg-white/5 text-[oklch(0.82_0.03_257)]",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight">{m.label[lang]}</span>
                      <span className="block truncate text-xs text-[oklch(0.75_0.03_257)]">{m.hint[lang]}</span>
                    </span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        on ? "border-[#4F8CFF] bg-[#4F8CFF] text-[#0B0F1A]" : "border-white/20",
                      )}
                    >
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="border-t border-white/10 p-5">
          <p key={popKey} className="lab-pop origin-left text-sm font-semibold tabular-nums" aria-live="polite">
            {summaryLine}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={surprise}
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-white/50 hover:bg-white/5"
            >
              <Shuffle className="h-4 w-4" />
              {t.surprise}
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={!platform}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1D4FD8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.done}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hoja inferior (móvil) */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 rounded-t-[20px] border-t border-white/10 bg-[oklch(0.16_0.024_265/0.95)] pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-opacity md:hidden",
          phase !== "build" && "pointer-events-none opacity-50",
        )}
      >
        <div className="px-3">{platformButtons(true)}</div>
        <div
          className="mt-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]"
          style={{ touchAction: "pan-x" }}
          aria-label={t.step2}
        >
          {MODULES.map((m) => {
            const Icon = MODULE_ICONS[m.id]
            const on = modules.includes(m.id)
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                disabled={!platform}
                onClick={() => toggleModule(m.id)}
                className={cn(
                  "flex h-11 shrink-0 snap-start items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors disabled:opacity-40",
                  on ? "border-[#4F8CFF] bg-[#2563EB]/25 text-white" : "border-white/10 bg-white/[0.03] text-[oklch(0.85_0.03_257)]",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{m.label[lang]}</span>
                {on && <Check className="h-3.5 w-3.5 text-[#4F8CFF]" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 px-3">
          <p key={popKey} className="lab-pop min-w-0 flex-1 origin-left truncate text-sm font-semibold tabular-nums" aria-live="polite">
            {summaryLine}
          </p>
          <HudButton label={t.surprise} onClick={surprise}>
            <Shuffle className="h-5 w-5" />
          </HudButton>
          <button
            type="button"
            onClick={finish}
            disabled={!platform}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#2563EB] px-5 text-sm font-semibold transition-colors hover:bg-[#1D4FD8] disabled:opacity-40"
          >
            {t.done}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {phase === "done" && platform && (
        <GameOverlay>
          <OverlayCard title={t.readyTitle}>
            <ul className="flex flex-wrap gap-1.5">
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-semibold">
                {(() => {
                  const PIcon = PLATFORM_ICONS[platform]
                  return <PIcon className="h-3.5 w-3.5" />
                })()}
                {PLATFORMS.find((p) => p.id === platform)!.label[lang]}
              </li>
              {MODULES.filter((m) => modules.includes(m.id)).map((m) => {
                const Icon = MODULE_ICONS[m.id]
                return (
                  <li key={m.id} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-xs font-semibold">
                    <Icon className="h-3.5 w-3.5 text-[#4F8CFF]" />
                    {m.label[lang]}
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-[oklch(0.82_0.03_257)]">{t.readyBody}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={quoteHref(build, lang)}
                autoFocus
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B0F1A] transition-colors hover:bg-[oklch(0.92_0.02_255)]"
              >
                {t.quote}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(`${t.waText} ${buildSummary(build, lang)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-inline
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2.5 text-sm font-semibold transition-colors hover:border-white/50"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2.5 text-sm font-semibold transition-colors hover:border-white/50"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Link2 className="h-4 w-4" />}
                  <span aria-live="polite">{copied ? t.copied : t.copy}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPhase("build")}
                className="mt-1 py-2 text-sm font-semibold text-[oklch(0.8_0.03_257)] underline-offset-4 hover:text-white hover:underline"
              >
                {t.keep}
              </button>
            </div>
          </OverlayCard>
        </GameOverlay>
      )}

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#4F8CFF]" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
