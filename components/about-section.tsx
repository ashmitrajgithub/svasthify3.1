"use client"

import { Heart, Target, ArrowRight, Users, Award, Sparkles, CheckCircle, Star } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-white">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
       
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 mb-20 text-white shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Our Impact in Numbers</h3>
            <p className="text-emerald-100 text-lg">Celebrating the wellness journey we've shared together</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-emerald-100 font-medium text-lg">Transformed Lives</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2">5+</div>
              <div className="text-emerald-100 font-medium text-lg">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-emerald-100 font-medium text-lg">Mindful Sessions</div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  )
}
