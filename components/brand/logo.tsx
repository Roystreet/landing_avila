import { useId } from "react"
import { cn } from "@/lib/utils"

// Trazados oficiales de public/brand/avila-system-logo.svg (monograma + "ÁVILA" + "SYSTEM").
const MARK =
  "M227 206 L308.8 82.6 C310.2 80.3 311.6 79 314 79 H317 C319.3 79 320.7 80.5 322.1 82.7 L409 222 L306 191 C319 191.8 342 201.1 362 207 L325 143 C322.4 137.9 320.1 135.8 316.2 139.2 C290 162.9 258.4 185.2 227 206 Z"
const LETTER_A = "M0 42 L31.2 2.1 C32.7 .1 34.2 -1 36.5 -1 C38.8 -1 40.3 .1 41.8 2.1 L73 42 H63.9 L36.5 7.4 L9.1 42 Z"
const LETTER_S =
  "M4.5 0 H13.5 C16.4 0 18 1.5 18 4 H16.1 C16.1 2.6 15.2 1.8 13.4 1.8 H4.6 C2.7 1.8 1.8 2.5 1.8 3.9 C1.8 5.3 2.7 6 4.6 6 H13.2 C16.3 6 18 7.3 18 10 C18 12.7 16.3 14 13.2 14 H4.8 C1.7 14 0 12.5 0 10 H1.9 C1.9 11.5 2.8 12.2 4.8 12.2 H13.1 C15.2 12.2 16.2 11.5 16.2 10 C16.2 8.5 15.2 7.8 13.1 7.8 H4.8 C1.7 7.8 0 6.5 0 3.9 C0 1.3 1.6 0 4.5 0 Z"

function MarkPaths({ uid, mono }: { uid: string; mono?: boolean }) {
  if (mono) return <path d={MARK} fill="currentColor" />
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-s`} gradientUnits="userSpaceOnUse" x1="280" y1="79" x2="370" y2="222">
          <stop offset="0" stopColor="#F8FAFC" />
          <stop offset="0.38" stopColor="#E3E8EF" />
          <stop offset="0.76" stopColor="#A3AEBC" />
          <stop offset="1" stopColor="#75859B" />
        </linearGradient>
        <linearGradient id={`${uid}-b`} gradientUnits="userSpaceOnUse" x1="310" y1="184" x2="409" y2="222">
          <stop offset="0" stopColor="#2563EB" stopOpacity="0" />
          <stop offset="0.55" stopColor="#2563EB" stopOpacity="0" />
          <stop offset="0.83" stopColor="#2563EB" stopOpacity="0.42" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d={MARK} fill={`url(#${uid}-s)`} />
      <path d={MARK} fill={`url(#${uid}-b)`} />
    </>
  )
}

function Wordmark() {
  return (
    <g fill="currentColor">
      <path transform="translate(134 249)" d={LETTER_A} />
      <path transform="translate(168 236)" d="M0 8 H4.5 L12 0 H5.2 Z" />
      <path
        transform="translate(228 249)"
        d="M0 0 H9.5 L34.5 33.4 L59.5 0 H69 L40 39.7 C38.5 41.7 36.8 42.7 34.5 42.7 C32.2 42.7 30.5 41.7 29 39.7 Z"
      />
      <path transform="translate(323 249)" d="M0 0 H8 V42 H0 Z" />
      <path transform="translate(365 249)" d="M0 0 H8.3 V34.2 H41.7 L37.9 42 H7.6 C2.3 42 0 39.5 0 34.4 Z" />
      <path transform="translate(428 249)" d={LETTER_A} />
      <g opacity="0.82">
        <path transform="translate(205 315)" d={LETTER_S} />
        <path transform="translate(246 315)" d="M0 0 H2.6 L9 6.6 L15.4 0 H18 L9.9 8.5 V14 H8.1 V8.5 Z" />
        <path transform="translate(287 315)" d={LETTER_S} />
        <path transform="translate(328 315)" d="M0 0 H18 V1.8 H9.9 V14 H8.1 V1.8 H0 Z" />
        <path transform="translate(369 315)" d="M0 0 H16 V1.8 H1.8 V5.9 H14.6 V7.7 H1.8 V12.2 H16 V14 H0 Z" />
        <path transform="translate(410 315)" d="M0 14 V0 H2.2 L10 10.5 L17.8 0 H20 V14 H18.2 V3.2 L10.8 13 H9.2 L1.8 3.2 V14 Z" />
      </g>
    </g>
  )
}

/** Isotipo oficial. `mono` lo dibuja en currentColor para fondos claros. */
export function LogoMark({ className, mono }: { className?: string; mono?: boolean }) {
  const uid = useId().replace(/:/g, "")
  return (
    <svg viewBox="222 74 192 153" aria-hidden="true" className={cn("h-7 w-auto", className)}>
      <MarkPaths uid={uid} mono={mono} />
    </svg>
  )
}

/** Logo horizontal: isotipo + "ÁVILA / SYSTEM" con los trazados oficiales. */
export function Logo({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "")
  return (
    <span className={cn("inline-flex items-center text-foreground", className)}>
      <svg viewBox="0 0 520 96" aria-hidden="true" className="h-9 w-auto">
        <g transform="translate(0 2) scale(0.62) translate(-227 -79)">
          <MarkPaths uid={uid} />
        </g>
        <g transform="translate(150 0) translate(-134 -236)">
          <Wordmark />
        </g>
      </svg>
      <span className="sr-only">Avila System</span>
    </span>
  )
}

/** Logo apilado oficial (isotipo sobre el nombre), para cierres y piezas grandes. */
export function LogoStacked({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "")
  return (
    <span className={cn("inline-flex text-foreground", className)}>
      <svg viewBox="122 70 392 270" aria-hidden="true" className="h-full w-auto">
        <MarkPaths uid={uid} />
        <Wordmark />
      </svg>
      <span className="sr-only">Avila System</span>
    </span>
  )
}
