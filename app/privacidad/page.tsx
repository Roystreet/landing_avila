"use client"

import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"
import { useLanguage } from "@/components/providers/language-provider"

const sections = {
    es: [
        {
            title: "Información que recopilamos",
            body: [
                "Cuando completas nuestros formularios de contacto o cotización, podemos recopilar tu nombre, empresa, correo electrónico, teléfono y la información que compartas sobre tu proyecto.",
                "También usamos mecanismos técnicos de seguridad y anti-spam para proteger el sitio y evitar envíos automatizados maliciosos.",
            ],
        },
        {
            title: "Cómo usamos tus datos",
            body: [
                "Usamos tus datos únicamente para responder solicitudes, preparar propuestas comerciales, coordinar reuniones y dar seguimiento a una conversación iniciada por ti.",
                "No vendemos ni compartimos tus datos personales con terceros para fines publicitarios ajenos a Avila System.",
            ],
        },
        {
            title: "Servicios de terceros",
            body: [
                "Podemos apoyarnos en proveedores técnicos para el funcionamiento del sitio, la protección anti-spam, la analítica publicitaria y el envío de correos relacionados con tus solicitudes.",
                "Estos servicios se usan solo en la medida necesaria para operar la landing y atender tus leads.",
            ],
        },
        {
            title: "Tus derechos y contacto",
            body: [
                "Si deseas actualizar, corregir o eliminar la información que compartiste con nosotros, puedes escribir a soluciones@avilasystem.com.",
                "Haremos esfuerzos razonables para atender tu solicitud en el menor tiempo posible.",
            ],
        },
    ],
    en: [
        {
            title: "Information we collect",
            body: [
                "When you complete our contact or quote forms, we may collect your name, company, email address, phone number, and any project details you choose to share.",
                "We also use technical security and anti-spam mechanisms to protect the site and prevent malicious automated submissions.",
            ],
        },
        {
            title: "How we use your data",
            body: [
                "We use your data only to reply to requests, prepare commercial proposals, coordinate meetings, and follow up on a conversation initiated by you.",
                "We do not sell or share your personal data with third parties for advertising purposes unrelated to Avila System.",
            ],
        },
        {
            title: "Third-party services",
            body: [
                "We may rely on technical providers for site operation, anti-spam protection, advertising analytics, and email delivery related to your requests.",
                "These services are used only to the extent necessary to operate the landing page and process your leads.",
            ],
        },
        {
            title: "Your rights and contact",
            body: [
                "If you want to update, correct, or delete the information you shared with us, you can contact soluciones@avilasystem.com.",
                "We will make reasonable efforts to address your request as quickly as possible.",
            ],
        },
    ],
}

export default function PrivacidadPage() {
    const { lang } = useLanguage()
    const content = sections[lang]

    return (
        <div className="min-h-screen bg-background pt-16">
            <PageHero
                copy={{
                    es: {
                        titleA: "Política de",
                        titleHighlight: "Privacidad",
                        subtitle:
                            "Te explicamos qué información recopilamos, para qué la usamos y cómo protegemos tus datos cuando interactúas con Avila System.",
                    },
                    en: {
                        titleA: "Privacy",
                        titleHighlight: "Policy",
                        subtitle:
                            "We explain what information we collect, how we use it, and how we protect your data when you interact with Avila System.",
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