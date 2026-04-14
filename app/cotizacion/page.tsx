import QuoteSection from "@/components/sections/quote-section"
import Footer from "@/components/layout/footer"

export default function CotizacionPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cotiza tu <span className="text-primary">Proyecto</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cuéntanos lo que tienes en mente y te preparamos una propuesta detallada con alcance, tiempos y
            presupuesto en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
      <QuoteSection />
      <Footer />
    </div>
  )
}
