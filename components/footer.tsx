"use client"

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-emerald-50 via-emerald-100 to-emerald-200 text-gray-600">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, link: "https://facebook.com" },
                { Icon: Twitter, link: "https://twitter.com" },
                { Icon: Instagram, link: "https://instagram.com" },
                { Icon: Linkedin, link: "https://linkedin.com" },
                { Icon: Github, link: "https://github.com" },
              ].map(({ Icon, link }, index) => (
                <Link key={index} href={link} className="text-gray-500 hover:text-emerald-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Svasthify</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Here you can use rows and columns to organize your footer content. Transform your wellness journey with
              personalized yoga and holistic health programs.
            </p>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Services</h4>
            <div className="space-y-3">
              {[
                { name: "Personal Training", href: "#services" },
                { name: "Group Classes", href: "#services" },
                { name: "Meditation", href: "#services" },
                { name: "Nutrition Coaching", href: "#services" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Useful Links</h4>
            <div className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "FAQ", href: "#faq" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">info@svasthify.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">+91 98765 43211</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-emerald-200/80">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-gray-600">© 2024 Copyright: Svasthify.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
