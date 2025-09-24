import { Header } from "@/components/header"
import { Home } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { TrainersSection } from "@/components/trainers-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AboutSection } from "@/components/about-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* <Home /> */}
        <ServicesSection />
        <TrainersSection />
        <TestimonialsSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
