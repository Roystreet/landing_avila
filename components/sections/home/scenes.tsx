"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Bike, Check, Flame, MapPin, Package, ShoppingBag, Store } from "lucide-react"
import type { Language } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"

// Escenas ilustrativas de las interfaces que construimos en cada caso.
// Se animan una vez cuando `play` pasa a true; el estado final es el reposo.

type SceneProps = { play?: boolean; lang: Language; className?: string }

const agendaCopy = {
  es: { title: "Agenda", day: "Martes", chairs: ["Sillón 1", "Sillón 2", "Sillón 3"], busy: "Ocupado", booked: "Online", reminder: "Recordatorio enviado por WhatsApp", when: "Mañana · 10:00" },
  en: { title: "Schedule", day: "Tuesday", chairs: ["Chair 1", "Chair 2", "Chair 3"], busy: "Booked", booked: "Online", reminder: "Reminder sent on WhatsApp", when: "Tomorrow · 10:00" },
}

// [fila, columna, tipo]: "b" ocupado de antemano, "n" reserva nueva que se anima
const SLOTS: [number, number, "b" | "n"][] = [
  [0, 0, "b"], [0, 2, "n"], [1, 1, "n"], [1, 2, "b"], [2, 0, "n"], [2, 1, "b"], [3, 1, "n"], [3, 2, "n"],
]
const HOURS = ["09:00", "10:00", "11:00", "12:00"]

export function AgendaScene({ play, lang, className }: SceneProps) {
  const t = agendaCopy[lang]
  let n = 0
  return (
    <div data-play={play} className={cn("scene relative rounded-[14px] bg-white p-4 text-[oklch(0.17_0.025_265)] shadow-[0_24px_48px_-20px_oklch(0.1_0.03_265/0.55)]", className)}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold">{t.title}</p>
        <p className="text-xs text-[oklch(0.446_0.037_257)]">{t.day}</p>
      </div>
      <div className="mt-3 grid grid-cols-[2.6rem_repeat(3,1fr)] gap-1.5 text-xs">
        <span />
        {t.chairs.map((c) => (
          <span key={c} className="truncate pb-0.5 font-semibold text-[oklch(0.446_0.037_257)]">{c}</span>
        ))}
        {HOURS.map((h, r) => (
          <div key={h} className="contents">
            <span className="py-1.5 tabular-nums text-[oklch(0.446_0.037_257)]">{h}</span>
            {[0, 1, 2].map((c) => {
              const slot = SLOTS.find(([sr, sc]) => sr === r && sc === c)
              if (!slot) return <span key={c} className="rounded-md border border-dashed border-[oklch(0.88_0.015_255)]" />
              if (slot[2] === "b")
                return <span key={c} className="truncate rounded-md bg-[oklch(0.94_0.01_255)] px-1.5 py-1.5 text-[oklch(0.446_0.037_257)]">{t.busy}</span>
              const i = n++
              return (
                <span key={c} className="scene-pop truncate rounded-md bg-primary px-1.5 py-1.5 font-semibold text-white" style={{ animationDelay: `${0.35 + i * 0.32}s` }}>
                  {t.booked}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="scene-slide mt-3 flex items-center gap-2.5 rounded-xl bg-[oklch(0.95_0.05_150)] px-3 py-2.5" style={{ animationDelay: "2.2s" }}>
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-[oklch(0.55_0.15_150)]" />
        <div className="min-w-0 text-xs leading-snug">
          <p className="font-semibold">{t.reminder}</p>
          <p className="text-[oklch(0.4_0.06_150)]">{t.when}</p>
        </div>
        <Check className="ml-auto h-4 w-4 shrink-0 text-[oklch(0.5_0.14_150)]" aria-hidden="true" />
      </div>
    </div>
  )
}

const routesCopy = {
  es: { title: "Ruta del día", stops: "4 paradas", guide: "Guía 4821", delivered: "Entregada", invoice: "Factura generada" },
  en: { title: "Today's route", stops: "4 stops", guide: "Waybill 4821", delivered: "Delivered", invoice: "Invoice issued" },
}

const ROUTE = "M28 132 C70 128 84 96 118 92 S168 104 196 76 S236 34 280 40"
const STOPS = [
  [28, 132],
  [118, 92],
  [196, 76],
  [280, 40],
] as const

export function RoutesScene({ play, lang, className }: SceneProps) {
  const t = routesCopy[lang]
  return (
    <div data-play={play} className={cn("scene relative overflow-hidden rounded-[14px] bg-[oklch(0.215_0.03_265)] p-4 text-[oklch(0.985_0.003_248)] shadow-[0_24px_48px_-20px_oklch(0.05_0.03_265/0.7)]", className)}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold">{t.title}</p>
        <p className="text-xs text-[oklch(0.78_0.03_257)]">{t.stops}</p>
      </div>
      <svg viewBox="0 0 308 160" className="mt-2 w-full" aria-hidden="true">
        {/* Calles del mapa */}
        <g stroke="oklch(0.3 0.035 265)" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M0 110 H308" />
          <path d="M0 52 C80 60 150 40 308 58" />
          <path d="M96 0 V160" />
          <path d="M226 0 C214 60 236 110 220 160" />
        </g>
        <path d={ROUTE} fill="none" stroke="oklch(0.68 0.17 258 / 0.25)" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
        <path d={ROUTE} fill="none" stroke="oklch(0.68 0.17 258)" strokeWidth="3" strokeLinecap="round" pathLength={1} className="scene-route" />
        {STOPS.map(([x, y], i) => (
          <g key={i} className="scene-stop" style={{ animationDelay: `${0.5 + i * 0.55}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="9" fill="oklch(0.68 0.17 258 / 0.25)" />
            <circle cx={x} cy={y} r="4.5" fill="oklch(0.985 0.003 248)" />
          </g>
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap gap-2 text-xs">
        <span className="scene-slide inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.27_0.04_264)] px-2.5 py-1" style={{ animationDelay: "2.3s" }}>
          <Package className="h-3.5 w-3.5 text-[oklch(0.68_0.17_258)]" aria-hidden="true" />
          {t.guide} · {t.delivered}
        </span>
        <span className="scene-slide inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.27_0.04_264)] px-2.5 py-1" style={{ animationDelay: "2.6s" }}>
          <MapPin className="h-3.5 w-3.5 text-[oklch(0.68_0.17_258)]" aria-hidden="true" />
          {t.invoice}
        </span>
      </div>
    </div>
  )
}

const checkoutCopy = {
  es: { store: "Tienda", item: "Chaqueta", size: "Talla M", total: "Total", pay: "Pagar", paid: "Aprobado" },
  en: { store: "Store", item: "Jacket", size: "Size M", total: "Total", pay: "Pay", paid: "Approved" },
}

export function CheckoutScene({ play, lang, className }: SceneProps) {
  const t = checkoutCopy[lang]
  return (
    <div data-play={play} className={cn("scene relative w-full rounded-[26px] bg-[oklch(0.13_0.02_265)] p-1.5 shadow-[0_24px_48px_-20px_oklch(0.05_0.03_265/0.7)]", className)}>
      <div className="relative overflow-hidden rounded-[21px] bg-white px-3.5 pb-4 pt-5 text-[oklch(0.17_0.025_265)]">
        <span className="absolute left-1/2 top-1.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[oklch(0.17_0.025_265)]" />
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.446_0.037_257)]">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
          {t.store}
        </p>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[oklch(0.9_0.03_70)]">
            <Image src="/projects/chaqueta.webp" alt="" fill sizes="48px" className="object-cover" />
          </span>
          <div className="min-w-0 text-xs leading-snug">
            <p className="truncate font-semibold">{t.item}</p>
            <p className="text-[oklch(0.446_0.037_257)]">{t.size}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-between border-t border-[oklch(0.929_0.013_255)] pt-2.5 text-xs">
          <span>{t.total}</span>
          <span className="font-bold tabular-nums">$48.00</span>
        </div>
        <div className="relative mt-3 h-9">
          <span className="scene-press absolute inset-0 flex items-center justify-center rounded-full bg-primary text-xs font-semibold whitespace-nowrap text-white">
            {t.pay}
          </span>
          <span className="scene-success absolute inset-0 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[oklch(0.55_0.15_150)] px-2 text-xs font-semibold text-white">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            {t.paid}
          </span>
        </div>
      </div>
    </div>
  )
}

const deliveryCopy = {
  es: { title: "Pedido #2318", status: "En camino", eta: "Entrega promedio · 28 min", from: "Restaurante", to: "Tu dirección", paid: "Pago integrado" },
  en: { title: "Order #2318", status: "On the way", eta: "Average delivery · 28 min", from: "Restaurant", to: "Your address", paid: "Integrated payment" },
}

const DELIVERY_ROUTE = "M34 128 C64 126 70 98 104 96 S150 108 170 84 S214 46 268 40"

export function DeliveryScene({ play, lang, className }: SceneProps) {
  const t = deliveryCopy[lang]
  const motionRef = useRef<SVGAnimateMotionElement>(null)
  const [animate, setAnimate] = useState(false)

  // El repartidor recorre la ruta con SMIL; con "reducir movimiento" queda en destino
  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setAnimate(true)
  }, [play])
  useEffect(() => {
    if (animate) motionRef.current?.beginElement()
  }, [animate])

  return (
    <div data-play={play} className={cn("scene relative overflow-hidden rounded-[14px] bg-[oklch(0.215_0.03_265)] p-4 text-[oklch(0.985_0.003_248)] shadow-[0_24px_48px_-20px_oklch(0.05_0.03_265/0.7)]", className)}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold">{t.title}</p>
        <p className="text-xs font-semibold text-[oklch(0.78_0.15_150)]">{t.status}</p>
      </div>
      <svg viewBox="0 0 300 160" className="mt-2 w-full" aria-hidden="true">
        <g stroke="oklch(0.3 0.035 265)" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M0 120 C90 118 180 132 300 116" />
          <path d="M60 0 V160" />
          <path d="M0 64 C100 70 200 52 300 60" />
          <path d="M210 0 C200 60 222 110 206 160" />
        </g>
        <path d={DELIVERY_ROUTE} fill="none" stroke="oklch(0.68 0.17 258)" strokeWidth="3" strokeLinecap="round" pathLength={1} className="scene-route" />
        <circle cx="34" cy="128" r="6" fill="oklch(0.985 0.003 248)" />
        <circle cx="268" cy="40" r="9" fill="oklch(0.68 0.17 258 / 0.3)" />
        <circle cx="268" cy="40" r="5" fill="oklch(0.985 0.003 248)" />
        {animate ? (
          <g>
            <circle r="8" fill="#25D366" stroke="white" strokeWidth="2.5" />
            <animateMotion ref={motionRef} dur="2.6s" begin="indefinite" fill="freeze" path={DELIVERY_ROUTE} keySplines="0.65 0 0.35 1" keyTimes="0;1" calcMode="spline" />
          </g>
        ) : (
          <circle cx="268" cy="40" r="8" fill="#25D366" stroke="white" strokeWidth="2.5" />
        )}
      </svg>
      <div className="mt-1 flex items-center justify-between text-xs text-[oklch(0.78_0.03_257)]">
        <span className="inline-flex items-center gap-1"><Store className="h-3.5 w-3.5" aria-hidden="true" />{t.from}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{t.to}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="scene-slide inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.27_0.04_264)] px-2.5 py-1" style={{ animationDelay: "2.6s" }}>
          <Bike className="h-3.5 w-3.5 text-[oklch(0.68_0.17_258)]" aria-hidden="true" />
          {t.eta}
        </span>
        <span className="scene-slide inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.27_0.04_264)] px-2.5 py-1" style={{ animationDelay: "2.9s" }}>
          <Check className="h-3.5 w-3.5 text-[oklch(0.78_0.15_150)]" aria-hidden="true" />
          {t.paid}
        </span>
      </div>
    </div>
  )
}

const dashboardCopy = {
  es: {
    title: "Pipeline comercial",
    today: "Datos de hoy",
    chart: "Leads por canal",
    channels: ["CRM", "Portal", "Campañas"],
    leads: [
      { name: "Apto. 3 hab · Este", source: "Portal" },
      { name: "Local comercial", source: "CRM" },
      { name: "Casa · Oeste", source: "Campañas" },
    ],
    hot: "Caliente",
  },
  en: {
    title: "Sales pipeline",
    today: "Today's data",
    chart: "Leads by channel",
    channels: ["CRM", "Portal", "Ads"],
    leads: [
      { name: "3-bed apt · East", source: "Portal" },
      { name: "Retail space", source: "CRM" },
      { name: "House · West", source: "Ads" },
    ],
    hot: "Hot",
  },
}

const BARS = [
  [46, 62, 38],
  [58, 74, 44],
  [64, 88, 52],
]

export function DashboardScene({ play, lang, className }: SceneProps) {
  const t = dashboardCopy[lang]
  return (
    <div data-play={play} className={cn("scene relative rounded-[14px] bg-white p-4 text-[oklch(0.17_0.025_265)] shadow-[0_24px_48px_-20px_oklch(0.1_0.03_265/0.55)]", className)}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold">{t.title}</p>
        <p className="text-xs text-[oklch(0.446_0.037_257)]">{t.today}</p>
      </div>
      <p className="mt-3 text-xs font-semibold text-[oklch(0.446_0.037_257)]">{t.chart}</p>
      <div className="mt-2 flex h-24 items-end gap-3 border-b border-[oklch(0.929_0.013_255)] pb-px">
        {BARS.map((group, g) => (
          <div key={g} className="flex h-full flex-1 items-end gap-1">
            {group.map((h, i) => (
              <span
                key={i}
                className="scene-grow block flex-1 rounded-t-[4px]"
                style={{
                  height: `${h}%`,
                  background: ["var(--primary)", "oklch(0.68 0.17 258)", "oklch(0.85 0.06 258)"][i],
                  animationDelay: `${0.3 + g * 0.25 + i * 0.08}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-[oklch(0.446_0.037_257)]">
        {t.channels.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: ["var(--primary)", "oklch(0.68 0.17 258)", "oklch(0.85 0.06 258)"][i] }} />
            {c}
          </span>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {t.leads.map((lead, i) => (
          <li key={lead.name} className="scene-slide flex items-center justify-between gap-2 rounded-lg bg-[oklch(0.965_0.006_255)] px-2.5 py-2 text-xs" style={{ animationDelay: `${1.3 + i * 0.3}s` }}>
            <span className="min-w-0 truncate font-semibold">{lead.name}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-[oklch(0.446_0.037_257)]">{lead.source}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.05_45)] px-2 py-0.5 font-semibold text-[oklch(0.5_0.16_40)]">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {t.hot}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const chatCopy = {
  es: {
    name: "Hotel · Asistente",
    online: "en línea",
    messages: [
      { from: "guest", text: "Hola, ¿tienen habitación doble para el viernes?" },
      { from: "bot", text: "¡Hola! Sí, tenemos disponibilidad para el viernes. ¿A nombre de quién la reservo?" },
      { from: "guest", text: "A nombre de Laura, por favor." },
      { from: "bot", text: "Listo, Laura. Tu reserva quedó confirmada." },
    ],
    human: "Si lo necesitas, te paso con recepción.",
  },
  en: {
    name: "Hotel · Assistant",
    online: "online",
    messages: [
      { from: "guest", text: "Hi, do you have a double room for Friday?" },
      { from: "bot", text: "Hi! Yes, we have availability on Friday. Whose name should I book it under?" },
      { from: "guest", text: "Laura, please." },
      { from: "bot", text: "Done, Laura. Your reservation is confirmed." },
    ],
    human: "If you need it, I can hand you over to the front desk.",
  },
}

export function ChatScene({ play, lang, className }: SceneProps) {
  const t = chatCopy[lang]
  return (
    <div data-play={play} className={cn("scene relative overflow-hidden rounded-[14px] bg-[oklch(0.95_0.012_120)] text-[oklch(0.17_0.025_265)] shadow-[0_24px_48px_-20px_oklch(0.1_0.03_265/0.55)]", className)}>
      <div className="flex items-center gap-2.5 bg-[oklch(0.42_0.08_170)] px-4 py-3 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
          <WhatsAppIcon className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-white/75">{t.online}</p>
        </div>
      </div>
      <div className="space-y-2 p-3">
        {t.messages.map((m, i) => (
          <p
            key={i}
            className={cn(
              "scene-slide max-w-[82%] rounded-xl px-3 py-2 text-xs leading-snug shadow-[0_1px_1px_oklch(0_0_0/0.08)]",
              m.from === "guest" ? "ml-auto rounded-tr-sm bg-[oklch(0.92_0.08_140)]" : "rounded-tl-sm bg-white",
            )}
            style={{ animationDelay: `${0.3 + i * 0.7}s` }}
          >
            {m.text}
            {i === t.messages.length - 1 && <Check className="ml-1 inline h-3.5 w-3.5 text-[oklch(0.5_0.14_150)]" aria-hidden="true" />}
          </p>
        ))}
        <p className="scene-slide max-w-[82%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-xs leading-snug text-[oklch(0.446_0.037_257)]" style={{ animationDelay: "3.2s" }}>
          {t.human}
        </p>
      </div>
    </div>
  )
}
