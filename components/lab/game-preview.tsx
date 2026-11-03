"use client"

import { useEffect, useRef, useState } from "react"
import type { LabGameSlug } from "@/lib/lab-games"
import { cn } from "@/lib/utils"

// Miniaturas reales de los juegos: póster (captura en WebP) y un clip de 4 s que se reproduce
// al pasar el cursor por la tarjeta o, en pantallas táctiles, cuando la tarjeta está a la vista.
// Con movimiento reducido solo se muestra el póster.

export function GamePreview({ slug, className }: { slug: LabGameSlug; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = wrap.current
    const v = video.current
    if (!el || !v) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const play = () => {
      v.preload = "auto"
      void v.play().catch(() => undefined)
    }
    const stop = () => {
      v.pause()
      setPlaying(false)
    }
    const card = (el.closest("a") as HTMLElement | null) ?? el
    if (window.matchMedia("(hover: hover)").matches) {
      card.addEventListener("pointerenter", play)
      card.addEventListener("pointerleave", stop)
      card.addEventListener("focus", play)
      card.addEventListener("blur", stop)
      return () => {
        card.removeEventListener("pointerenter", play)
        card.removeEventListener("pointerleave", stop)
        card.removeEventListener("focus", play)
        card.removeEventListener("blur", stop)
      }
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-[#0B0F1A]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/lab/thumbs/${slug}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        width={960}
        height={600}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <video
        ref={video}
        src={`/lab/thumbs/${slug}.mp4`}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          playing ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Viñeta inferior para que la tarjeta se lea como pantalla de juego */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,15,26,0.55)_100%)]" />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[rgba(11,15,26,0.7)] px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity duration-300",
          playing ? "opacity-0" : "opacity-100",
        )}
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
          <path d="M3 1.5v9l7.5-4.5z" />
        </svg>
        3D
      </span>
    </div>
  )
}
