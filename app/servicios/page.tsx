import ServicesSection from "@/components/sections/services-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Nuestros",
            titleHighlight: "Servicios",
            subtitle:
              "Soluciones tecnológicas para empresas que necesitan software confiable, documentado y con soporte real.",
          },
          en: {
            titleA: "Our",
            titleHighlight: "Services",
            subtitle:
              "Technology solutions for companies that need reliable, documented software with real support.",
          },
        }}
      />
      <ServicesSection />
      <Footer />
    </div>
  )
}
