import { RIDGE_LINE, RIDGE_FILL, SUMMIT } from "@/components/brand/ridge"
import type { LabGameSlug } from "@/lib/lab-games"
import { cn } from "@/lib/utils"

// Vistas previas en SVG animado (sin WebGL) para las tarjetas del Lab.

const STARS: [number, number, number][] = [
  [60, 30, 1.2], [140, 60, 0.8], [210, 22, 1], [300, 48, 1.4], [380, 18, 0.9], [460, 64, 1.1],
  [520, 26, 0.8], [600, 52, 1.3], [90, 92, 0.7], [250, 96, 0.9], [420, 104, 0.8], [560, 98, 1],
]

function SummitPreview() {
  // Sendero zigzag hasta la cumbre, sobre la cresta escalada a 640×400.
  const trail = "M120 380 C 220 352 160 318 260 300 S 300 250 380 236 S 330 190 420 168 S 452 132 452 110"
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070A12" />
          <stop offset="1" stopColor="#1B2A52" />
        </linearGradient>
        <radialGradient id="pv-glow">
          <stop offset="0" stopColor="#DBE7FF" />
          <stop offset="0.35" stopColor="#4F8CFF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#4F8CFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#pv-sky)" />
      {STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#DBE7FF" opacity={0.5 + (i % 3) * 0.15}>
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2.4 + (i % 4) * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g transform="translate(0 70) scale(0.4444 1.6)">
        <path d={RIDGE_FILL} fill="#121A2C" />
        <path d={RIDGE_LINE} fill="none" stroke="#4F8CFF" strokeOpacity="0.5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </g>
      <circle cx={SUMMIT.x * 0.4444} cy={70 + SUMMIT.y * 1.6} r="36" fill="url(#pv-glow)">
        <animate attributeName="r" values="28;40;28" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M0 400 L0 330 C 120 300 220 330 330 280 C 430 236 520 250 640 220 L640 400Z" fill="#0B0F1A" />
      <path d={trail} fill="none" stroke="#DBE7FF" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      <g>
        <circle r="5" fill="#FFC46B" />
        <circle r="16" fill="#FFC46B" opacity="0.18" />
        <animateMotion dur="6s" repeatCount="indefinite" path={trail} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.6 1" />
      </g>
      {[[262, 300], [380, 236]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <ellipse rx="9" ry="6" fill="#FF4D5E" />
          <circle cx="-4" cy="-2" r="1.5" fill="#fff" />
          <circle cx="4" cy="-2" r="1.5" fill="#fff" />
        </g>
      ))}
    </svg>
  )
}

function SprintPreview() {
  const items = [
    { color: "#2563EB", glyph: "M-9 -6 h18 v12 h-18z M-9 -2 h18" },
    { color: "#4F8CFF", glyph: "M-5 -9 h10 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2 v-14 a2 2 0 0 1 2 -2z" },
    { color: "#94A3B8", glyph: "M-8 4 a5 5 0 0 1 1 -10 a6 6 0 0 1 11 2 a4 4 0 0 1 0 8z" },
  ]
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden="true">
      <rect width="640" height="400" fill="#0B0F1A" />
      <g opacity="0.25" stroke="#4F8CFF">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={i * 60} y1="0" x2={i * 60 - 200} y2="400" />
        ))}
      </g>
      <rect x="280" y="20" width="80" height="250" rx="10" fill="#131A2A" stroke="#2A3550" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="290" y={30 + i * 28} width="60" height="3" rx="1.5" fill="#2A3550">
          <animate attributeName="y" values={`${30 + i * 28};${58 + i * 28}`} dur="0.8s" repeatCount="indefinite" />
        </rect>
      ))}
      {items.map((it, i) => (
        <g key={i}>
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill={it.color} />
          <path d={it.glyph} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
          <animateMotion dur="3s" begin={`${i}s`} repeatCount="indefinite" path={`M320 30 L320 250 L${[150, 320, 490][i]} 330`} />
        </g>
      ))}
      <g>
        <ellipse rx="13" ry="9" fill="#FF4D5E" />
        <circle cx="-5" cy="-3" r="2" fill="#fff" />
        <circle cx="5" cy="-3" r="2" fill="#fff" />
        <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M320 40 L320 200" />
      </g>
      {[150, 320, 490].map((x, i) => (
        <g key={x} transform={`translate(${x} 350)`}>
          <rect x="-56" y="-26" width="112" height="52" rx="12" fill="#131A2A" stroke={items[i].color} strokeWidth="2" />
          <rect x="-40" y="10" width="80" height="4" rx="2" fill={items[i].color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}
    </svg>
  )
}

function BuilderPreview() {
  // Plataforma hexagonal isométrica con módulos que aparecen en secuencia.
  const hex = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a) * 0.55}`
    }).join(" ")
  const modules = [
    { x: 200, y: 250, h: 44, c: "#2563EB" },
    { x: 440, y: 250, h: 64, c: "#4F8CFF" },
    { x: 260, y: 300, h: 30, c: "#94A3B8" },
    { x: 380, y: 300, h: 52, c: "#2563EB" },
    { x: 320, y: 196, h: 36, c: "#4F8CFF" },
  ]
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden="true">
      <rect width="640" height="400" fill="#0B0F1A" />
      {STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#DBE7FF" opacity="0.5" />
      ))}
      <polygon points={hex(320, 262, 210)} fill="#131A2A" stroke="#2A3550" strokeWidth="2" />
      <polygon points={hex(320, 278, 210)} fill="none" stroke="#4F8CFF" strokeOpacity="0.25" />
      {modules.map((m, i) => (
        <g key={i}>
          <line x1="320" y1="250" x2={m.x} y2={m.y} stroke="#4F8CFF" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />
          </line>
          <g>
            <polygon points={`${m.x - 24},${m.y} ${m.x},${m.y + 12} ${m.x + 24},${m.y} ${m.x},${m.y - 12}`} fill={m.c} opacity="0.35" />
            <rect x={m.x - 18} y={m.y - m.h} width="36" height={m.h} rx="6" fill={m.c} />
            <rect x={m.x - 10} y={m.y - m.h + 8} width="20" height="4" rx="2" fill="#fff" opacity="0.7" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -60;0 0;0 0;0 -60"
              keyTimes="0;0.12;0.85;1"
              dur="6s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </g>
        </g>
      ))}
      <g>
        <rect x="282" y="176" width="76" height="62" rx="8" fill="#DBE7FF" />
        <rect x="290" y="184" width="60" height="38" rx="4" fill="#2563EB" />
        <rect x="270" y="238" width="100" height="10" rx="4" fill="#94A3B8" />
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="3s" repeatCount="indefinite" />
      </g>
    </svg>
  )
}

export function GamePreview({ slug, className }: { slug: LabGameSlug; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#0B0F1A]", className)}>
      {slug === "sube-el-avila" && <SummitPreview />}
      {slug === "sprint-de-entrega" && <SprintPreview />}
      {slug === "arma-tu-app" && <BuilderPreview />}
    </div>
  )
}
