import PricingSection from "@/components/sections/pricing-section"
import QuoteSection from "@/components/sections/quote-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Planes y",
            titleHighlight: "Precios",
            subtitle:
              "Tarifas transparentes por tipo de servicio. Elige el plan que mejor se ajuste a tu proyecto o pide una cotización a medida.",
          },
          en: {
            titleA: "Plans and",
            titleHighlight: "Pricing",
            subtitle:
              "Transparent rates by service type. Pick the plan that best fits your project or request a custom quote.",
          },
        }}
      />
      <PricingSection />
      <QuoteSection />
      <Footer />
    </div>
  )
}
