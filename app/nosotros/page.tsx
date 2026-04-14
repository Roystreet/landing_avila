import AboutSection from "@/components/sections/about-section"
import Footer from "@/components/layout/footer"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sobre <span className="text-primary">Nosotros</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un equipo de expertos apasionados por la innovación tecnológica
          </p>
        </div>
      </div>
      <AboutSection />
      <Footer />
    </div>
  )
}
