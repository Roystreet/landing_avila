"use client"

import { FormEvent, useMemo, useState } from "react"
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
import { useLanguage } from "@/components/providers/language-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const copy = {
  es: {
    badge: "Cotización personalizada",
    title: "Cuéntanos tu proyecto y te",
    titleHighlight: "preparamos una propuesta",
    intro:
      "Llena el formulario con los detalles de lo que necesitas. Mientras más claro seas sobre el alcance, más precisa será nuestra estimación.",
    perks: [
      {
        title: "Respuesta en 24h hábiles",
        description: "Revisamos tu caso y te devolvemos una propuesta inicial en el próximo día laboral.",
      },
      {
        title: "Propuesta detallada por escrito",
        description: "Alcance, entregables, tiempos, equipo asignado y presupuesto — todo documentado.",
      },
      {
        title: "Sin compromiso",
        description: "La cotización es gratuita. Si no seguimos adelante, no hay costos ocultos.",
      },
    ],
    step1Title: "¿Qué tipo de proyecto necesitas?",
    step1Hint: "(puedes seleccionar varios)",
    services: [
      { id: "web", label: "Desarrollo Web" },
      { id: "apps", label: "Aplicaciones" },
      { id: "sistemas", label: "Sistemas Web" },
      { id: "cloud", label: "Cloud / DevOps" },
      { id: "ia", label: "Agentes de IA" },
      { id: "otro", label: "Otro / A medida" },
    ],
    step2Title: "Describe tu proyecto",
    projectName: "Nombre del proyecto o producto",
    projectDesc:
      "Objetivos, usuarios, funcionalidades clave, integraciones necesarias, diseño existente o inspiración...",
    timelinePlaceholder: "Plazo estimado",
    budgetPlaceholder: "Presupuesto disponible (USD)",
    timelines: [
      "Urgente (menos de 1 mes)",
      "1 - 3 meses",
      "3 - 6 meses",
      "Más de 6 meses",
      "Flexible",
    ],
    budgetRanges: [
      "Menos de $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "Por definir",
    ],
    step3Title: "¿Cómo te contactamos?",
    fullName: "Nombre completo",
    company: "Empresa (opcional)",
    email: "Email de contacto",
    phone: "Teléfono o WhatsApp",
    consent:
      "Al enviar, aceptas que nos pongamos en contacto contigo para discutir tu proyecto. Tu información no será compartida con terceros.",
    submit: "Enviar solicitud",
    sending: "Enviando...",
    successMessage: "Solicitud enviada con exito. Te responderemos con una propuesta inicial en menos de 24h habiles.",
    errorMessage: "No pudimos enviar la solicitud. Verifica los datos e intenta de nuevo.",
    missingFieldsIntro: "Completa estos campos para continuar:",
    projectDescriptionTooShort: "Describe mejor tu proyecto. Necesitamos al menos 10 caracteres.",
    fieldLabels: {
      services: "Tipo de proyecto",
      projectName: "Nombre del proyecto",
      projectDescription: "Descripcion del proyecto",
      timeline: "Plazo estimado",
      budget: "Presupuesto",
      fullName: "Nombre completo",
      email: "Email de contacto",
      phone: "Telefono o WhatsApp",
    },
  },
  en: {
    badge: "Custom quote",
    title: "Tell us about your project and we'll",
    titleHighlight: "send you a proposal",
    intro:
      "Fill out the form with the details of what you need. The clearer you are about scope, the more precise our estimate will be.",
    perks: [
      {
        title: "Reply within 24 business hours",
        description: "We review your case and come back with an initial proposal the next business day.",
      },
      {
        title: "Detailed written proposal",
        description: "Scope, deliverables, timeline, assigned team and budget — all documented.",
      },
      {
        title: "No commitment",
        description: "The quote is free. If we don't move forward, there are no hidden costs.",
      },
    ],
    step1Title: "What type of project do you need?",
    step1Hint: "(you can select multiple)",
    services: [
      { id: "web", label: "Web Development" },
      { id: "apps", label: "Applications" },
      { id: "sistemas", label: "Web Systems" },
      { id: "cloud", label: "Cloud / DevOps" },
      { id: "ia", label: "AI Agents" },
      { id: "otro", label: "Other / Custom" },
    ],
    step2Title: "Describe your project",
    projectName: "Project or product name",
    projectDesc:
      "Goals, users, key features, required integrations, existing design or inspiration...",
    timelinePlaceholder: "Estimated timeline",
    budgetPlaceholder: "Available budget (USD)",
    timelines: [
      "Urgent (less than 1 month)",
      "1 - 3 months",
      "3 - 6 months",
      "More than 6 months",
      "Flexible",
    ],
    budgetRanges: [
      "Less than $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "To be defined",
    ],
    step3Title: "How should we reach you?",
    fullName: "Full name",
    company: "Company (optional)",
    email: "Contact email",
    phone: "Phone or WhatsApp",
    consent:
      "By submitting, you agree that we may contact you to discuss your project. Your information will not be shared with third parties.",
    submit: "Send request",
    sending: "Sending...",
    successMessage: "Request sent successfully. We will reply with an initial proposal within 24 business hours.",
    errorMessage: "We could not send the request. Please review your data and try again.",
    missingFieldsIntro: "Please complete these fields to continue:",
    projectDescriptionTooShort: "Please add more detail about your project. We need at least 10 characters.",
    fieldLabels: {
      services: "Project type",
      projectName: "Project name",
      projectDescription: "Project description",
      timeline: "Estimated timeline",
      budget: "Budget",
      fullName: "Full name",
      email: "Contact email",
      phone: "Phone or WhatsApp",
    },
  },
}

const serviceIcons = [Globe, Smartphone, LayoutDashboard, Cloud, Bot, Wrench]
const perkIcons = [Clock, FileText, CheckCircle2]
const PROJECT_DESCRIPTION_MIN_LENGTH = 10

export default function QuoteSection() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [timelineValue, setTimelineValue] = useState("")
  const [budgetValue, setBudgetValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  const statusClassName = useMemo(() => {
    if (status.type === "success") {
      return "text-green-700 bg-green-50 border border-green-200"
    }

    if (status.type === "error") {
      return "text-red-700 bg-red-50 border border-red-200"
    }

    return ""
  }, [status.type])

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      services: selectedServices,
      projectName: String(formData.get("projectName") || ""),
      projectDescription: String(formData.get("projectDescription") || ""),
      timeline: String(formData.get("timeline") || ""),
      budget: String(formData.get("budget") || ""),
      fullName: String(formData.get("fullName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      hp: String(formData.get("hp") || ""),
    }

    const missingFields: Array<keyof typeof t.fieldLabels> = []

    if (payload.services.length === 0) missingFields.push("services")
    if (!payload.projectName.trim()) missingFields.push("projectName")
    if (!payload.projectDescription.trim()) missingFields.push("projectDescription")
    if (!payload.timeline.trim()) missingFields.push("timeline")
    if (!payload.budget.trim()) missingFields.push("budget")
    if (!payload.fullName.trim()) missingFields.push("fullName")
    if (!payload.email.trim()) missingFields.push("email")
    if (!payload.phone.trim()) missingFields.push("phone")

    if (missingFields.length > 0) {
      const fieldsText = missingFields.map((field) => t.fieldLabels[field]).join(", ")
      setStatus({ type: "error", message: `${t.missingFieldsIntro} ${fieldsText}.` })
      return
    }

    if (payload.projectDescription.trim().length < PROJECT_DESCRIPTION_MIN_LENGTH) {
      setStatus({ type: "error", message: t.projectDescriptionTooShort })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: "idle", message: "" })

    try {
      const response = await fetch("/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => null)) as {
        message?: string
        missingFields?: string[]
        fieldErrors?: Record<string, string[] | undefined>
      } | null

      if (!response.ok) {
        if (result?.missingFields?.length) {
          const fieldsText = result.missingFields
            .map((field) => t.fieldLabels[field as keyof typeof t.fieldLabels] || field)
            .join(", ")
          setStatus({ type: "error", message: `${t.missingFieldsIntro} ${fieldsText}.` })
          return
        }

        const projectDescriptionError = result?.fieldErrors?.projectDescription?.[0]

        if (projectDescriptionError) {
          setStatus({ type: "error", message: projectDescriptionError })
          return
        }

        const firstFieldError = Object.values(result?.fieldErrors || {}).flat().find(Boolean)

        if (firstFieldError) {
          setStatus({ type: "error", message: firstFieldError })
          return
        }

        setStatus({ type: "error", message: result?.message || t.errorMessage })
        return
      }

      form.reset()
      setSelectedServices([])
      setTimelineValue("")
      setBudgetValue("")
      setStatus({ type: "success", message: result?.message || t.successMessage })
    } catch {
      setStatus({ type: "error", message: t.errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="cotizacion" className="py-20 bg-linear-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Calculator className="h-3 w-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t.title} <span className="text-primary">{t.titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">{t.intro}</p>
          </div>

          {/* Perks */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {t.perks.map((p, i) => {
              const Icon = perkIcons[i]
              return (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quote form */}
          <Card className="bg-card border-border shadow-2xl">
            <CardContent className="p-6 md:p-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Step 1: Service type */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step1Title}</h3>
                    <span className="text-xs text-muted-foreground">{t.step1Hint}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {t.services.map((service, i) => {
                      const Icon = serviceIcons[i]
                      const isActive = selectedServices.includes(service.id)
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex cursor-pointer items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${isActive
                            ? "bg-primary/10 border-primary text-primary shadow-md shadow-primary/10"
                            : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium text-left">{service.label}</span>
                          {isActive && (
                            <CheckCircle2 className="h-4 w-4 ml-auto text-primary shrink-0" />
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
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step2Title}</h3>
                  </div>
                  <div className="space-y-4">
                    <input
                      name="projectName"
                      type="text"
                      placeholder={t.projectName}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <textarea
                      name="projectDescription"
                      placeholder={t.projectDesc}
                      rows={5}
                      minLength={PROJECT_DESCRIPTION_MIN_LENGTH}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground resize-none transition-all duration-300"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative rounded-2xl border border-border/70 bg-linear-to-br from-background via-background to-primary/5 p-px shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-within:border-primary/60 focus-within:shadow-lg focus-within:shadow-primary/10">
                        <div className="relative rounded-[calc(var(--radius-2xl)-1px)] bg-background/95 backdrop-blur">
                          <div className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-primary/10 bg-primary/8 text-primary">
                            <Clock className="h-4 w-4" />
                          </div>
                          <input type="hidden" name="timeline" value={timelineValue} />
                          <Select value={timelineValue} onValueChange={setTimelineValue}>
                            <SelectTrigger
                              aria-label={t.timelinePlaceholder}
                              className={cn(
                                "h-auto w-full rounded-[calc(var(--radius-2xl)-1px)] border-0 bg-transparent py-4 pr-12 pl-16 text-left text-sm font-medium shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                                timelineValue ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder={t.timelinePlaceholder} />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/80 bg-popover/98 text-popover-foreground shadow-2xl shadow-primary/10 backdrop-blur-md">
                              {t.timelines.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  className="rounded-xl px-3 py-2 text-sm text-popover-foreground focus:bg-primary focus:text-primary-foreground data-[state=checked]:bg-primary/12 data-[state=checked]:text-foreground"
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="relative rounded-2xl border border-border/70 bg-linear-to-br from-background via-background to-primary/5 p-px shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-within:border-primary/60 focus-within:shadow-lg focus-within:shadow-primary/10">
                        <div className="relative rounded-[calc(var(--radius-2xl)-1px)] bg-background/95 backdrop-blur">
                          <div className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-primary/10 bg-primary/8 text-primary">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <input type="hidden" name="budget" value={budgetValue} />
                          <Select value={budgetValue} onValueChange={setBudgetValue}>
                            <SelectTrigger
                              aria-label={t.budgetPlaceholder}
                              className={cn(
                                "h-auto w-full rounded-[calc(var(--radius-2xl)-1px)] border-0 bg-transparent py-4 pr-12 pl-16 text-left text-sm font-medium shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                                budgetValue ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder={t.budgetPlaceholder} />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/80 bg-popover/98 text-popover-foreground shadow-2xl shadow-primary/10 backdrop-blur-md">
                              {t.budgetRanges.map((b) => (
                                <SelectItem
                                  key={b}
                                  value={b}
                                  className="rounded-xl px-3 py-2 text-sm text-popover-foreground focus:bg-primary focus:text-primary-foreground data-[state=checked]:bg-primary/12 data-[state=checked]:text-foreground"
                                >
                                  {b}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step3Title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      name="fullName"
                      type="text"
                      placeholder={t.fullName}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="company"
                      type="text"
                      placeholder={t.company}
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder={t.email}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t.phone}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  name="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {status.message ? <p className={`text-sm rounded-lg px-4 py-3 ${statusClassName}`}>{status.message}</p> : null}

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground text-center sm:text-left">{t.consent}</p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group whitespace-nowrap"
                  >
                    {isSubmitting ? t.sending : t.submit}
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
