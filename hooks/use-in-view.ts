"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Marca un elemento como visible la primera vez que entra al viewport.
 * `inView` es undefined hasta hidratar, para que sin JS se vea el estado final.
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    setInView(false)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold])

  return { ref, inView }
}
