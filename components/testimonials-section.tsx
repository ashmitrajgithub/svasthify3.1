"use client"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Mehta",
    profession: "Software Engineer",
    location: "Mumbai",
    image: "/t1.jpg",
    rating: 5,
    testimonial:
      "Svasthify completely changed my approach to wellness. The personalized yoga sessions at home fit perfectly into my busy schedule. I've lost 15kg and feel more energetic than ever!",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    profession: "Business Owner",
    location: "Delhi",
    image: "/t2.jpg",
    rating: 5,
    testimonial:
      "After years of back pain from desk work, I was skeptical about yoga. But the therapeutic sessions with expert trainers have been life-changing. I'm pain-free for the first time in 5 years!",
  },
  {
    id: 3,
    name: "Anita Sharma",
    profession: "New Mother",
    location: "Bangalore",
    image: "/t3.jpg",
    rating: 5,
    testimonial:
      "The prenatal yoga sessions helped me have a smooth pregnancy and delivery. Post-delivery, the gentle recovery program helped me regain my strength safely. Highly recommend to all mothers!",
  },
  {
    id: 4,
    name: "Vikram Singh",
    profession: "Fitness Trainer",
    location: "Pune",
    image: "/t4.jpg",
    rating: 5,
    testimonial:
      "As a fitness professional, I was amazed by the depth of knowledge and personalized approach. The meditation sessions have improved my mental clarity and overall well-being significantly.",
  },
  {
    id: 5,
    name: "Kavya Reddy",
    profession: "Marketing Manager",
    location: "Hyderabad",
    image: "/t5.jpg",
    rating: 5,
    testimonial:
      "The stress relief techniques I learned have been invaluable during high-pressure work periods. The instructors are incredibly supportive and create a safe, nurturing environment.",
  },
  {
    id: 6,
    name: "Arjun Patel",
    profession: "Doctor",
    location: "Ahmedabad",
    image: "/t6.jpg",
    rating: 5,
    testimonial:
      "The holistic approach to health through yoga has complemented my medical practice beautifully. I now recommend these sessions to my patients for stress management and recovery.",
  },
  {
    id: 7,
    name: "Meera Joshi",
    profession: "Teacher",
    location: "Jaipur",
    image: "/t1.jpg",
    rating: 5,
    testimonial:
      "The mindfulness practices have transformed how I handle classroom stress. My students notice I'm calmer and more present. This has been a game-changer for my teaching career.",
  },
  {
    id: 8,
    name: "Rohit Gupta",
    profession: "IT Professional",
    location: "Chennai",
    image: "/t1.jpg",
    rating: 5,
    testimonial:
      "Working long hours at a computer was taking a toll on my posture and mental health. The targeted yoga sequences have corrected my alignment and boosted my productivity.",
  },
]

export function TestimonialsSection() {
  const column1 = testimonials.slice(0, 3)
  const column2 = testimonials.slice(3, 6)
  const column3 = testimonials.slice(6, 8).concat(testimonials.slice(0, 2))

  const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => (
    <div className="bg-white/70 backdrop-blur-sm border border-green-200/50 p-6 rounded-3xl shadow-xl transition-transform duration-500 transform hover:scale-105 hover:bg-white/90 cursor-pointer">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.image || "/placeholder.svg"}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-400/70 shadow-md"
        />
        <div>
          <p className="font-bold text-gray-800 text-lg">{testimonial.name}</p>
          <p className="text-sm text-green-700 font-medium">{testimonial.profession}</p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current mr-0.5" />
        ))}
      </div>
      <p className="text-gray-700 italic text-sm leading-relaxed">"{testimonial.testimonial}"</p>
    </div>
  )

  return (
    <section
      id="testimonials"
      className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-200"
    >
      {/* Background decorative elements with a softer, more subtle effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.1),transparent_50%)] animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(134,239,172,0.1),transparent_50%)] animate-pulse-slow"></div>

      <div className="container mx-auto max-w-7xl relative z-10 group">
        <div className="text-center mb-8">
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight tracking-tight">
          What Our <span className="bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent">
  Clients Say
  </span>
</h2>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Column 1 - Top to Bottom */}
          <div className="overflow-hidden h-[45rem] rounded-3xl [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] md:col-span-1 lg:col-span-1">
            <div className="flex flex-col gap-8 group-hover:pause animate-scroll-t2b">
              <div className="flex flex-col gap-8">
                {column1.map((testimonial) => (
                  <TestimonialCard key={`col1-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
              <div className="flex flex-col gap-8">
                {column1.map((testimonial) => (
                  <TestimonialCard key={`col1-dup-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 - Bottom to Top (hidden on mobile) */}
          <div className="hidden md:block overflow-hidden h-[45rem] rounded-3xl [mask-image:linear-gradient(to_top,transparent,white_20%,white_80%,transparent)]">
            <div className="flex flex-col gap-8 group-hover:pause animate-scroll-b2t">
              <div className="flex flex-col gap-8">
                {column2.map((testimonial) => (
                  <TestimonialCard key={`col2-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
              <div className="flex flex-col gap-8">
                {column2.map((testimonial) => (
                  <TestimonialCard key={`col2-dup-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 - Top to Bottom (hidden on mobile and tablet) */}
          <div className="hidden lg:block overflow-hidden h-[45rem] rounded-3xl [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]">
            <div className="flex flex-col gap-8 group-hover:pause animate-scroll-t2b">
              <div className="flex flex-col gap-8">
                {column3.map((testimonial) => (
                  <TestimonialCard key={`col3-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
              <div className="flex flex-col gap-8">
                {column3.map((testimonial) => (
                  <TestimonialCard key={`col3-dup-${testimonial.id}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-t2b {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes scroll-b2t {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        @keyframes pulse-slow {
            0% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.05); opacity: 0.15; }
            100% { transform: scale(1); opacity: 0.1; }
        }
        
        .animate-scroll-t2b {
          animation: scroll-t2b 60s linear infinite;
        }
        
        .animate-scroll-b2t {
          animation: scroll-b2t 60s linear infinite;
        }

        .animate-pulse-slow {
            animation: pulse-slow 10s ease-in-out infinite;
        }
        
        .group:hover .group-hover\\:pause {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}