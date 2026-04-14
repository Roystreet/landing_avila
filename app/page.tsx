import HeroSection from "@/components/sections/hero-section"
import MissionSection from "@/components/sections/mission-section"
import ServicesSection from "@/components/sections/services-section"
import PricingSection from "@/components/sections/pricing-section"
import SuccessCasesSection from "@/components/sections/success-cases-section"
import AboutSection from "@/components/sections/about-section"
import QuoteSection from "@/components/sections/quote-section"
import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden pt-16">
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <PricingSection />
      <SuccessCasesSection />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
