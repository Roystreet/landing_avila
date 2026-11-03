"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from "lucide-react"
import { RIDGE_LINE, RIDGE_POINTS, SUMMIT } from "@/components/brand/ridge"
import { readBest, writeBest } from "@/components/lab/engine/core"
import {
  EventBanner,
  GameOverlay,
  HudButton,
  Kbd,
  LifeBar,
  LabCta,
  MuteButton,
  OverlayCard,
  PrimaryButton,
  SecondaryButton,
  type LabGameProps,
} from "@/components/lab/ui"
import { ALT_SUMMIT, MAX_HEALTH, SummitGame, type GameEvent, type HudSnapshot } from "@/components/lab/games/summit/game"
import { cn } from "@/lib/utils"

const copy = {
  es: {
    title: "Sube el Ávila",
    goal: "Llega de noche al Pico Naiguatá. Esquiva lo que frena a cualquier proyecto y no te quedes sin energía.",
    controls: [
      { keys: ["←", "→"], text: "cambiar de carril" },
      { keys: ["Espacio"], text: "saltar" },
    ],
    touch: "En celular: desliza para moverte y toca para saltar.",
    legend: [
      { dot: "bg-[#ff4d5e]", text: "Bugs y reuniones: sáltalos" },
      { dot: "bg-[#94a3b8]", text: "Cambios de alcance y deadlines: esquívalos" },
      { dot: "bg-[#4f8cff]", text: "Commits suman puntos; cada 15 y el café recargan la batería" },
      { dot: "bg-[#dbe7ff]", text: "Pasar muy cerca sin chocar da +25" },
    ],
    play: "Empezar a subir",
    best: "Tu mejor puntaje",
    altitude: "Altitud",
    commits: "Commits",
    energy: "Energía",
    pause: "Pausar",
    paused: "En pausa",
    resume: "Seguir",
    restart: "Reiniciar",
    wonTitle: "¡Llegaste a la cima!",
    wonLine: "Así se siente lanzar un producto que llega arriba. ¿Subimos el tuyo?",
    lostTitle: (place: string | null) => (place ? `Te quedaste en ${place}` : "Te quedaste sin energía"),
    lostLine: "Los proyectos también se traban con bugs y cambios de alcance. Nosotros te acompañamos hasta la cima.",
    retry: "Intentar de nuevo",
    score: "Puntaje",
    time: "Tiempo",
    newBest: "¡Nuevo récord!",
    milestone: (n: string) => `${n}`,
    hit: { bug: "¡Un bug!", boulder: "¡Cambio de alcance!", deadline: "¡Deadline!", meeting: "¡Otra reunión!" },
    combo: (n: number) => `Racha ×${n}`,
    coffee: "+35 energía ☕",
    graze: "¡Roce! Vuelves a tu carril",
    nearMiss: "¡Por poco! +25",
    streakHeal: "Racha de commits: +10 energía",
    battery: "Batería",
    lowBattery: "Batería baja: busca un café",
    loading: (p: number) => `Cargando el bosque… ${p}%`,
    left: "Izquierda",
    right: "Derecha",
    jump: "Saltar",
  },
  en: {
    title: "Climb the Ávila",
    goal: "Reach Pico Naiguatá at night. Dodge what slows down every project and don't run out of energy.",
    controls: [
      { keys: ["←", "→"], text: "change lanes" },
      { keys: ["Space"], text: "jump" },
    ],
    touch: "On mobile: swipe to move and tap to jump.",
    legend: [
      { dot: "bg-[#ff4d5e]", text: "Bugs and meetings: jump them" },
      { dot: "bg-[#94a3b8]", text: "Scope changes and deadlines: dodge them" },
      { dot: "bg-[#4f8cff]", text: "Commits add points; every 15 and coffee recharge your battery" },
      { dot: "bg-[#dbe7ff]", text: "Passing very close without crashing gives +25" },
    ],
    play: "Start climbing",
    best: "Your best score",
    altitude: "Altitude",
    commits: "Commits",
    energy: "Energy",
    pause: "Pause",
    paused: "Paused",
    resume: "Resume",
    restart: "Restart",
    wonTitle: "You reached the summit!",
    wonLine: "That's what shipping a product that makes it to the top feels like. Shall we climb yours?",
    lostTitle: (place: string | null) => (place ? `You stopped at ${place}` : "You ran out of energy"),
    lostLine: "Projects get stuck on bugs and scope changes too. We'll walk with you all the way up.",
    retry: "Try again",
    score: "Score",
    time: "Time",
    newBest: "New record!",
    milestone: (n: string) => `${n}`,
    hit: { bug: "A bug!", boulder: "Scope change!", deadline: "Deadline!", meeting: "Another meeting!" },
    combo: (n: number) => `Streak ×${n}`,
    coffee: "+35 energy ☕",
    graze: "Graze! Back to your lane",
    nearMiss: "Close call! +25",
    streakHeal: "Commit streak: +10 energy",
    battery: "Battery",
    lowBattery: "Low battery: grab a coffee",
    loading: (p: number) => `Loading the forest… ${p}%`,
    left: "Left",
    right: "Right",
    jump: "Jump",
  },
}

type Banner = { id: number; text: string; tone: "info" | "good" | "bad" }
type Stats = ReturnType<SummitGame["stats"]> & { best: number; isBest: boolean }

// Punto del sendero sobre la cresta de marca, desde el inicio hasta la cumbre.
const PATH = RIDGE_POINTS.filter(([x]) => x <= SUMMIT.x)
const PATH_LEN = PATH.reduce((acc, p, i) => (i ? acc + Math.hypot(p[0] - PATH[i - 1][0], p[1] - PATH[i - 1][1]) : 0), 0)
function ridgePoint(progress: number) {
  let remaining = progress * PATH_LEN
  for (let i = 1; i < PATH.length; i += 1) {
    const [x0, y0] = PATH[i - 1]
    const [x1, y1] = PATH[i]
    const seg = Math.hypot(x1 - x0, y1 - y0)
    if (remaining <= seg) {
      const k = remaining / seg
      return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k }
    }
    remaining -= seg
  }
  return SUMMIT
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

function Lamp({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6 transition-opacity", on ? "opacity-100" : "opacity-25")} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={on ? "#FFC46B" : "none"} opacity={on ? 0.18 : 0} />
      <path d="M6 9.5a6 6 0 0 1 12 0v1.5H6z" fill={on ? "#FFE2A8" : "#94A3B8"} />
      <rect x="5" y="11" width="14" height="3.5" rx="1.2" fill={on ? "#FFC46B" : "#64748B"} />
      <rect x="9" y="15.5" width="6" height="3" rx="1" fill="#475569" />
    </svg>
  )
}

export default function SummitGameView({ lang }: LabGameProps) {
  const t = copy[lang]
  const stageRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<SummitGame | null>(null)
  const [hud, setHud] = useState<HudSnapshot | null>(null)
  const [phase, setPhase] = useState<HudSnapshot["phase"]>("intro")
  const [banners, setBanners] = useState<Banner[]>([])
  const [flash, setFlash] = useState(0)
  const [pulse, setPulse] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [best, setBest] = useState(0)
  const [coarse, setCoarse] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const [ready, setReady] = useState(false)
  const bannerId = useRef(0)
  const langRef = useRef(lang)
  langRef.current = lang

  const pushBanner = useCallback((text: string, tone: Banner["tone"]) => {
    bannerId.current += 1
    const id = bannerId.current
    setBanners((b) => [...b.slice(-1), { id, text, tone }])
    window.setTimeout(() => setBanners((b) => b.filter((x) => x.id !== id)), 1800)
  }, [])

  useEffect(() => {
    setBest(readBest("summit"))
    setCoarse(window.matchMedia("(pointer: coarse)").matches)
    const el = stageRef.current
    if (!el) return
    const onEvent = (e: GameEvent) => {
      const tt = copy[langRef.current]
      if (e.type === "phase") {
        setPhase(e.phase)
        if (e.phase === "won" || e.phase === "lost") {
          const g = gameRef.current!
          const s = g.stats()
          const prev = readBest("summit")
          const isBest = s.score > prev
          if (isBest) writeBest("summit", s.score)
          setBest(Math.max(prev, s.score))
          // Deja ver la escena final antes de la tarjeta
          window.setTimeout(() => setStats({ ...s, best: Math.max(prev, s.score), isBest }), e.phase === "won" ? 2600 : 1300)
        }
      } else if (e.type === "milestone") pushBanner(tt.milestone(e.name), "info")
      else if (e.type === "hit") {
        pushBanner(tt.hit[e.kind], "bad")
        setFlash((f) => f + 1)
      } else if (e.type === "commit") {
        setPulse((p) => p + 1)
        if (e.combo >= 5 && e.combo % 5 === 0) pushBanner(tt.combo(e.combo), "good")
      } else if (e.type === "coffee") pushBanner(tt.coffee, "good")
      else if (e.type === "graze") pushBanner(tt.graze, "bad")
      else if (e.type === "near-miss") pushBanner(tt.nearMiss, "good")
      else if (e.type === "streak-heal") pushBanner(tt.streakHeal, "good")
      else if (e.type === "loading") setLoadPct(Math.round(e.progress * 100))
      else if (e.type === "ready") setReady(true)
    }
    const game = new SummitGame(el, langRef.current, setHud, onEvent)
    gameRef.current = game
    if (game.isReady()) setReady(true)
    return () => {
      game.dispose()
      gameRef.current = null
    }
  }, [pushBanner])

  useEffect(() => {
    gameRef.current?.setLang(lang)
  }, [lang])

  const start = useCallback(() => {
    setStats(null)
    setBanners([])
    gameRef.current?.start()
    stageRef.current?.focus()
  }, [])

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current
      if (!g) return
      const target = e.target as HTMLElement | null
      if (target && /input|textarea|select/i.test(target.tagName)) return
      const k = e.key
      if (phase === "playing") {
        if (k === "ArrowLeft" || k === "a" || k === "A") g.input("left")
        else if (k === "ArrowRight" || k === "d" || k === "D") g.input("right")
        else if (k === " " || k === "ArrowUp" || k === "w" || k === "W") g.input("jump")
        else if (k === "p" || k === "P" || k === "Escape") g.pause()
        else return
        e.preventDefault()
      } else if (phase === "paused" && (k === "p" || k === "P" || k === "Escape" || k === "Enter")) {
        e.preventDefault()
        g.resume()
      } else if ((phase === "won" || phase === "lost") && stats && (k === "r" || k === "R")) {
        e.preventDefault()
        start()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, stats, start])

  // Pausa automática al cambiar de pestaña
  useEffect(() => {
    const onHide = () => document.hidden && gameRef.current?.pause()
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("blur", onHide)
    return () => {
      document.removeEventListener("visibilitychange", onHide)
      window.removeEventListener("blur", onHide)
    }
  }, [])

  // Gestos: deslizar para cambiar de carril, tocar o deslizar arriba para saltar
  const swipe = useRef<{ x: number; y: number; id: number; done: boolean } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (phase !== "playing") return
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId, done: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const s = swipe.current
    if (!s || s.done || s.id !== e.pointerId) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)) {
      gameRef.current?.input(dx < 0 ? "left" : "right")
      s.done = true
    } else if (dy < -32) {
      gameRef.current?.input("jump")
      s.done = true
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    if (s && !s.done && s.id === e.pointerId && e.pointerType !== "mouse") gameRef.current?.input("jump")
    swipe.current = null
  }

  const progress = hud?.progress ?? 0
  const dot = ridgePoint(progress)
  const playing = phase === "playing"

  return (
    <div className="absolute inset-0">
      <div
        ref={stageRef}
        tabIndex={-1}
        aria-label={t.title}
        className="absolute inset-0 outline-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      />

      {/* Destello rojo al recibir un golpe */}
      <div
        key={`flash-${flash}`}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-10", flash > 0 && "animate-[lab-hit_0.5s_ease-out_both]")}
        style={{ boxShadow: "inset 0 0 140px 30px rgba(255,59,79,0.55)", opacity: 0 }}
      />

      {/* Batería baja: borde rojo que late */}
      {playing && hud && hud.health < 30 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 animate-[lab-vignette_0.85s_ease-in-out_infinite]"
          style={{ boxShadow: "inset 0 0 120px 20px rgba(255,59,79,0.45)" }}
        />
      )}

      {/* HUD */}
      {(playing || phase === "paused") && hud && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 md:p-5">
          <div className="flex w-[min(46vw,15rem)] flex-col gap-2 md:w-60">
          <LifeBar value={hud.health} max={MAX_HEALTH} label={t.battery} icon={<Lamp on={hud.health > 0} />} />
          <div className="rounded-2xl border border-white/10 bg-[oklch(0.17_0.025_265/0.82)] px-3 pb-2 pt-2.5 text-white md:px-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{t.altitude}</span>
              <span className="whitespace-nowrap text-base font-bold tabular-nums md:text-xl">
                {hud.altitude.toLocaleString(lang === "es" ? "es-VE" : "en-US")} m
              </span>
            </div>
            <svg viewBox="0 0 1060 200" preserveAspectRatio="none" className="mt-1 h-8 w-full md:h-12" aria-hidden="true">
              <path d={RIDGE_LINE} fill="none" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path
                d={RIDGE_LINE}
                fill="none"
                stroke="#4F8CFF"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray={`${(progress * SUMMIT.x) / 1440} 1`}
              />
              <circle cx={SUMMIT.x} cy={SUMMIT.y} r="16" fill="#DBE7FF" opacity="0.9" />
              <circle cx={dot.x} cy={dot.y} r="22" fill="#FFC46B" />
              <circle cx={dot.x} cy={dot.y} r="44" fill="#FFC46B" opacity="0.2" />
            </svg>
            <div className="hidden justify-between text-[10px] font-medium text-[oklch(0.78_0.03_257)] sm:flex">
              <span>Caracas</span>
              <span>{ALT_SUMMIT.toLocaleString(lang === "es" ? "es-VE" : "en-US")} m</span>
            </div>
          </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <HudButton label={t.pause} onClick={() => gameRef.current?.pause()}>
                <Pause className="h-5 w-5" />
              </HudButton>
              <MuteButton lang={lang} />
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-[oklch(0.17_0.025_265/0.82)] px-2.5 text-white"
                aria-label={`${t.commits}: ${hud.commits}`}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <path d="M10 1 17 10 10 19 3 10Z" fill="#4F8CFF" />
                  <path d="M10 1 17 10H3Z" fill="#8FB5FF" />
                </svg>
                <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)] md:inline">{t.commits}</span>
                <span key={pulse} className={cn("inline-block min-w-[2.5ch] text-right text-base font-bold tabular-nums md:text-lg", pulse > 0 && "lab-pop")}>
                  {hud.commits}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners de eventos */}
      <div className="pointer-events-none absolute inset-x-0 top-36 z-10 flex flex-col items-center gap-2 md:top-8" aria-live="polite">
        {banners.map((b) => (
          <EventBanner key={b.id} id={b.id} text={b.text} tone={b.tone} />
        ))}
      </div>

      {/* Controles táctiles */}
      {coarse && playing && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-3">
            {(
              [
                ["left", t.left, ArrowLeft],
                ["right", t.right, ArrowRight],
              ] as const
            ).map(([intent, label, Icon]) => (
              <button
                key={intent}
                type="button"
                aria-label={label}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  gameRef.current?.input(intent)
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[oklch(0.17_0.025_265/0.7)] text-white active:scale-95 active:bg-[#2563EB]"
              >
                <Icon className="h-7 w-7" />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={t.jump}
            onPointerDown={(e) => {
              e.stopPropagation()
              gameRef.current?.input("jump")
            }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-[#2563EB]/85 text-white active:scale-95"
          >
            <ArrowUp className="h-8 w-8" />
          </button>
        </div>
      )}

      {phase === "intro" && (
        <GameOverlay>
          <OverlayCard title={t.title}>
            <p className="text-base leading-relaxed text-[oklch(0.85_0.02_257)]">{t.goal}</p>
            <ul className="mt-5 space-y-2 text-sm text-[oklch(0.85_0.02_257)]">
              {t.legend.map((l) => (
                <li key={l.text} className="flex items-center gap-3">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", l.dot)} aria-hidden="true" />
                  {l.text}
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-sm text-[oklch(0.85_0.02_257)]">
              {coarse ? (
                <p>{t.touch}</p>
              ) : (
                t.controls.map((c) => (
                  <div key={c.text} className="flex items-center gap-2">
                    {c.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                    <span>{c.text}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              {ready ? (
                <PrimaryButton onClick={start} autoFocus>
                  <Play className="h-4 w-4" />
                  {t.play}
                </PrimaryButton>
              ) : (
                <div className="w-full max-w-[14rem]" role="status">
                  <div className="text-sm font-semibold text-[oklch(0.85_0.02_257)]">{t.loading(loadPct)}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#4F8CFF] transition-[width] duration-200" style={{ width: `${loadPct}%` }} />
                  </div>
                </div>
              )}
              {best > 0 && (
                <span className="text-sm text-[oklch(0.78_0.03_257)]">
                  {t.best}: <strong className="tabular-nums text-white">{best}</strong>
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
              <PrimaryButton onClick={() => gameRef.current?.resume()} autoFocus>
                <Play className="h-4 w-4" />
                {t.resume}
              </PrimaryButton>
              <SecondaryButton onClick={start}>
                <RotateCcw className="h-4 w-4" />
                {t.restart}
              </SecondaryButton>
              <MuteButton lang={lang} />
            </div>
          </OverlayCard>
        </GameOverlay>
      )}

      {(phase === "won" || phase === "lost") && stats && (
        <GameOverlay tone={phase === "won" ? "clear" : "dim"}>
          <OverlayCard
            title={stats.won ? t.wonTitle : t.lostTitle(stats.reached)}
            kicker={
              stats.isBest ? (
                <span className="mb-3 inline-block rounded-full bg-[#FFC46B]/15 px-3 py-1 text-xs font-bold text-[#FFC46B]">{t.newBest}</span>
              ) : undefined
            }
          >
            <dl className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                [t.score, stats.score.toLocaleString(lang === "es" ? "es-VE" : "en-US")],
                [t.altitude, `${stats.altitude.toLocaleString(lang === "es" ? "es-VE" : "en-US")} m`],
                [stats.won ? t.time : t.commits, stats.won ? formatTime(stats.time) : String(stats.commits)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2.5 sm:px-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.78_0.03_257)]">{k}</dt>
                  <dd className="mt-1 whitespace-nowrap text-base font-bold tabular-nums sm:text-lg">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={start} autoFocus>
                <RotateCcw className="h-4 w-4" />
                {t.retry}
              </PrimaryButton>
              {!coarse && (
                <span className="text-sm text-[oklch(0.78_0.03_257)]">
                  <Kbd>R</Kbd>
                </span>
              )}
            </div>
            <LabCta lang={lang} line={stats.won ? t.wonLine : t.lostLine} />
          </OverlayCard>
        </GameOverlay>
      )}
    </div>
  )
}
