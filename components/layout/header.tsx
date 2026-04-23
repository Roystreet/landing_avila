"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useLanguage } from "@/components/providers/language-provider"

const nav = {
  es: {
    services: "Servicios",
    pricing: "Precios",
    mission: "Misión",
    cases: "Casos de Éxito",
    quote: "Cotizar",
    contact: "Contacto",
    cta: "Cotiza tu proyecto",
  },
  en: {
    services: "Services",
    pricing: "Pricing",
    mission: "Mission",
    cases: "Success Stories",
    quote: "Get a Quote",
    contact: "Contact",
    cta: "Request a quote",
  },
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = nav[lang]

  const navItems = [
    { href: "/servicios", label: t.services },
    { href: "/precios", label: t.pricing },
    { href: "/mision", label: t.mission },
    { href: "/casos-de-exito", label: t.cases },
    { href: "/cotizacion", label: t.quote },
    { href: "/contacto", label: t.contact },
  ]

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 fixed top-0 w-full z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo_marillo.png"
                alt="Logo de Avila System"
                fill
                sizes="48px"
                className="object-contain p-0.5 scale-110"
                priority
              />
            </div>
            <span className="text-xl font-bold text-foreground">Avila System</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm text-muted-foreground hover:text-foreground transition-all duration-300 relative ${pathname === item.href ? "text-primary" : ""
                  }`}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right cluster: toggles + CTA */}
          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block ml-2">
              <Link href="/cotizacion">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                  {t.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors ${pathname === item.href ? "text-primary bg-primary/10" : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <div className="px-4 pt-2">
                <Link href="/cotizacion">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {t.cta}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
