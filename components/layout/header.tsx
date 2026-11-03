"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Logo } from "@/components/brand/logo"
import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

const nav = {
  es: {
    services: "Servicios",
    cases: "Proyectos",
    pricing: "Precios",
    mission: "Misión",
    about: "Nosotros",
    contact: "Contacto",
    lab: "Lab",
    cta: "Cotizar mi proyecto",
    menu: "Abrir menú",
    close: "Cerrar menú",
  },
  en: {
    services: "Services",
    cases: "Projects",
    pricing: "Pricing",
    mission: "Mission",
    about: "About",
    contact: "Contact",
    lab: "Lab",
    cta: "Quote my project",
    menu: "Open menu",
    close: "Close menu",
  },
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = nav[lang]

  useEffect(() => setIsMenuOpen(false), [pathname])

  const navItems = [
    { href: "/servicios", label: t.services },
    { href: "/casos-de-exito", label: t.cases },
    { href: "/precios", label: t.pricing },
    { href: "/mision", label: t.mission },
    { href: "/nosotros", label: t.about },
    { href: "/contacto", label: t.contact },
    { href: "/lab", label: t.lab },
  ]
  const isActive = (href: string) => pathname === href || (href === "/lab" && pathname.startsWith("/lab/"))

  return (
    <header className="dark fixed top-0 z-50 w-full border-b border-border bg-background text-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Avila System, inicio" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:rounded-full after:bg-primary",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link
            href="/cotizacion"
            className="group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] md:inline-flex"
          >
            {t.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? t.close : t.menu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <nav aria-label="Principal" className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive(item.href) && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3">
              <Link
                href="/cotizacion"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                {t.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <LanguageToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
