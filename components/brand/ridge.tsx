import { cn } from "@/lib/utils"

// Silueta del Ávila vista desde Caracas (oeste → este): la Silla con sus dos picos
// y el Naiguatá como cumbre más alta. Coordenadas en un lienzo de 1440 × 200.
export const RIDGE_POINTS: [number, number][] = [
  [0, 168], [70, 160], [150, 150], [220, 141], [290, 128], [350, 120], [410, 108],
  [460, 112], [515, 94], [565, 82], [612, 66], [646, 54], [672, 70], [694, 62],
  [722, 44], [752, 64], [800, 78], [850, 72], [905, 56], [952, 46], [1004, 32],
  [1046, 46], [1104, 64], [1172, 80], [1244, 98], [1320, 118], [1396, 138], [1440, 146],
]
export const SUMMIT = { x: 1004, y: 32 }

export const RIDGE_LINE = "M" + RIDGE_POINTS.map(([x, y]) => `${x} ${y}`).join(" L")
export const RIDGE_FILL = `${RIDGE_LINE} L1440 200 L0 200Z`

export function Ridge({
  className,
  draw = false,
}: {
  className?: string
  draw?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none block w-full", className)}
    >
      <path d={RIDGE_FILL} fill="var(--ridge-fill, oklch(0.215 0.03 265))" />
      <path
        d={RIDGE_LINE}
        fill="none"
        stroke="var(--ridge-line, oklch(0.68 0.17 258))"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className={draw ? "ridge-draw" : undefined}
      />
    </svg>
  )
}
