"use client"

import { Users, Award, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const statsData = [
  {
    id: 1,
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Transformed Lives",
    description: "Happy clients who found their wellness path",
  },
  {
    id: 2,
    icon: Award,
    value: 5,
    suffix: "+",
    label: "Years of Excellence",
    description: "Dedicated to your wellness journey",
  },
  {
    id: 3,
    icon: Sparkles,
    value: 1000,
    suffix: "+",
    label: "Mindful Sessions",
    description: "Hours of transformative practice",
  },
]

const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2000,
  isVisible = false,
}: {
  value: number
  suffix?: string
  duration?: number
  isVisible?: boolean
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * value)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration, isVisible])

  return (
    <div className="text-5xl font-bold mb-2 tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

const useIntersectionObserver = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

export function AboutSection() {
  const { ref, isVisible } = useIntersectionObserver(0.3)

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-white">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        <div
          ref={ref}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 mb-20 text-white shadow-2xl transform transition-all duration-1000 hover:shadow-3xl hover:scale-[1.02]"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 animate-fade-in">Our Impact in Numbers</h3>
            <p className="text-emerald-100 text-lg animate-fade-in animation-delay-200">
              Celebrating the wellness journey we've shared together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={stat.id}
                  className="text-center group transform transition-all duration-500 hover:scale-105"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: isVisible ? "fadeInUp 0.8s ease-out forwards" : "none",
                  }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-6">
                    <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                    duration={2000 + index * 200}
                  />

                  <div className="text-emerald-100 font-medium text-lg mb-2">{stat.label}</div>

                  <div className="text-emerald-200/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {stat.description}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            {statsData.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/30 animate-pulse"
                style={{
                  animationDelay: `${index * 300}ms`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  )
}
