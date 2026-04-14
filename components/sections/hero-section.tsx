"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Code, Smartphone, Cloud, Database, Brain, Zap, Rocket, ChevronDown, Sparkles } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const copy = {
  es: {
    badge: "Consultora de software a medida",
    titleA: "Transformamos ideas en",
    titleHighlight: "soluciones digitales",
    titleB: "que funcionan",
    description:
      "Somos Avila System. Diseñamos, construimos y operamos aplicaciones web, móviles, sistemas empresariales y agentes de IA — con ingeniería sólida y entregas disciplinadas.",
    ctaPrimary: "Iniciar proyecto",
    ctaSecondary: "Ver casos de éxito",
  },
  en: {
    badge: "Custom software consultancy",
    titleA: "We turn ideas into",
    titleHighlight: "digital solutions",
    titleB: "that actually work",
    description:
      "We are Avila System. We design, build and operate web apps, mobile apps, enterprise systems and AI agents — with solid engineering and disciplined delivery.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See success stories",
  },
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { lang } = useLanguage()
  const t = copy[lang]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="hero"
      className="py-20 lg:py-32 bg-gradient-to-br from-background via-muted/30 to-primary/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            <Sparkles className="h-3 w-3 mr-1" />
            {t.badge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            {t.titleA}{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>{" "}
            {t.titleB}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/cotizacion">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl group w-full sm:w-auto"
              >
                {t.ctaPrimary}
                <Rocket className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
            <Link href="/casos-de-exito">
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-muted bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
              >
                {t.ctaSecondary}
              </Button>
            </Link>
          </div>

          <div className="flex justify-center space-x-8 opacity-60">
            {[Code, Smartphone, Cloud, Database, Brain, Zap].map((Icon, index) => (
              <div
                key={index}
                className="p-3 bg-primary/10 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/20"
              >
                <Icon className="h-6 w-6 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  )
}
