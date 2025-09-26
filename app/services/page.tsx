"use client"

import { Heart, Zap, Leaf, ArrowRight, Star, Clock, Users, Search, Filter, X, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // add Link for asChild navigation

const allServices = [
  {
    id: 1,
    icon: Heart,
    title: "Personal Yoga Training",
    description: "One-on-one yoga sessions tailored to your fitness level and wellness goals.",
    features: ["Customized routines", "Posture correction", "Breathing techniques", "Flexibility improvement"],
    price: "₹1,200",
    duration: "60 min",
    rating: 4.9,
    sessions: "1000+",
    category: "Yoga",
    image: "/02.jpg?height=200&width=300&text=Yoga+Training",
  },
  {
    id: 2,
    icon: Zap,
    title: "Meditation & Mindfulness",
    description: "Guided meditation sessions to reduce stress and improve mental clarity.",
    features: ["Stress reduction", "Better focus", "Emotional balance", "Sleep improvement"],
    price: "₹800",
    duration: "45 min",
    rating: 4.8,
    sessions: "800+",
    category: "Meditation",
    image: "/03.jpg?height=200&width=300&text=Meditation",
  },
  {
    id: 3,
    icon: Leaf,
    title: "Wellness Coaching",
    description: "Comprehensive lifestyle coaching covering nutrition, habits, and wellness practices.",
    features: ["Nutrition guidance", "Lifestyle planning", "Goal setting", "Progress tracking"],
    price: "₹1,500",
    duration: "90 min",
    rating: 5.0,
    sessions: "600+",
    category: "Coaching",
    image: "/04.jpg?height=200&width=300&text=Wellness+Coaching",
  },
  {
    id: 4,
    icon: Heart,
    title: "Prenatal Yoga",
    description: "Safe and gentle yoga practices designed specifically for expecting mothers.",
    features: ["Safe poses", "Breathing for labor", "Pelvic floor strength", "Stress relief"],
    price: "₹1,000",
    duration: "50 min",
    rating: 4.9,
    sessions: "500+",
    category: "Yoga",
    image: "/placeholder.svg?height=200&width=300&text=Prenatal+Yoga",
  },
  {
    id: 5,
    icon: Zap,
    title: "Power Yoga",
    description: "Dynamic and challenging yoga sequences to build strength and endurance.",
    features: ["Strength building", "Cardio benefits", "Core strengthening", "Flexibility"],
    price: "₹1,400",
    duration: "75 min",
    rating: 4.7,
    sessions: "750+",
    category: "Yoga",
    image: "/placeholder.svg?height=200&width=300&text=Power+Yoga",
  },
  {
    id: 6,
    icon: Leaf,
    title: "Ayurvedic Consultation",
    description: "Traditional Ayurvedic health assessment and personalized wellness recommendations.",
    features: ["Body type analysis", "Diet recommendations", "Herbal guidance", "Lifestyle tips"],
    price: "₹2,000",
    duration: "90 min",
    rating: 4.8,
    sessions: "300+",
    category: "Coaching",
    image: "/placeholder.svg?height=200&width=300&text=Ayurvedic+Consultation",
  },
  {
    id: 7,
    icon: Heart,
    title: "Restorative Yoga",
    description: "Gentle, relaxing yoga poses held for longer periods to promote deep relaxation.",
    features: ["Deep relaxation", "Stress relief", "Better sleep", "Gentle stretching"],
    price: "₹900",
    duration: "60 min",
    rating: 4.8,
    sessions: "400+",
    category: "Yoga",
    image: "/placeholder.svg?height=200&width=300&text=Restorative+Yoga",
  },
  {
    id: 8,
    icon: Zap,
    title: "Breathwork Sessions",
    description: "Specialized breathing techniques to enhance energy, focus, and emotional well-being.",
    features: ["Energy boost", "Anxiety relief", "Mental clarity", "Emotional balance"],
    price: "₹700",
    duration: "40 min",
    rating: 4.6,
    sessions: "350+",
    category: "Meditation",
    image: "/placeholder.svg?height=200&width=300&text=Breathwork",
  },
  {
    id: 9,
    icon: Leaf,
    title: "Nutrition Counseling",
    description: "Personalized nutrition plans and dietary guidance for optimal health and wellness.",
    features: ["Meal planning", "Dietary analysis", "Health goals", "Supplement advice"],
    price: "₹1,800",
    duration: "75 min",
    rating: 4.9,
    sessions: "250+",
    category: "Coaching",
    image: "/placeholder.svg?height=200&width=300&text=Nutrition+Counseling",
  },
]

const categories = ["All", "Yoga", "Meditation", "Coaching"]

export default function ServicesPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // const handleBookService = (service: any) => {
  //   router.push(`/booking?service=${encodeURIComponent(service.title)}`)
  // }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <Header />

      <main className="pt-20">
        <section className="py-8 px-4 sm:px-6 bg-gradient-to-br from-primary/5 via-white to-cyan-50/50">
          <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight tracking-tight">
  Explore all <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
     Programs
  </span>
</h2>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search services, features, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-14 py-5 text-lg rounded-2xl border-2 border-primary/10 focus:border-primary/30 bg-white/80 backdrop-blur-sm shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg"
                      : "border-2 border-primary/20 text-primary hover:bg-primary/5 bg-white/80 backdrop-blur-sm"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {category}
                </Button>
              ))}
            </div>

            <p className="text-muted-foreground text-lg">
              Showing <span className="font-bold text-primary">{filteredServices.length}</span> of{" "}
              <span className="font-bold">{allServices.length}</span> services
            </p>
          </div>
        </section>

        <section className="py-2 px-4 sm:px-6">
          <div className="container mx-auto">
            {filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-6">No services found</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or category filter to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                  className="bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white px-8 py-3 rounded-full font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredServices.map((service, index) => {
                  const IconComponent = service.icon
                  return (
                    <Card
                      key={service.id}
                      className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] rounded-2xl"
                    >
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-white/20">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-sm font-bold text-gray-900">{service.rating}</span>
                          </div>
                        </div> */}

<div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-green-100 to-green-200 text-black rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">
                          {service.price}
                        </div>

                        <Badge className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-primary border-0 shadow-lg">
                          {service.category}
                        </Badge>
                      </div>

                      <CardHeader className="pb-4 px-6 pt-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold rounded-2xl flex items-center justify-center shadow-inner">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-2xl font-bold text-foreground mb-2 leading-tight">
                              {service.title}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{service.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{service.sessions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-muted-foreground text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-6 pb-6">
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-3 group/feature">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200" />
                              <span className="text-sm text-card-foreground font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base group/button"
                        >
                          <Link
                            href={`/booking?service=${encodeURIComponent(service.title)}`}
                            onClick={() => console.log("[v0] Book Session clicked (services):", service.title)}
                          >
                            <span className="mr-2">Book Session</span>
                            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
