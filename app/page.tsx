import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProductsSection } from "@/components/products-section"
import { OwnerSection } from "@/components/owner-section"
import { ClientPortal } from "@/components/client-portal"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <OwnerSection />
      <ClientPortal />
      <ContactSection />
      <Footer />
    </main>
  )
}
