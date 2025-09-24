"use client"

import { useState } from "react"
import { Plus, Search, HelpCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const faqs = [
  {
    id: 1,
    question: "What types of wellness services do you offer?",
    answer:
      "We offer a comprehensive range of wellness services including Personal Yoga Training, Meditation & Mindfulness sessions, Wellness Coaching, Prenatal Yoga, Power Yoga, Therapeutic Yoga, Nutrition Counseling, and Stress Management programs. All services are delivered at your home by certified professionals.",
    category: "Services",
  },
  {
    id: 2,
    question: "How do I book a session with a trainer?",
    answer:
      "Booking is simple! You can book through our website by selecting your preferred trainer, choosing a date and time that works for you, and completing the booking form. You can also call us at +91 98765 43210 for immediate assistance. Our team will confirm your booking within 2 hours.",
    category: "Booking",
  },
  {
    id: 3,
    question: "What are your pricing plans and payment options?",
    answer:
      "Our pricing varies by service type: Personal Yoga (₹1,200/session), Meditation (₹800/session), Wellness Coaching (₹1,500/session). We offer flexible payment options including per-session payments, monthly packages with discounts, and annual plans. Payment can be made via UPI, cards, or cash.",
    category: "Pricing",
  },
  {
    id: 4,
    question: "Are your trainers certified and experienced?",
    answer:
      "All our trainers are certified professionals with relevant qualifications (RYT-200/500, specialized certifications). They undergo rigorous screening and have an average of 8+ years of experience. Each trainer is background-verified and regularly trained on our quality standards.",
    category: "Services",
  },
  {
    id: 5,
    question: "Do you offer online sessions as well as home visits?",
    answer:
      "Yes, we offer both options! You can choose between in-person home sessions or online virtual sessions via video call. Online sessions are perfect for those who prefer flexibility or are traveling. The quality and personalization remain the same for both formats.",
    category: "Services",
  },
  {
    id: 6,
    question: "Can I reschedule or cancel my session?",
    answer:
      "Yes, you can reschedule or cancel sessions up to 24 hours before the scheduled time without any charges. For cancellations within 24 hours, a 50% fee applies. Emergency cancellations are handled case-by-case. You can manage bookings through our app or by calling our support team.",
    category: "Booking",
  },
  {
    id: 7,
    question: "What should I prepare for my first yoga session?",
    answer:
      "For your first session, wear comfortable, stretchy clothing and have a yoga mat ready. If you don't have a mat, we can provide one. Ensure you have a quiet space with enough room to stretch. Avoid eating heavy meals 2 hours before the session. Our trainer will guide you through everything else.",
    category: "General",
  },
  {
    id: 8,
    question: "Do you offer group sessions or corporate wellness programs?",
    answer:
      "Yes! We offer group sessions for families, friends, or small communities (2-6 people) at discounted rates. We also provide corporate wellness programs including office yoga, stress management workshops, and team building activities. Contact us for customized corporate packages.",
    category: "Services",
  },
  {
    id: 9,
    question: "What is your refund and cancellation policy?",
    answer:
      "We offer a full refund if you cancel within 24 hours of booking (before the first session). For package cancellations, unused sessions are refunded proportionally. Emergency medical situations are handled with full flexibility. All refunds are processed within 5-7 business days.",
    category: "Booking",
  },
  {
    id: 10,
    question: "How do I track my progress and wellness journey?",
    answer:
      "We provide a personalized wellness dashboard where you can track your sessions, progress photos, flexibility improvements, and wellness goals. Your trainer will also provide regular assessments and personalized recommendations to help you achieve your wellness objectives.",
    category: "General",
  },
]

const filterCategories = [
  { id: "all", label: "All Questions", color: "from-gray-500 to-gray-600" },
  { id: "services", label: "Services", color: "from-emerald-500 to-teal-600" },
  { id: "booking", label: "Booking", color: "from-blue-500 to-indigo-600" },
  { id: "pricing", label: "Pricing", color: "from-purple-500 to-pink-600" },
  { id: "general", label: "General", color: "from-orange-500 to-red-600" },
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "all" || faq.category.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <section className="py-4 px-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-emerald-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 text-emerald-700 text-sm font-semibold mb-4 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Frequently Asked Questions
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
            Everything You   
               <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent"> 
               &nbsp; Need to Know
            </span>
          </h2>
         

          
        </div>

        {/* Search */}
        {/* <div className="relative mb-8 max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base border-2 border-gray-200/50 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 placeholder:text-gray-400 font-medium"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div> */}

        {/* Filter Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                activeFilter === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 border border-gray-200/50 hover:border-gray-300/50"
              }`}
            >
              {category.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {category.id === "all"
                  ? faqs.length
                  : faqs.filter((faq) => faq.category.toLowerCase() === category.id.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/20 transition-all duration-500 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 leading-tight">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                    openItems.includes(faq.id)
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rotate-45 shadow-emerald-200"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-emerald-100 group-hover:to-teal-100 group-hover:text-emerald-600 group-hover:shadow-emerald-100"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </div>
              </button>

              <div
                className={`transition-all duration-700 ease-out overflow-hidden ${
                  openItems.includes(faq.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="border-t border-gradient-to-r from-emerald-100 to-teal-100 pt-4 relative">
                    <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                    <p className="text-gray-700 leading-relaxed text-base font-medium">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-6 text-base">
              Try adjusting your search terms or browse all questions below.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="rounded-xl px-6 py-2 border-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
              >
                Clear Search
              </Button>
              <Button
                onClick={() => setActiveFilter("all")}
                variant="outline"
                className="rounded-xl px-6 py-2 border-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
              >
                Show All Categories
              </Button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-10 border border-emerald-200/50 shadow-2xl shadow-emerald-100/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200/50">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>

              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-base leading-relaxed">
                Can't find the answer you're looking for? Our wellness experts are here to provide personalized
                guidance.
              </p>

              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-8 py-3 font-semibold text-base group shadow-2xl shadow-emerald-200/50 hover:shadow-emerald-300/50 transition-all duration-300 transform hover:-translate-y-1">
                Get Personal Support
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
