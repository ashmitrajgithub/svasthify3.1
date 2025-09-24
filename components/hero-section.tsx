"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Crown, TrendingUp, Award, Rocket, Atom } from "lucide-react"

// Mouse Interactive Blob Component
const MouseInteractiveBlob = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50
      const y = (e.clientY / window.innerHeight - 0.5) * 50

      mouseX.set(x)
      mouseY.set(y)
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
          x,
          y,
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-2xl opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
          x: useTransform(x, (value) => -value * 0.5),
          y: useTransform(y, (value) => -value * 0.5),
          left: "30%",
          top: "30%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Typewriter Effect Component
const TypewriterEffect = ({ texts, className }: { texts: string[]; className?: string }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentTextIndex]

    if (!isDeleting && currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
        setCurrentIndex((prev) => prev - 1)
      }, 50)
      return () => clearTimeout(timeout)
    } else if (!isDeleting && currentIndex === currentText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false)
      setCurrentTextIndex((prev) => (prev + 1) % texts.length)
    }
  }, [currentIndex, currentTextIndex, isDeleting, texts])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        className="inline-block w-0.5 h-8 bg-emerald-600 ml-1"
      />
    </span>
  )
}

export function Home() {
  const handleStartJourney = () => {
    // Scroll to services section
    const servicesSection = document.getElementById("services")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { scrollY } = useScroll()

  // Scroll progress tracking
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const progress = Math.min(latest / 3000, 1)
      setScrollProgress(progress)
    })
    return unsubscribe
  }, [scrollY])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const heroStats = useMemo(
    () => [
      { number: 50000, suffix: "+", label: "Happy Students", icon: <Users className="w-5 h-5" /> },
      { number: 98, suffix: "%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
      { number: 200, suffix: "+", label: "Expert Instructors", icon: <Award className="w-5 h-5" /> },
      { number: 15, suffix: "+", label: "Years Experience", icon: <Crown className="w-5 h-5" /> },
    ],
    [],
  )

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Mouse Interactive Blob */}
      <MouseInteractiveBlob />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Loading Animation */}

      {/* Add proper padding-top to account for header */}
      <div className="pt-38 sm:pt-36 lg:pt-28">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
          {/* Floating Particles */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8 text-center lg:text-left"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Badge className="mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-4 py-2 rounded-full font-medium border border-emerald-200 shadow-lg">
                      <Atom className="w-4 h-4 mr-2" />
                      AI-Powered Wellness Platform
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Transform Your Life with{" "}
                    <span className="font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <TypewriterEffect
                        texts={["Smart Yoga", "AI Wellness", "Digital Health", "Personal Growth", "Mindful Living"]}
                      />
                    </span>
                  </motion.h1>

                  <motion.div
                    className="space-y-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <p>Experience personalized wellness through advanced AI technology and expert guidance.</p>
                    <p>Join thousands who have transformed their lives with our innovative approach.</p>
                  </motion.div>
                </div>

                {/* Fixed Button Layout with Proper Spacing */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={handleStartJourney}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        <Rocket className="w-5 h-5 mr-2" />
                        Choose Your Trainer
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  ></motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                >
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-center mb-2 text-emerald-600 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.number.toLocaleString()}
                        {stat.suffix}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Content - Image Grid */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full"
              >
                {/* Main Image */}
                <motion.div
                  className="absolute top-0 right-0 w-[280px] sm:w-[320px] lg:w-[380px] h-[320px] sm:h-[380px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-white p-2 group cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  animate={{
                    y: [0, -10],
                  }}
                  style={{
                    animationName: "float",
                    animationDuration: "6s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "ease-in-out",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl h-full">
                    <Image
                      src="/h1.jpg"
                      alt="AI-powered yoga practice"
                      width={380}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/20">
                      <p className="text-sm font-semibold text-gray-800">AI Guidance Active</p>
                      <p className="text-xs text-gray-600">Real-time form correction</p>
                      <div className="w-full h-1 bg-emerald-200 rounded-full mt-1 overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          animate={{ width: ["0%", "100%", "0%"] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Images */}
                <motion.div
                  className="absolute top-16 sm:top-20 left-0 w-[220px] sm:w-[260px] lg:w-[300px] h-[260px] sm:h-[300px] lg:h-[360px] rounded-3xl overflow-hidden shadow-xl bg-white p-2"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  animate={{
                    y: [0, 8],
                    x: [0, -5],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    type: "tween",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl h-full">
                    <Image
                      src="/h2.jpg"
                      alt="Meditation practice"
                      width={300}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 right-16 sm:right-20 w-[240px] sm:w-[280px] lg:w-[320px] h-[200px] sm:h-[240px] lg:h-[280px] rounded-3xl overflow-hidden shadow-xl bg-white p-2"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  animate={{
                    y: [0, -6],
                    x: [0, 3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    type: "tween",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl h-full">
                    <Image
                      src="/h3.jpg"
                      alt="Wellness transformation"
                      width={320}
                      height={280}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full shadow-lg ${
                      ["bg-emerald-500", "bg-purple-500", "bg-pink-500", "bg-blue-500"][i % 4]
                    }`}
                    style={{
                      width: `${8 + (i % 3) * 4}px`,
                      height: `${8 + (i % 3) * 4}px`,
                      top: `${15 + ((i * 7) % 70)}%`,
                      right: i % 2 === 0 ? `${10 + (i % 3) * 15}%` : "auto",
                      left: i % 2 === 1 ? `${10 + (i % 3) * 15}%` : "auto",
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 0.8, 0.4],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
