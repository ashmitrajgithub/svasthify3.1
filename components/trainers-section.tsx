"use client"

import { useState, useEffect } from "react"
import { Star, Calendar, MapPin, Search, Shield, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "./booking-modal"
import Link from "next/link"

const trainers = [
  {
    id: 1,
    name: "Sikha Bansal",
    title: "Senior Yoga Instructor",
    specialization: "Hatha & Vinyasa Yoga",
    experience: "8 years",
    rating: 4.9,
    reviews: 156,
    location: "Mumbai, Pune",
    image: "/t1.jpg?height=400&width=400&text=Priya+Sharma+Yoga+Instructor",
    certifications: ["RYT-500", "Meditation Teacher", "Ayurveda Certified"],
    languages: ["Hindi", "English", "Marathi"],
    price: "₹1,200",
    availability: "Mon-Sat",
    bio: "Passionate about helping students find balance through traditional yoga practices combined with modern wellness techniques.",
    specialty: "Stress Relief & Flexibility",
    verified: true,
    highlights: ["Stress Relief", "Flexibility", "Traditional Yoga"],
    healthConditions: ["Anxiety", "Depression", "Stress Relief", "Mental Strength", "Relaxation", "Sleep Wellness"],
  },
  {
    id: 2,
    name: "Manoj Bansal",
    title: "Power Yoga Specialist",
    specialization: "Power Yoga & Meditation",
    experience: "12 years",
    rating: 4.8,
    reviews: 203,
    location: "Delhi, Gurgaon",
    image: "/t2.jpg?height=400&width=400&text=Rajesh+Kumar+Power+Yoga",
    certifications: ["RYT-200", "Power Yoga Specialist", "Mindfulness Coach"],
    languages: ["Hindi", "English", "Punjabi"],
    price: "₹1,500",
    availability: "All days",
    bio: "Specializes in dynamic yoga flows and meditation techniques for stress management and mental clarity.",
    specialty: "Power Yoga & Mental Clarity",
    sessions: 1800,
    successRate: "96%",
    verified: true,
    highlights: ["Power Yoga", "Mental Clarity", "Dynamic Flows"],
    healthConditions: ["Increased Energy", "Stamina", "Mental Strength", "Lifestyle Diseases", "Diabetes", "Immunity"],
  },
  {
    id: 3,
    name: "Kishan Panwar",
    title: "Wellness & Prenatal Expert",
    specialization: "Prenatal & Restorative Yoga",
    experience: "10 years",
    rating: 5.0,
    reviews: 89,
    location: "Bangalore, Chennai",
    image: "/t3.jpg?height=400&width=400&text=Anita+Patel+Prenatal+Yoga",
    certifications: ["Prenatal Yoga Certified", "Yin Yoga Teacher", "Therapeutic Yoga"],
    languages: ["English", "Tamil", "Kannada"],
    price: "₹1,000",
    availability: "Mon-Fri",
    bio: "Dedicated to supporting women through their wellness journey with gentle, healing yoga practices.",
    specialty: "Prenatal & Therapeutic",
    sessions: 950,
    successRate: "100%",
    verified: false,
    highlights: ["Prenatal Care", "Therapeutic Yoga", "Women's Wellness"],
    healthConditions: [
      "Anti Aging",
      "Anxiety",
      "Arthritis",
      "Depression",
      "Detoxification",
      "Diabetes",
      "Digestive Disorders",
      "Immunity",
      "Increased Energy",
      "Lifestyle Diseases",
      "Mental Strength",
      "Headaches",
      "Rejuvenation",
      "Relaxation",
      "Sleep Wellness",
      "Stamina",
      "Stress Relief",
    ],
  },
  {
    id: 4,
    name: "Jacks Maliyakal",
    title: "Master Yoga Teacher",
    specialization: "Ashtanga & Advanced Yoga",
    experience: "15 years",
    rating: 4.9,
    reviews: 267,
    location: "Jaipur, Udaipur",
    image: "/t4.jpg?height=400&width=400&text=Vikram+Singh+Ashtanga+Master",
    certifications: ["Ashtanga Authorized", "Advanced Yoga Teacher", "Philosophy Teacher"],
    languages: ["Hindi", "English", "Rajasthani"],
    price: "₹1,800",
    availability: "Tue-Sun",
    bio: "Master practitioner of traditional Ashtanga yoga with deep knowledge of yogic philosophy and advanced techniques.",
    specialty: "Advanced Practices",
    sessions: 2200,
    successRate: "97%",
    verified: true,
    highlights: ["Advanced Yoga", "Ashtanga", "Philosophy"],
    healthConditions: ["Arthritis", "Headaches", "Immunity", "Stamina", "Mental Strength", "Lifestyle Diseases"],
  },
]

export function TrainersSection() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("trainers-section")
    if (section) observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
      observer.disconnect()
    }
  }, [])

  const handleBookTrainer = (trainerId: number) => {
    const trainer = trainers.find((t) => t.id === trainerId)
    setSelectedTrainerForBooking(trainer)
    setBookingModalOpen(true)
  }

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-green-100 to-white"
      id="trainers-section"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 relative">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-3 sm:mb-4 leading-tight tracking-tight px-4">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent">Trainers</span>
          </h2>

          <div
            className={`mt-4 flex justify-center sm:absolute sm:top-0 sm:right-0 ${
              isVisible ? "animate-fade-in-up animate-delay-300" : "opacity-0"
            }`}
          >
            <Button
              asChild
              className="rounded-full px-3 sm:px-4 py-2 bg-green-200 text-black hover:bg-green-300 transition-colors text-sm sm:text-base"
            >
              <Link href="/trainers" target="_blank" rel="noopener noreferrer" aria-label="See all trainers">
                See all trainers
                <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="group relative mb-12 sm:mb-16 lg:mb-20 overflow-hidden">
          <div className="marquee-track flex items-stretch">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="marquee-segment flex w-full min-w-full shrink-0 items-stretch"
                aria-hidden={dup === 1 ? "true" : "false"}
              >
                {trainers.map((trainer, index) => (
                  <div key={`${dup}-${trainer.id}`} className="marquee-item shrink-0 box-border px-2 sm:px-3 lg:px-4">
                    <Card
                      className={`trainer-card group/inner overflow-hidden rounded-2xl sm:rounded-3xl border-0 h-full flex flex-col ${
                        dup === 0
                          ? isVisible
                            ? `animate-fade-in-up animate-delay-${400 + index * 100}`
                            : "opacity-0"
                          : ""
                      }`}
                    >
                      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 sm:h-20"
                          aria-hidden="true"
                          role="presentation"
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 sm:h-24"
                          aria-hidden="true"
                          role="presentation"
                        />
                        <img
                          src={trainer.image || "/placeholder.svg"}
                          alt={trainer.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                        />

                        {trainer.verified && (
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-premium">
                              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-sage-600" />
                            </div>
                          </div>
                        )}

                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-premium">
                            <div className="flex items-center space-x-1 sm:space-x-1.5">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 fill-current" />
                              <span className="text-xs sm:text-sm font-semibold text-slate-900">{trainer.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-premium">
                            <div className="flex items-center space-x-1 sm:space-x-1.5">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-sage-600" />
                              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                {trainer.experience}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20">
                          <div className="bg-sage-500 text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sage">
                            <span className="text-sm sm:text-base font-bold">{trainer.price}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-5 lg:p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-center mb-3 sm:mb-4">
                          <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-600 bg-slate-50 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">{trainer.location.split(",")[0]}</span>
                          </div>
                        </div>

                        <div className="text-center mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">{trainer.name}</h3>
                          <p className="text-sage-600 font-medium text-sm sm:text-base mb-2">
                            {trainer.specialization}
                          </p>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {trainer.bio}
                          </p>
                        </div>

                        <div className="mb-3 sm:mb-4 flex-grow">
                          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {trainer.highlights.slice(0, 3).map((highlight) => (
                              <Badge
                                key={highlight}
                                className="badge-sage text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium border-0 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                              >
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-auto space-y-3 sm:space-y-4">
                          <Button
                            className="w-full btn-premium text-black bg-gradient-to-r from-green-600 to-green-700 hover:from-green-600 hover:to-green-500 font-semibold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 shadow-sage text-sm sm:text-base"
                            onClick={() => handleBookTrainer(trainer.id)}
                          >
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Book Your Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <style jsx>{`
            .marquee-track {
              will-change: transform;
              animation: marquee-scroll 40s linear infinite;
            }
            .marquee-segment {
              width: 100%;
            }
            .marquee-segment > .marquee-item {
              flex: 0 0 85%;
              min-width: 0;
            }
            @media (min-width: 640px) {
              .marquee-segment > .marquee-item {
                flex: 0 0 50%;
              }
            }
            @media (min-width: 1024px) {
              .marquee-segment > .marquee-item {
                flex: 0 0 33.333333%;
              }
            }
            @keyframes marquee-scroll {
              from {
                transform: translate3d(0, 0, 0);
              }
              to {
                transform: translate3d(-50%, 0, 0);
              }
            }
            .group:hover .marquee-track {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .marquee-track {
                animation: none;
                transform: translate3d(0, 0, 0);
              }
            }
          `}</style>
        </div>

        {trainers.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-slate-50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2 sm:mb-3">No trainers found</h3>
            <p className="text-slate-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
              We couldn't find any trainers matching your criteria. Try adjusting your search or removing some filters.
            </p>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false)
          setSelectedTrainerForBooking(null)
        }}
        trainer={selectedTrainerForBooking}
      />
    </section>
  )
}
