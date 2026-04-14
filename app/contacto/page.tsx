import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "",
            titleHighlight: "Contacto",
            subtitle:
              "Cuéntanos sobre tu proyecto. Respondemos en menos de 24 horas hábiles.",
          },
          en: {
            titleA: "",
            titleHighlight: "Contact",
            subtitle:
              "Tell us about your project. We reply within 24 business hours.",
          },
        }}
      />
      <ContactSection />
      <Footer />
    </div>
  )
}
