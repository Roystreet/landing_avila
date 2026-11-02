"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { WHATSAPP_URL } from "@/lib/contact"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"

// Acceso directo a WhatsApp, el canal habitual de nuestros clientes en la región.
// Aparece tras el primer pantallazo y se oculta mientras hay un botón de WhatsApp visible en la página.
export function WhatsAppButton() {
  const { lang } = useLanguage()
  const label = lang === "es" ? "Escribir por WhatsApp" : "Message us on WhatsApp"
  const [scrolled, setScrolled] = useState(false)
  const [inlineVisible, setInlineVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
      setInlineVisible(visible.size > 0)
    })
    const observeAll = () => document.querySelectorAll("[data-wa-inline]").forEach((el) => io.observe(el))
    observeAll()
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  const shown = scrolled && !inlineVisible

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={cn(
        "group fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-12px_oklch(0.1_0.03_265/0.6)] transition-[background-color,opacity,transform] duration-300 hover:bg-[#1EBE5A] sm:bottom-6 sm:right-6",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
