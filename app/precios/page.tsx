import PricingSection from "@/components/sections/pricing-section"
import QuoteSection from "@/components/sections/quote-section"
import Footer from "@/components/layout/footer"

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Planes y <span className="text-primary">Precios</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tarifas transparentes por tipo de servicio. Elige el plan que mejor se ajuste a tu proyecto o pide una
            cotización a medida.
          </p>
        </div>
      </div>
      <PricingSection />
      <QuoteSection />
      <Footer />
    </div>
  )
}
