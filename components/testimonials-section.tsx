"use client"
import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Mehta",
    profession: "Software Engineer",
    location: "Mumbai",
    image: "/t1.jpg?height=80&width=80&text=PM",
    rating: 5,
    testimonial:
      "Svasthify completely changed my approach to wellness. The personalized yoga sessions at home fit perfectly into my busy schedule. I've lost 15kg and feel more energetic than ever!",
    company: "Svasthify Yoga",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    profession: "Business Owner",
    location: "Delhi",
    image: "/t2.jpg?height=80&width=80&text=RK",
    rating: 5,
    testimonial:
      "After years of back pain from desk work, I was skeptical about yoga. But the therapeutic sessions with expert trainers have been life-changing. I'm pain-free for the first time in 5 years!",
    company: "Wellness Studio",
  },
  {
    id: 3,
    name: "Anita Sharma",
    profession: "New Mother",
    location: "Bangalore",
    image: "/t5.jpg?height=80&width=80&text=AS",
    rating: 5,
    testimonial:
      "The prenatal yoga sessions helped me have a smooth pregnancy and delivery. Post-delivery, the gentle recovery program helped me regain my strength safely. Highly recommend to all mothers!",
    company: "Yoga Center",
  },
  {
    id: 4,
    name: "Vikram Singh",
    profession: "Fitness Trainer",
    location: "Pune",
    image: "/t5.jpg?height=80&width=80&text=AS",
    rating: 5,
    testimonial:
      "As a fitness professional, I was amazed by the depth of knowledge and personalized approach. The meditation sessions have improved my mental clarity and overall well-being significantly.",
    company: "Mindful Yoga",
  },
  {
    id: 5,
    name: "Kavya Reddy",
    profession: "Marketing Manager",
    location: "Hyderabad",
    image: "/t5.jpg?height=80&width=80&text=AS",
    rating: 5,
    testimonial:
      "The stress relief techniques I learned have been invaluable during high-pressure work periods. The instructors are incredibly supportive and create a safe, nurturing environment.",
    company: "Serenity Studio",
  },
  {
    id: 6,
    name: "Arjun Patel",
    profession: "Doctor",
    location: "Ahmedabad",
    image: "/t5.jpg?height=80&width=80&text=AS",
    rating: 5,
    testimonial:
      "The holistic approach to health through yoga has complemented my medical practice beautifully. I now recommend these sessions to my patients for stress management and recovery.",
    company: "Health Plus",
  },
]

export function TestimonialsSection() {
  const [cardIndices, setCardIndices] = useState([0, 1, 2])
  const [isAnimating, setIsAnimating] = useState([false, false, false])

  useEffect(() => {
    const rotateSequentially = () => {
      // Card 1 rotates first
      setTimeout(() => rotateCard(0), 0)
      // Card 2 rotates 2 seconds later
      setTimeout(() => rotateCard(1), 2000)
      // Card 3 rotates 4 seconds later
      setTimeout(() => rotateCard(2), 4000)
    }

    // Start the sequence immediately
    rotateSequentially()

    // Repeat every 6 seconds (2 seconds between each card)
    const mainInterval = setInterval(rotateSequentially, 6000)

    return () => {
      clearInterval(mainInterval)
    }
  }, [])

  const rotateCard = (cardIndex: number) => {
    setIsAnimating((prev) => {
      const newAnimating = [...prev]
      newAnimating[cardIndex] = true
      return newAnimating
    })

    const timeout = setTimeout(() => {
      setCardIndices((prev) => {
        const newIndices = [...prev]
        newIndices[cardIndex] = (newIndices[cardIndex] + 3) % testimonials.length
        return newIndices
      })

      setIsAnimating((prev) => {
        const newAnimating = [...prev]
        newAnimating[cardIndex] = false
        return newAnimating
      })
    }, 300)

    return () => clearTimeout(timeout)
  }

  return (
    <section id="testimonials" className="py-20 sm:py-4 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            ✨ Client Stories
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Don't just take our words.{" "}
            <span className="text-emerald-600 block sm:inline">Over 2500+ people trust us.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cardIndices.map((testimonialIndex, cardIndex) => {
            const testimonial = testimonials[testimonialIndex]
            return (
              <div
                key={`card-${cardIndex}`}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
                  isAnimating[cardIndex] ? "opacity-50 scale-95" : "opacity-100 scale-100 hover:scale-105"
                }`}
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-800 leading-relaxed mb-6 text-sm sm:text-base">"{testimonial.testimonial}"</p>

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current mx-0.5" />
                    ))}
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs">{testimonial.profession}</p>
                    <p className="text-emerald-600 font-semibold text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
