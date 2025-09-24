"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// An array to manage navigation links easily
const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "#services" },
  { name: "Trainers", href: "#trainers" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state if user scrolls down more than 10px
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100 h-14 sm:h-16"
            : "bg-white/80 h-16 sm:h-20"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/duewgaxov/image/upload/v1756280747/svasthifylogo_xtinf5.jpg"
                alt="Svasthify Logo"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "h-10 sm:h-12" : "h-12 sm:h-14"
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative font-medium text-gray-600 transition-colors hover:text-emerald-600 group text-sm xl:text-base"
                >
                  {item.name}
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 lg:px-6 py-2 lg:py-2.5 rounded-full transition-transform hover:scale-105 text-sm lg:text-base">
                Login Now
              </Button>
              <button
                className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="https://res.cloudinary.com/duewgaxov/image/upload/v1756280747/svasthifylogo_xtinf5.jpg"
                  alt="Svasthify Logo"
                  className="h-10 sm:h-12 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>

            <nav className="flex-grow p-4 sm:p-6">
              <ul className="flex flex-col space-y-4 sm:space-y-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block text-lg sm:text-xl font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 sm:p-6 border-t">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-full text-base sm:text-lg">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
