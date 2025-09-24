"use client"

import { Heart, Zap, Leaf, ArrowRight, Star, Clock, Users, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const services = [
  {
    icon: Heart,
    title: "Personal Yoga Training",
    description: "One-on-one yoga sessions tailored to your fitness level and wellness goals.",
    features: ["Customized routines", "Posture correction", "Breathing techniques", "Flexibility improvement"],
    price: "₹1,200",
    duration: "60 min",
    rating: 4.9,
    sessions: "1000+",
    image: "/02.jpg?height=200&width=300&text=Yoga+Training",
  },
  {
    icon: Zap,
    title: "Meditation & Mindfulness",
    description: "Guided meditation sessions to reduce stress and improve mental clarity.",
    features: ["Stress reduction", "Better focus", "Emotional balance", "Sleep improvement"],
    price: "₹800",
    duration: "45 min",
    rating: 4.8,
    sessions: "800+",
    image: "/03.jpg?height=200&width=300&text=Meditation",
  },
  {
    icon: Leaf,
    title: "Wellness Coaching",
    description: "Comprehensive lifestyle coaching covering nutrition, habits, and wellness practices.",
    features: ["Nutrition guidance", "Lifestyle planning", "Goal setting", "Progress tracking"],
    price: "₹1,500",
    duration: "90 min",
    rating: 5.0,
    sessions: "600+",
    image: "/04.jpg?height=200&width=300&text=Wellness+Coaching",
  },
  {
    icon: Heart,
    title: "Prenatal Yoga",
    description: "Safe and gentle yoga practices designed specifically for expecting mothers.",
    features: ["Safe poses", "Breathing for labor", "Pelvic floor strength", "Stress relief"],
    price: "₹1,000",
    duration: "50 min",
    rating: 4.9,
    sessions: "500+",
    image: "/placeholder.svg?height=200&width=300&text=Prenatal+Yoga",
  },
  {
    icon: Zap,
    title: "Power Yoga",
    description: "Dynamic and challenging yoga sequences to build strength and endurance.",
    features: ["Strength building", "Cardio benefits", "Core strengthening", "Flexibility"],
    price: "₹1,400",
    duration: "75 min",
    rating: 4.7,
    sessions: "750+",
    image: "/placeholder.svg?height=200&width=300&text=Power+Yoga",
  },
  {
    icon: Leaf,
    title: "Ayurvedic Consultation",
    description: "Traditional Ayurvedic health assessment and personalized wellness recommendations.",
    features: ["Body type analysis", "Diet recommendations", "Herbal guidance", "Lifestyle tips"],
    price: "₹2,000",
    duration: "90 min",
    rating: 4.8,
    sessions: "300+",
    image: "/placeholder.svg?height=200&width=300&text=Ayurvedic+Consultation",
  },
]

export function ServicesSection() {
  const [isScrolling, setIsScrolling] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const scrollSpeedRef = useRef(1) // pixels per frame

  useEffect(() => {
    const animate = () => {
      if (scrollContainerRef.current && isScrolling) {
        const container = scrollContainerRef.current
        const scrollWidth = container.scrollWidth
        const clientWidth = container.clientWidth

        // Reset to beginning when reaching the end
        if (container.scrollLeft >= scrollWidth - clientWidth) {
          container.scrollLeft = 0
        } else {
          container.scrollLeft += scrollSpeedRef.current
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isScrolling) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isScrolling])

  const handleBookService = (service: any) => {
    window.location.href = `/booking?service=${encodeURIComponent(service.title)}`
  }

  const handleCardMouseEnter = () => {
    setIsScrolling(false)
  }

  const handleCardMouseLeave = () => {
    setIsScrolling(true)
  }

  const duplicatedServices = [...services, ...services]

  return (
    <section id="services" className="py-2 px-2 pt-28 sm:px-6 bg-gradient-to-br from-green-100 via-white to-green-200   ">
      <div className="container mx-auto ">
        <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight tracking-tight">
  Explore Our <span className="bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent">
     Program
  </span>
</h2>
         
        </div>

        <div className="relative mb-8">
          <div className="flex justify-end mb-6">
            <Link href="/services">
              <Button
                variant="outline"
                className="border-2 border-green-400/30 text-black hover:bg-green-400 hover:text-black bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-full font-semibold"
              >
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div
            ref={scrollContainerRef}
            className="overflow-hidden whitespace-nowrap"
            style={{ scrollBehavior: "auto" }}
          >
            <div className="inline-flex space-x-8">
              {duplicatedServices.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <div
                    key={`${service.title}-${index}`}
                    className="inline-block w-96 flex-shrink-0"
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card className="group relative overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full whitespace-normal rounded-xl ">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-green-900/20" />

                        <div className="absolute top-3 right-3 bg-black/80 rounded-lg px-2 py-1 shadow-sm border border-green-400/30">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-green-400 fill-current" />
                            <span className="text-xs font-semibold text-white">{service.rating}</span>
                          </div>
                        </div>

                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-400 text-black rounded-lg px-3 py-1 text-sm font-semibold">
                          {service.price}
                        </div>
                      </div>

                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-400/20">
                            <IconComponent className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-black mb-1 leading-tight">
                              {service.title}
                            </CardTitle>
                            <div className="flex items-center space-x-3 text-xs text-black">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{service.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{service.sessions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm text-black leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-5 pt-0">
                        <div className="space-y-2 mb-5">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-black">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleBookService(service)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm group"
                        >
                          Book Session
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
