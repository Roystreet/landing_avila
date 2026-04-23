"use client"

import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"
import { useLanguage } from "@/components/providers/language-provider"

const sections = {
    es: [
        {
            title: "Uso del sitio",
            body: [
                "Este sitio tiene fines informativos y comerciales para presentar los servicios de Avila System y recibir solicitudes voluntarias de contacto o cotización.",
                "Al usar el sitio, aceptas no enviar información falsa, maliciosa o que interfiera con el funcionamiento normal de la plataforma.",
            ],
        },
        {
            title: "Solicitudes y propuestas",
            body: [
                "El envío de un formulario no constituye una obligación contractual para ninguna de las partes.",
                "Toda propuesta comercial, estimación de costos o plazo será referencial hasta que exista una validación formal del alcance y un acuerdo escrito entre ambas partes.",
            ],
        },
        {
            title: "Propiedad intelectual",
            body: [
                "Los textos, elementos visuales, marca y contenidos de este sitio pertenecen a Avila System o se usan con autorización correspondiente.",
                "No está permitido copiar, redistribuir o reutilizar el contenido del sitio con fines comerciales sin autorización previa por escrito.",
            ],
        },
        {
            title: "Contacto",
            body: [
                "Si tienes preguntas sobre estos términos o necesitas información adicional, puedes escribir a soluciones@avilasystem.com.",
            ],
        },
    ],
    en: [
        {
            title: "Use of the site",
            body: [
                "This site is intended for informational and commercial purposes to present Avila System services and receive voluntary contact or quote requests.",
                "By using the site, you agree not to submit false, malicious, or disruptive information that interferes with the platform's normal operation.",
            ],
        },
        {
            title: "Requests and proposals",
            body: [
                "Submitting a form does not create a contractual obligation for either party.",
                "Any commercial proposal, cost estimate, or timeline is indicative until scope is formally validated and a written agreement is in place between both parties.",
            ],
        },
        {
            title: "Intellectual property",
            body: [
                "The texts, visual elements, brand assets, and contents of this site belong to Avila System or are used with proper authorization.",
                "Copying, redistributing, or reusing the site's content for commercial purposes is not allowed without prior written permission.",
            ],
        },
        {
            title: "Contact",
            body: [
                "If you have questions about these terms or need additional information, you can contact soluciones@avilasystem.com.",
            ],
        },
    ],
}

export default function TerminosPage() {
    const { lang } = useLanguage()
    const content = sections[lang]

    return (
        <div className="min-h-screen bg-background pt-16">
            <PageHero
                copy={{
                    es: {
                        titleA: "Términos y",
                        titleHighlight: "Condiciones",
                        subtitle:
                            "Condiciones generales de uso del sitio, envío de formularios y relación inicial de contacto con Avila System.",
                    },
                    en: {
                        titleA: "Terms &",
                        titleHighlight: "Conditions",
                        subtitle:
                            "General conditions for using the site, submitting forms, and starting an initial contact relationship with Avila System.",
                    },
                }}
            />
            <section className="pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/70 p-8 shadow-xl shadow-primary/5 backdrop-blur md:p-12">
                        <div className="space-y-10">
                            {content.map((section) => (
                                <article key={section.title} className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                                    <div className="space-y-3 text-base leading-7 text-muted-foreground">
                                        {section.body.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}