import QuoteSection from "@/components/sections/quote-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function CotizacionPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Cotiza tu",
            titleHighlight: "Proyecto",
            subtitle:
              "Cuéntanos lo que tienes en mente y te preparamos una propuesta detallada con alcance, tiempos y presupuesto en menos de 24 horas hábiles.",
          },
          en: {
            titleA: "Quote your",
            titleHighlight: "Project",
            subtitle:
              "Tell us what you have in mind and we'll send you a detailed proposal with scope, timeline and budget within 24 business hours.",
          },
        }}
      />
      <QuoteSection />
      <Footer />
    </div>
  )
}
