"use client"

import { useEffect, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import type { Language } from "@/components/providers/language-provider"
import type { CaseMetric } from "@/lib/cases"

/** Cifra que cuenta desde 0 al entrar en pantalla. Sin JS o con "reducir movimiento" muestra el valor final. */
export function CountUp({ metric, lang, className }: { metric: CaseMetric; lang: Language; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6)
  const target = metric.value ?? 0
  const [current, setCurrent] = useState(target)

  useEffect(() => {
    if (metric.value === undefined || inView === undefined) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!inView) {
      setCurrent(0)
      return
    }
    const start = performance.now()
    const duration = 1400
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setCurrent(target * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, metric.value, target])

  // Mismo formato que los casos publicados: punto decimal; miles con punto en ES y coma en EN
  const format = (n: number) => {
    const [int, dec] = n.toFixed(metric.decimals ?? 0).split(".")
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === "es" ? "." : ",")
    return `${metric.prefix ?? ""}${dec ? `${grouped}.${dec}` : grouped}${metric.suffix ?? ""}`
  }
  const formatted = metric.text ?? format(current)
  const final = metric.text ?? format(target)

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{formatted}</span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
