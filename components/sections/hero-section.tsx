"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Code, Smartphone, Cloud, Database, Brain, Zap, Rocket, ChevronDown } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

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
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 animate-bounce">
            🚀 Consultora Especializada en Software de Vanguardia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Transformamos Ideas en
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
              {" "}
              Soluciones Digitales
            </span>{" "}
            Revolucionarias
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Somos Avila System, tu socio estratégico en desarrollo de software de élite. Creamos aplicaciones web,
            móviles y sistemas empresariales que no solo impulsan el crecimiento, sino que redefinen industrias
            completas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              Iniciar Proyecto Épico
              <Rocket className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Ver Portafolio Rockstar
            </Button>
          </div>

          <div className="flex justify-center space-x-8 opacity-60">
            {[Code, Smartphone, Cloud, Database, Brain, Zap].map((Icon, index) => (
              <div
                key={index}
                className={`p-3 bg-primary/10 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/20 animate-bounce`}
                style={{ animationDelay: `${index * 200}ms` }}
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
