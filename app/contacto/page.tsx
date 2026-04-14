import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/layout/footer"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="text-primary">Contacto</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Listo para transformar tu negocio en Venezuela? Hablemos sobre tu próximo proyecto de transformación
            digital
          </p>
        </div>
      </div>
      <ContactSection />
      <Footer />
    </div>
  )
}
