"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calculator,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  Send,
  Globe,
  Smartphone,
  LayoutDashboard,
  Cloud,
  Bot,
  Wrench,
} from "lucide-react"

const serviceTypes = [
  { id: "web", label: "Desarrollo Web", icon: Globe },
  { id: "apps", label: "Aplicaciones", icon: Smartphone },
  { id: "sistemas", label: "Sistemas Web", icon: LayoutDashboard },
  { id: "cloud", label: "Cloud / DevOps", icon: Cloud },
  { id: "ia", label: "Agentes de IA", icon: Bot },
  { id: "otro", label: "Otro / A medida", icon: Wrench },
]

const budgetRanges = [
  "Menos de $2,000",
  "$2,000 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000 +",
  "Por definir",
]

const timelines = [
  "Urgente (menos de 1 mes)",
  "1 - 3 meses",
  "3 - 6 meses",
  "Más de 6 meses",
  "Flexible",
]

export default function QuoteSection() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const perks = [
    {
      icon: Clock,
      title: "Respuesta en 24h hábiles",
      description: "Revisamos tu caso y te devolvemos una propuesta inicial en el próximo día laboral.",
    },
    {
      icon: FileText,
      title: "Propuesta detallada por escrito",
      description: "Alcance, entregables, tiempos, equipo asignado y presupuesto — todo documentado.",
    },
    {
      icon: CheckCircle2,
      title: "Sin compromiso",
      description: "La cotización es gratuita. Si no seguimos adelante, no hay costos ocultos.",
    },
  ]

  return (
    <section id="cotizacion" className="py-20 bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Calculator className="h-3 w-3 mr-1" />
              Cotización personalizada
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Cuéntanos tu proyecto y te <span className="text-primary">preparamos una propuesta</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Llena el formulario con los detalles de lo que necesitas. Mientras más claro seas sobre el alcance, más
              precisa será nuestra estimación.
            </p>
          </div>

          {/* Perks */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {perks.map((p, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quote form */}
          <Card className="bg-card border-border shadow-2xl">
            <CardContent className="p-6 md:p-10">
              <form className="space-y-8">
                {/* Step 1: Service type */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      ¿Qué tipo de proyecto necesitas?
                    </h3>
                    <span className="text-xs text-muted-foreground">(puedes seleccionar varios)</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceTypes.map((service) => {
                      const isActive = selectedServices.includes(service.id)
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${
                            isActive
                              ? "bg-primary/10 border-primary text-primary shadow-md shadow-primary/10"
                              : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <service.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium text-left">{service.label}</span>
                          {isActive && (
                            <CheckCircle2 className="h-4 w-4 ml-auto text-primary flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 2: Scope */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Describe tu proyecto</h3>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre del proyecto o producto"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <textarea
                      placeholder="Objetivos, usuarios, funcionalidades clave, integraciones necesarias, diseño existente o inspiración..."
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground resize-none transition-all duration-300"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300 appearance-none">
                          <option value="">Plazo estimado</option>
                          {timelines.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300 appearance-none">
                          <option value="">Presupuesto disponible (USD)</option>
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">¿Cómo te contactamos?</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Empresa (opcional)"
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      type="email"
                      placeholder="Email de contacto"
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono o WhatsApp"
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground text-center sm:text-left">
                    Al enviar, aceptas que nos pongamos en contacto contigo para discutir tu proyecto. Tu información
                    no será compartida con terceros.
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group whitespace-nowrap"
                  >
                    Enviar solicitud
                    <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
