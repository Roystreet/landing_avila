"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"
import { useLanguage } from "@/components/providers/language-provider"
import { trackContactLeadConversion, trackQuoteLeadConversion } from "@/lib/gtag"

const copy = {
    es: {
        titleA: "Gracias por",
        titleHighlight: "escribirnos",
        subtitle:
            "Recibimos tu solicitud. Nuestro equipo revisará los detalles y te responderá por el canal que indicaste lo antes posible.",
        cardTitle: "Siguiente paso",
        cardBody:
            "Si tu solicitud fue una cotización, prepararemos una respuesta inicial con el contexto disponible. Si fue contacto general, te ayudaremos a definir el mejor siguiente paso.",
        ctaPrimary: "Volver al inicio",
        ctaSecondary: "Ver servicios",
    },
    en: {
        titleA: "Thanks for",
        titleHighlight: "reaching out",
        subtitle:
            "We received your request. Our team will review the details and reply through your preferred contact channel as soon as possible.",
        cardTitle: "What happens next",
        cardBody:
            "If your request was a quote, we will prepare an initial response with the information available. If it was general contact, we will help define the best next step.",
        ctaPrimary: "Back to home",
        ctaSecondary: "See services",
    },
}

function ThankYouContent() {
    const { lang } = useLanguage()
    const t = copy[lang]
    const searchParams = useSearchParams()
    const leadType = searchParams.get("lead")

    useEffect(() => {
        if (leadType === "quote") {
            trackQuoteLeadConversion()
            return
        }

        if (leadType === "contact") {
            trackContactLeadConversion()
        }
    }, [leadType])

    return (
        <div className="min-h-screen bg-background pt-16">
            <PageHero
                copy={{
                    es: {
                        titleA: copy.es.titleA,
                        titleHighlight: copy.es.titleHighlight,
                        subtitle: copy.es.subtitle,
                    },
                    en: {
                        titleA: copy.en.titleA,
                        titleHighlight: copy.en.titleHighlight,
                        subtitle: copy.en.subtitle,
                    },
                }}
            />
            <section className="pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/80 p-8 text-center shadow-xl shadow-primary/5 backdrop-blur md:p-12">
                        <h2 className="mb-4 text-2xl font-semibold text-foreground">{t.cardTitle}</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground">{t.cardBody}</p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                            >
                                {t.ctaPrimary}
                            </Link>
                            <Link
                                href="/servicios"
                                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                            >
                                {t.ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={null}>
            <ThankYouContent />
        </Suspense>
    )
}