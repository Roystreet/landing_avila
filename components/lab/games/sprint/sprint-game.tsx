"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AppWindow, Bug, Cloud, Pause, Play, RotateCcw, Smartphone, Zap } from "lucide-react"
import { ShareScore, LifeBar,
  GameOverlay,
  HudButton,
  Kbd,
  LabCta,
  MuteButton,
  OverlayCard,
  PrimaryButton,
  SecondaryButton,
  EventBanner,
  type LabGameProps,
} from "@/components/lab/ui"
import { labAudio } from "@/components/lab/engine/audio"
import { trackLabEvent } from "@/lib/gtag"
import { isCoarsePointer, prefersReducedMotion, readBest, writeBest } from "@/components/lab/engine/core"
import { getLabGame } from "@/lib/lab-games"
import { cn } from "@/lib/utils"
import { SPRINT_SECONDS, SprintEngine, type SprintEvent, type SprintHud, type SprintResult } from "./engine"
import type { Dir } from "./textures"

type Phase = "intro" | "play" | "paused" | "over"

const copy = {
  es: {
    goal: "Envía cada tarea a su destino y aplasta los bugs antes de que lleguen a producción.",
    controlsBug: "Aplastar bug",
    orClick: "o haz clic sobre él",
    space: "Espacio",
    touchHint: "Toca el destino abajo o el muelle en la escena. Toca los bugs para aplastarlos.",
    play: "Empezar sprint",
    best: "Mejor puntaje",
    time: "Tiempo",
    stability: "Estabilidad",
    score: "Puntos",
    pause: "Pausar",
    paused: "Sprint en pausa",
    resume: "Continuar",
    restart: "Reiniciar",
    again: "Jugar otra vez",
    winTitle: "¡Sprint entregado!",
    crashTitle: "El sprint se cayó",
    winBody: "Llegaste al final con producción estable.",
    crashBody: "Demasiadas regresiones. Nos pasa a todos alguna vez: lo importante es el siguiente sprint.",
    delivered: "Features entregadas",
    accuracy: "Precisión",
    maxCombo: "Combo máximo",
    squashed: "Bugs aplastados",
    newBest: "¡Nuevo récord!",
    cta: "Así se siente un buen sprint. Nosotros lo hacemos con tu producto.",
    laser: "Láser QA",
    dirs: { left: "Web", center: "Móvil", right: "Cloud" } as Record<Dir, string>,
    events: {
      combo: (n: number) => `Combo x${n}`,
      regression: "¡Regresión! Destino equivocado",
      escaped: "¡Un bug llegó a producción!",
      hotfix: (n: number) => `Hotfix entregado +${n}`,
      firstBug: "¡Bug en la banda! Tócalo o pulsa Espacio",
      firstBugTouch: "¡Bug en la banda! Tócalo para aplastarlo",
      lastTen: "¡Últimos 10 segundos!",
      breather: "Respira: el backlog se calma un momento",
    },
  },
  en: {
    goal: "Send every task to its destination and squash bugs before they reach production.",
    controlsBug: "Squash bug",
    orClick: "or click it",
    space: "Space",
    touchHint: "Tap a destination below or a dock in the scene. Tap bugs to squash them.",
    play: "Start sprint",
    best: "Best score",
    time: "Time",
    stability: "Stability",
    score: "Score",
    pause: "Pause",
    paused: "Sprint paused",
    resume: "Resume",
    restart: "Restart",
    again: "Play again",
    winTitle: "Sprint delivered!",
    crashTitle: "The sprint went down",
    winBody: "You made it to the end with production stable.",
    crashBody: "Too many regressions. It happens to all of us: what matters is the next sprint.",
    delivered: "Features delivered",
    accuracy: "Accuracy",
    maxCombo: "Max combo",
    squashed: "Bugs squashed",
    newBest: "New best!",
    cta: "That's what a good sprint feels like. We run them on your product.",
    laser: "QA laser",
    dirs: { left: "Web", center: "Mobile", right: "Cloud" } as Record<Dir, string>,
    events: {
      combo: (n: number) => `Combo x${n}`,
      regression: "Regression! Wrong destination",
      escaped: "A bug reached production!",
      hotfix: (n: number) => `Hotfix shipped +${n}`,
      firstBug: "Bug on the belt! Tap it or press Space",
      firstBugTouch: "Bug on the belt! Tap it to squash it",
      lastTen: "Last 10 seconds!",
      breather: "Breathe: the backlog eases off for a moment",
    },
  },
}

const DIR_ICON: Record<Dir, typeof AppWindow> = { left: AppWindow, center: Smartphone, right: Cloud }
const DIR_COLOR: Record<Dir, string> = { left: "#4F8CFF", center: "#34D399", right: "#DCE6F5" }
const DIR_KEY: Record<Dir, string> = { left: "←", center: "↓", right: "→" }
const DIRS: Dir[] = ["left", "center", "right"]

const INITIAL_HUD: SprintHud = { time: SPRINT_SECONDS, score: 0, mult: 1, stability: 3, laser: 1, dir: "center", urgent: false }

export default function SprintGame({ lang }: LabGameProps) {
  const t = copy[lang]
  const locale = lang === "es" ? "es-VE" : "en-US"
  const meta = getLabGame("sprint-de-entrega")!
  const stageRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SprintEngine | null>(null)
  const langRef = useRef(lang)
  const phaseRef = useRef<Phase>("intro")
  // Evita que un Espacio o toque del final de la partida dispare "Jugar otra vez" sin querer.
  const endedAtRef = useRef(0)
  const [phase, setPhaseState] = useState<Phase>("intro")
  const [hud, setHud] = useState<SprintHud>(INITIAL_HUD)
  const [banner, setBanner] = useState<{ id: number; text: string; tone: "info" | "good" | "bad" } | null>(null)
  const [result, setResult] = useState<SprintResult | null>(null)
  const [best, setBest] = useState(0)
  const [newBest, setNewBest] = useState(false)
  const [coarse, setCoarse] = useState(false)

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }, [])

  useEffect(() => {
    langRef.current = lang
    engineRef.current?.setLang(lang)
  }, [lang])

  useEffect(() => {
    const stage = stageRef.current
    const fx = fxRef.current
    if (!stage || !fx) return
    const isCoarse = isCoarsePointer()
    setCoarse(isCoarse)
    setBest(readBest("sprint"))
    let bannerId = 0
    const engine = new SprintEngine(
      stage,
      fx,
      {
        onHud: setHud,
        onEvent: (e: SprintEvent) => {
          const ev = copy[langRef.current].events
          const map: Record<SprintEvent["code"], [string, "info" | "good" | "bad"]> = {
            combo: [ev.combo(e.value ?? 2), "good"],
            regression: [ev.regression, "bad"],
            escaped: [ev.escaped, "bad"],
            hotfix: [ev.hotfix(e.value ?? 250), "good"],
            firstBug: [isCoarse ? ev.firstBugTouch : ev.firstBug, "info"],
            lastTen: [ev.lastTen, "bad"],
            breather: [ev.breather, "info"],
          }
          const [text, tone] = map[e.code]
          bannerId += 1
          setBanner({ id: bannerId, text, tone })
        },
        onEnd: (r) => {
          trackLabEvent("lab_game_end", { game: "sprint-de-entrega", result: r.reason, score: r.score })
          const prev = readBest("sprint")
          const isBest = r.score > prev
          if (isBest) writeBest("sprint", r.score)
          setBest(Math.max(prev, r.score))
          setNewBest(isBest)
          endedAtRef.current = performance.now()
          setResult(r)
          setPhase("over")
          labAudio.stopAmbient()
        },
        onAutoPause: () => {
          engineRef.current?.setPaused(true)
          setPhase("paused")
        },
      },
      { lang: langRef.current, reduced: prefersReducedMotion() },
    )
    engine.setPads(isCoarse ? 64 : 76, isCoarse ? 96 : 64)
    engineRef.current = engine
    // Gancho de QA: solo con ?labdebug en la URL
    if (new URLSearchParams(window.location.search).has("labdebug")) {
      ;(window as unknown as { __sprint?: SprintEngine }).__sprint = engine
    }
    return () => {
      engine.dispose()
      engineRef.current = null
      labAudio.stopAmbient()
    }
  }, [setPhase])

  const startRun = useCallback(() => {
    if (phaseRef.current === "over" && performance.now() - endedAtRef.current < 900) return
    labAudio.unlock()
    labAudio.startAmbient("focus")
    setResult(null)
    setNewBest(false)
    setBanner(null)
    setHud(INITIAL_HUD)
    engineRef.current?.start()
    trackLabEvent("lab_game_start", { game: "sprint-de-entrega" })
    setPhase("play")
  }, [setPhase])

  const pause = useCallback(() => {
    if (phaseRef.current !== "play") return
    engineRef.current?.setPaused(true)
    setPhase("paused")
  }, [setPhase])

  const resume = useCallback(() => {
    if (phaseRef.current !== "paused") return
    labAudio.unlock()
    engineRef.current?.setPaused(false)
    setPhase("play")
  }, [setPhase])

  const chooseDir = useCallback((d: Dir) => engineRef.current?.setDir(d), [])

  // Teclado mientras el juego está montado; al jugar, las flechas y Espacio no desplazan la página.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const p = phaseRef.current
      const k = e.key.toLowerCase()
      if (p === "play") {
        const dir: Dir | null =
          k === "arrowleft" || k === "a" || k === "1"
            ? "left"
            : k === "arrowdown" || k === "s" || k === "2"
              ? "center"
              : k === "arrowright" || k === "d" || k === "3"
                ? "right"
                : null
        if (dir) {
          e.preventDefault()
          chooseDir(dir)
        } else if (k === " " || k === "arrowup" || k === "w") {
          e.preventDefault()
          engineRef.current?.fireLaser()
        } else if (k === "p" || k === "escape") {
          e.preventDefault()
          pause()
        }
      } else if (p === "paused") {
        if (k === "p" || k === "escape") {
          e.preventDefault()
          resume()
        } else if (k === "r") startRun()
      } else if (p === "over" && k === "r") {
        e.preventDefault()
        startRun()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [chooseDir, pause, resume, startRun])

  const seconds = Math.ceil(hud.time)
  const playing = phase === "play"
  const inRun = phase === "play" || phase === "paused"

  return (
    <div className="absolute inset-0 overflow-hidden font-sans">
      <div ref={stageRef} className="absolute inset-0" />
      <div ref={fxRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />

      {/* HUD superior: tiempo y estabilidad a la izquierda, puntaje y combo a la derecha */}
      {inRun && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 md:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[oklch(0.17_0.025_265/0.85)] py-1.5 pl-1.5 pr-4 text-white">
            <TimerRing frac={hud.time / SPRINT_SECONDS} seconds={seconds} urgent={hud.urgent} label={t.time} />
            <LifeBar
              value={hud.stability}
              max={3}
              segments={3}
              low={0.34}
              label={t.stability}
              showValue={false}
              className="w-28 border-0 bg-transparent px-0 py-0 sm:w-32"
            />
          </div>

          <div className="flex items-start gap-2">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[oklch(0.17_0.025_265/0.85)] py-1.5 pl-4 pr-1.5 text-white">
              <div className="text-right leading-none">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{t.score}</div>
                <div key={hud.score} className="lab-pop mt-1 min-w-[4.5ch] text-xl font-bold tabular-nums">
                  {hud.score.toLocaleString(locale)}
                </div>
              </div>
              <div
                key={hud.mult}
                className={cn(
                  "lab-pop flex h-11 min-w-11 items-center justify-center rounded-xl px-1.5 text-sm font-extrabold tabular-nums",
                  hud.mult > 1 ? "bg-[#FFC46B] text-[#0B0F1A]" : "bg-white/10 text-white/60",
                )}
                aria-label={`Combo x${hud.mult}`}
              >
                x{hud.mult}
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <MuteButton lang={lang} />
              <HudButton label={t.pause} onClick={pause}>
                <Pause className="h-5 w-5" />
              </HudButton>
            </div>
          </div>
        </div>
      )}

      {/* En móvil, silencio y pausa bajan a una columna para no apretar el HUD */}
      {inRun && (
        <div className="absolute right-3 top-[4.6rem] z-10 flex flex-col gap-2 sm:hidden">
          <MuteButton lang={lang} />
          <HudButton label={t.pause} onClick={pause}>
            <Pause className="h-5 w-5" />
          </HudButton>
        </div>
      )}

      {banner && playing && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.75rem] z-10 flex justify-center px-16 text-center md:top-6 md:px-4">
          <EventBanner id={banner.id} text={banner.text} tone={banner.tone} />
        </div>
      )}

      {/* Leyenda de teclas y láser en escritorio */}
      {playing && !coarse && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[oklch(0.17_0.025_265/0.8)] px-3 py-2 text-xs font-medium text-white/80">
            {DIRS.map((d) => (
              <span key={d} className={cn("flex items-center gap-1.5 transition-opacity", hud.dir === d ? "opacity-100" : "opacity-55")}>
                <Kbd>{DIR_KEY[d]}</Kbd>
                <span style={{ color: hud.dir === d ? DIR_COLOR[d] : undefined }}>{t.dirs[d]}</span>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => engineRef.current?.fireLaser()}
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-[oklch(0.17_0.025_265/0.8)] px-3 py-2 text-xs font-medium text-white/80 hover:border-white/30"
          >
            <LaserRing frac={hud.laser} />
            <Kbd>{t.space}</Kbd>
            {t.laser}
          </button>
        </div>
      )}

      {/* Controles táctiles */}
      {playing && coarse && (
        <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {DIRS.map((d) => {
            const Icon = DIR_ICON[d]
            const active = hud.dir === d
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onPointerDown={(e) => {
                  e.preventDefault()
                  chooseDir(d)
                }}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border text-xs font-bold text-white transition-colors",
                  active ? "bg-[oklch(0.25_0.04_262/0.95)]" : "border-white/10 bg-[oklch(0.17_0.025_265/0.85)]",
                )}
                style={{ borderColor: active ? DIR_COLOR[d] : undefined, boxShadow: active ? `0 0 18px -4px ${DIR_COLOR[d]}` : undefined }}
              >
                <Icon className="h-5 w-5" style={{ color: DIR_COLOR[d] }} />
                {t.dirs[d]}
              </button>
            )
          })}
          <button
            type="button"
            aria-label={t.laser}
            onPointerDown={(e) => {
              e.preventDefault()
              engineRef.current?.fireLaser()
            }}
            className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-[#FF4D5E]/40 bg-[oklch(0.17_0.025_265/0.85)] text-[#FF8A95]"
          >
            <LaserRing frac={hud.laser} big />
            <Bug className="absolute h-5 w-5" />
          </button>
        </div>
      )}

      {phase === "intro" && (
        <GameOverlay>
          <OverlayCard
            title={meta.title[lang]}
            kicker={<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#4F8CFF]">Avila System Lab</p>}
          >
            <p className="text-base leading-relaxed text-[oklch(0.85_0.02_257)]">{t.goal}</p>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                {DIRS.map((d) => {
                  const Icon = DIR_ICON[d]
                  return (
                    <span key={d} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1">
                      {!coarse && <Kbd>{DIR_KEY[d]}</Kbd>}
                      <Icon className="h-4 w-4" style={{ color: DIR_COLOR[d] }} />
                      <span className="font-semibold">{t.dirs[d]}</span>
                    </span>
                  )
                })}
              </div>
              {coarse ? (
                <p className="text-[oklch(0.78_0.03_257)]">{t.touchHint}</p>
              ) : (
                <p className="flex flex-wrap items-center gap-2 text-[oklch(0.78_0.03_257)]">
                  <Bug className="h-4 w-4 text-[#FF8A95]" />
                  {t.controlsBug}: <Kbd>{t.space}</Kbd> {t.orClick}
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <PrimaryButton onClick={startRun} autoFocus>
                <Play className="h-4 w-4" />
                {t.play}
              </PrimaryButton>
              {best > 0 && (
                <span className="text-sm text-[oklch(0.78_0.03_257)]">
                  {t.best}: <strong className="tabular-nums text-white">{best.toLocaleString(locale)}</strong>
                </span>
              )}
            </div>
          </OverlayCard>
        </GameOverlay>
      )}

      {phase === "paused" && (
        <GameOverlay>
          <OverlayCard title={t.paused}>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={resume} autoFocus>
                <Play className="h-4 w-4" />
                {t.resume}
              </PrimaryButton>
              <SecondaryButton onClick={startRun}>
                <RotateCcw className="h-4 w-4" />
                {t.restart}
              </SecondaryButton>
            </div>
          </OverlayCard>
        </GameOverlay>
      )}

      {phase === "over" && result && (
        <GameOverlay>
          <OverlayCard
            title={result.reason === "time" ? t.winTitle : t.crashTitle}
            kicker={
              newBest ? (
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFC46B] px-2.5 py-0.5 text-xs font-bold text-[#0B0F1A]">
                  <Zap className="h-3.5 w-3.5" />
                  {t.newBest}
                </p>
              ) : undefined
            }
          >
            <p className="text-sm leading-relaxed text-[oklch(0.82_0.03_257)]">{result.reason === "time" ? t.winBody : t.crashBody}</p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{t.score}</div>
                <div className="text-4xl font-bold tabular-nums">{result.score.toLocaleString(locale)}</div>
              </div>
              <div className="text-right text-sm text-[oklch(0.78_0.03_257)]">
                {t.best}
                <div className="font-bold tabular-nums text-white">{best.toLocaleString(locale)}</div>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {(
                [
                  [t.delivered, result.delivered],
                  [t.accuracy, `${result.accuracy}%`],
                  [t.maxCombo, `x${result.maxMult}`],
                  [t.squashed, result.squashed],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 px-3 py-2">
                  <dt className="text-xs text-[oklch(0.78_0.03_257)]">{label}</dt>
                  <dd className="mt-0.5 text-lg font-bold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={startRun} autoFocus>
                <RotateCcw className="h-4 w-4" />
                {t.again}
              </PrimaryButton>
              <ShareScore
                lang={lang}
                game="sprint-de-entrega"
                title={lang === "es" ? "Sprint de entrega" : "Delivery Sprint"}
                score={result.score}
                stats={[
                  { label: t.delivered, value: String(result.delivered) },
                  { label: t.accuracy, value: `${result.accuracy}%` },
                  { label: t.maxCombo, value: `x${result.maxMult}` },
                ]}
              />
              {!coarse && <Kbd>R</Kbd>}
            </div>
            <LabCta lang={lang} game="sprint-de-entrega" line={t.cta} />
          </OverlayCard>
        </GameOverlay>
      )}
    </div>
  )
}

function TimerRing({ frac, seconds, urgent, label }: { frac: number; seconds: number; urgent: boolean; label: string }) {
  const r = 19
  const c = 2 * Math.PI * r
  return (
    <div className={cn("relative h-12 w-12", urgent && "animate-pulse")} role="timer" aria-label={`${label}: ${seconds}s`}>
      <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={urgent ? "#FF4D5E" : "#4F8CFF"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, frac)))}
          style={{ transition: "stroke-dashoffset 0.12s linear, stroke 0.3s" }}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums", urgent ? "text-[#FF8A95]" : "text-white")}>
        {seconds}
      </span>
    </div>
  )
}

function LaserRing({ frac, big }: { frac: number; big?: boolean }) {
  const size = big ? 52 : 18
  const r = big ? 23 : 7
  const c = 2 * Math.PI * r
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={cn("-rotate-90", big && "absolute inset-0 m-auto")} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2.5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={frac >= 1 ? "#FF4D5E" : "rgba(255,138,149,0.6)"}
        strokeWidth={2.5}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
      />
    </svg>
  )
}
