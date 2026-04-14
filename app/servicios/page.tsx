import ServicesSection from "@/components/sections/services-section"
import Footer from "@/components/layout/footer"

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Nuestros <span className="text-primary">Servicios</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluciones tecnológicas de vanguardia diseñadas para impulsar tu negocio hacia el futuro
          </p>
        </div>
      </div>
      <ServicesSection />
      <Footer />
    </div>
  )
}
