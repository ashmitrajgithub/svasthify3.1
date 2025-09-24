"use client"

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-emerald-50 via-emerald-100 to-emerald-200 text-gray-600">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex space-x-3 sm:space-x-4 order-2 sm:order-1">
              {[
                { Icon: Facebook, link: "https://facebook.com", label: "Facebook" },
                { Icon: Twitter, link: "https://twitter.com", label: "Twitter" },
                { Icon: Instagram, link: "https://instagram.com", label: "Instagram" },
                { Icon: Linkedin, link: "https://linkedin.com", label: "LinkedIn" },
                { Icon: Github, link: "https://github.com", label: "GitHub" },
              ].map(({ Icon, link, label }, index) => (
                <Link
                  key={index}
                  href={link}
                  className="text-gray-500 hover:text-emerald-600 transition-colors p-1"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Section */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 uppercase tracking-wide">Svasthify</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Here you can use rows and columns to organize your footer content. Transform your wellness journey with
              personalized yoga and holistic health programs.
            </p>
          </div>

          {/* Services Section */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wide">Services</h4>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Personal Training", href: "#services" },
                { name: "Group Classes", href: "#services" },
                { name: "Meditation", href: "#services" },
                { name: "Nutrition Coaching", href: "#services" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-emerald-600 transition-colors text-sm sm:text-base"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wide">Useful Links</h4>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "FAQ", href: "#faq" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-emerald-600 transition-colors text-sm sm:text-base"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wide">Contact</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base">Mumbai, India</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base break-all">info@svasthify.com</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base">+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base">+91 98765 43211</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-emerald-200/80">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">© 2025 Copyright: Svasthify.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
