"use client"

import { useState } from "react"
import { Clock, User, MapPin, Star, X, CheckCircle, ArrowLeft, ArrowRight, CreditCard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Service {
  title: string
  price: string
  duration: string
  description: string
  features: string[]
}

interface Trainer {
  id: number
  name: string
  title: string
  specialization: string
  experience: string
  rating: number
  reviews: number
  location: string
  image: string
  price: string
  availability: string
  bio: string
  specialty: string
  sessions: number
  successRate: string
  certifications: string[]
  languages: string[]
}

interface ServiceBookingModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service | null
}

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface BookingData {
  trainer: Trainer | null
  date: string
  time: string
  duration: string
  sessionType: string
  specialRequests: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  paymentMethod: string
}

// Mock trainers data
const trainers: Trainer[] = [
  {
    id: 1,
    name: "Sikha Bansal",
    title: "Senior Yoga Instructor",
    specialization: "Hatha & Vinyasa Yoga",
    experience: "8 years",
    rating: 4.9,
    reviews: 156,
    location: "Mumbai, Pune",
    image: "/t1.jpg?height=400&width=400&text=Sikha+Bansal",
    certifications: ["RYT-500", "Meditation Teacher", "Ayurveda Certified"],
    languages: ["Hindi", "English", "Marathi"],
    price: "₹1,200",
    availability: "Mon-Sat",
    bio: "Passionate about helping students find balance through traditional yoga practices combined with modern wellness techniques.",
    specialty: "Stress Relief & Flexibility",
    sessions: 1200,
    successRate: "98%",
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
    image: "/t2.jpg?height=400&width=400&text=Manoj+Bansal",
    certifications: ["RYT-200", "Power Yoga Specialist", "Mindfulness Coach"],
    languages: ["Hindi", "English", "Punjabi"],
    price: "₹1,500",
    availability: "All days",
    bio: "Specializes in dynamic yoga flows and meditation techniques for stress management and mental clarity.",
    specialty: "Power Yoga & Mental Clarity",
    sessions: 1800,
    successRate: "96%",
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
    image: "/t3.jpg?height=400&width=400&text=Kishan+Panwar",
    certifications: ["Prenatal Yoga Certified", "Yin Yoga Teacher", "Therapeutic Yoga"],
    languages: ["English", "Tamil", "Kannada"],
    price: "₹1,000",
    availability: "Mon-Fri",
    bio: "Dedicated to supporting women through their wellness journey with gentle, healing yoga practices.",
    specialty: "Prenatal & Therapeutic",
    sessions: 950,
    successRate: "100%",
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
    image: "/t4.jpg?height=400&width=400&text=Jacks+Maliyakal",
    certifications: ["Ashtanga Authorized", "Advanced Yoga Teacher", "Philosophy Teacher"],
    languages: ["Hindi", "English", "Rajasthani"],
    price: "₹1,800",
    availability: "Tue-Sun",
    bio: "Master practitioner of traditional Ashtanga yoga with deep knowledge of yogic philosophy and advanced techniques.",
    specialty: "Advanced Practices",
    sessions: 2200,
    successRate: "97%",
  },
]

const timeSlots: TimeSlot[] = [
  { time: "06:00 AM", available: true, price: 1200 },
  { time: "07:00 AM", available: true, price: 1200 },
  { time: "08:00 AM", available: false, price: 1200 },
  { time: "09:00 AM", available: true, price: 1200 },
  { time: "10:00 AM", available: true, price: 1200 },
  { time: "11:00 AM", available: false, price: 1200 },
  { time: "12:00 PM", available: true, price: 1200 },
  { time: "01:00 PM", available: true, price: 1200 },
  { time: "02:00 PM", available: true, price: 1200 },
  { time: "03:00 PM", available: false, price: 1200 },
  { time: "04:00 PM", available: true, price: 1200 },
  { time: "05:00 PM", available: true, price: 1200 },
  { time: "06:00 PM", available: true, price: 1500 },
  { time: "07:00 PM", available: true, price: 1500 },
  { time: "08:00 PM", available: false, price: 1500 },
]

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Secure payment with your card" },
  { id: "upi", name: "UPI Payment", icon: Shield, description: "Pay using UPI apps like GPay, PhonePe" },
  { id: "cash", name: "Cash on Service", icon: User, description: "Pay directly to the trainer" },
]

export function ServiceBookingModal({ isOpen, onClose, service }: ServiceBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [bookingData, setBookingData] = useState<BookingData>({
    trainer: null,
    date: "",
    time: "",
    duration: "60",
    sessionType: "individual",
    specialRequests: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    paymentMethod: "card",
  })

  // Generate calendar dates
  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const dates = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0 // Not Sunday and not in the past
  }

  const calculateTotalPrice = () => {
    if (!selectedTrainer) return 0
    const basePrice = Number.parseInt(selectedTrainer.price.replace(/[^\d]/g, "") || "1200")
    const selectedTimeSlot = timeSlots.find((slot) => slot.time === selectedTime)
    const timePrice = selectedTimeSlot?.price || basePrice
    return timePrice
  }

  const handleBooking = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setBookingComplete(true)
    setIsLoading(false)
  }

  const resetModal = () => {
    setCurrentStep(1)
    setSelectedTrainer(null)
    setSelectedDate("")
    setSelectedTime("")
    setBookingComplete(false)
    setBookingData({
      trainer: null,
      date: "",
      time: "",
      duration: "60",
      sessionType: "individual",
      specialRequests: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      paymentMethod: "card",
    })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedTrainer !== null
      case 2:
        return selectedDate && selectedTime && bookingData.clientAddress.trim() !== ""
      case 3:
        return true // Summary step, always can proceed
      case 4:
        return bookingData.paymentMethod !== ""
      case 5:
        return bookingData.clientName && bookingData.clientEmail && bookingData.clientPhone
      default:
        return false
    }
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden bg-white rounded-lg sm:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {bookingComplete ? (
          // Success Screen
          <div className="p-6 sm:p-12 text-center overflow-y-auto max-h-[98vh]">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-bounce">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Booking Confirmed!</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Your {service.title} session has been successfully booked.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Booking Summary</h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold text-right">{service.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trainer:</span>
                    <span className="font-semibold text-right">{selectedTrainer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-right">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-right">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-right">{service.duration}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 sm:pt-4">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-emerald-600 text-lg">₹{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
              <h4 className="font-semibold text-cyan-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-cyan-800 space-y-1 text-left">
                <li>• You'll receive a confirmation email with all details</li>
                <li>• Your trainer will contact you 24 hours before the session</li>
                <li>• Please ensure you have a suitable space ready</li>
                <li>• Have your yoga mat and water bottle ready</li>
              </ul>
            </div>

            <Button
              onClick={handleClose}
              className="bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full max-h-[98vh] sm:max-h-[95vh]">
            {/* Left Panel - Service & Progress Info */}
            <div className="hidden lg:block lg:w-1/3 bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 xl:p-8 flex-col overflow-y-auto">
              <div className="flex-1">
                {/* Service Info */}
                <div className="mb-6 xl:mb-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 xl:p-6">
                    <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium">{service.duration}</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">{service.price}</div>
                    </div>
                  </div>
                </div>

                {/* Selected Trainer Info */}
                {selectedTrainer && (
                  <div className="mb-6 xl:mb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 xl:p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Selected Trainer</h4>
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={selectedTrainer.image || "/placeholder.svg"}
                          alt={selectedTrainer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-semibold text-gray-900">{selectedTrainer.name}</h5>
                          <p className="text-sm text-emerald-600">{selectedTrainer.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{selectedTrainer.rating}</span>
                        </div>
                        <span>{selectedTrainer.experience}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-white rounded-xl shadow-sm border p-4 xl:p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-bold text-emerald-600">
                          <span>Total:</span>
                          <span>₹{calculateTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Booking Steps */}
            <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-10 overflow-x-auto">
                <div className="flex items-center min-w-max px-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                          currentStep >= step ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 5 && (
                        <div
                          className={`w-8 sm:w-12 lg:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                            currentStep > step ? "bg-emerald-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Labels */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="text-center px-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {currentStep === 1 && "Choose Your Trainer"}
                    {currentStep === 2 && "Select Date & Time"}
                    {currentStep === 3 && "Review Summary"}
                    {currentStep === 4 && "Payment Method"}
                    {currentStep === 5 && "Contact Details"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {currentStep === 1 && "Select from our certified yoga instructors"}
                    {currentStep === 2 && "Pick your preferred date and time slot"}
                    {currentStep === 3 && "Review your booking details"}
                    {currentStep === 4 && "Choose how you'd like to pay"}
                    {currentStep === 5 && "Provide your contact information"}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] sm:min-h-[400px]">
                {/* Step 1: Choose Trainer */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {trainers.map((trainer) => (
                      <div
                        key={trainer.id}
                        onClick={() => setSelectedTrainer(trainer)}
                        className={`cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                          selectedTrainer?.id === trainer.id
                            ? "border-emerald-500 bg-emerald-50 shadow-lg"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                          <img
                            src={trainer.image || "/placeholder.svg"}
                            alt={trainer.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{trainer.name}</h3>
                            <p className="text-emerald-600 font-medium text-xs sm:text-sm">{trainer.specialization}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                              <span className="text-xs sm:text-sm font-medium">{trainer.rating}</span>
                              <span className="text-xs sm:text-sm text-gray-500">({trainer.reviews})</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-emerald-600 text-sm sm:text-base">{trainer.price}</div>
                            <div className="text-xs text-gray-500">per session</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-xs sm:text-sm font-bold text-gray-900">{trainer.sessions}+</div>
                            <div className="text-xs text-gray-600">Sessions</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-xs sm:text-sm font-bold text-emerald-600">{trainer.successRate}</div>
                            <div className="text-xs text-gray-600">Success Rate</div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{trainer.bio}</p>

                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{trainer.location}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {trainer.experience}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2: Date & Time Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Calendar */}
                    <div>
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </h3>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div
                            key={day}
                            className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {generateCalendarDates().map((date, index) => {
                          const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                          const isAvailable = isDateAvailable(date)
                          const isSelected = selectedDate === formatDate(date)
                          const isToday = formatDateForCalendar(date) === formatDateForCalendar(new Date())

                          return (
                            <button
                              key={index}
                              onClick={() => isAvailable && isCurrentMonth && setSelectedDate(formatDate(date))}
                              disabled={!isAvailable || !isCurrentMonth}
                              className={`p-2 sm:p-3 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 ${
                                isSelected
                                  ? "bg-emerald-600 text-white shadow-lg scale-105"
                                  : isToday
                                    ? "bg-cyan-100 text-cyan-600 font-semibold"
                                    : isAvailable && isCurrentMonth
                                      ? "hover:bg-emerald-50 text-gray-900 hover:scale-105"
                                      : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="animate-in slide-in-from-bottom duration-300">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                          Available Time Slots
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                                selectedTime === slot.time
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105"
                                  : slot.available
                                    ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:scale-105"
                                    : "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                              }`}
                            >
                              <div className="font-semibold">{slot.time}</div>
                              <div className="text-xs opacity-75">₹{slot.price}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDate && selectedTime && (
                      <div className="animate-in slide-in-from-bottom duration-300">
                        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 sm:p-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Session Address</h3>
                          </div>
                          <div>
                            <Label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-3 block">
                              Where should the trainer come? *
                            </Label>
                            <Textarea
                              id="address"
                              placeholder="Enter your complete address including apartment/house number, street, area, city, and pincode..."
                              value={bookingData.clientAddress}
                              onChange={(e) => setBookingData({ ...bookingData, clientAddress: e.target.value })}
                              className="min-h-[100px] sm:min-h-[120px] w-full"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                              Please provide a detailed address so our trainer can reach you easily.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Summary */}
                {currentStep === 3 && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 sm:p-8">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Booking Summary</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Service Details */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900">Service Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Service:</span>
                              <span className="font-medium text-right">{service.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{service.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Base Price:</span>
                              <span className="font-medium">{service.price}</span>
                            </div>
                          </div>
                        </div>

                        {/* Trainer & Schedule */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900">Trainer & Schedule</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trainer:</span>
                              <span className="font-medium text-right">{selectedTrainer?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time:</span>
                              <span className="font-medium">{selectedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {bookingData.clientAddress && (
                        <div className="mt-6 pt-6 border-t border-emerald-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Session Location</h4>
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                              <p className="text-sm text-gray-700 leading-relaxed">{bookingData.clientAddress}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-semibold text-gray-900">Total Amount:</span>
                          <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                            ₹{calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="requests" className="text-sm sm:text-base font-semibold text-gray-900 mb-3 block">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="requests"
                        placeholder="Any specific requirements, health conditions, or preferences..."
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        className="min-h-[100px] sm:min-h-[120px]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Payment Method */}
                {currentStep === 4 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {paymentMethods.map((method) => {
                        const IconComponent = method.icon
                        return (
                          <button
                            key={method.id}
                            onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                            className={`p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                              bookingData.paymentMethod === method.id
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                                : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                            }`}
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div
                                className={`p-2 sm:p-3 rounded-lg ${
                                  bookingData.paymentMethod === method.id ? "bg-white/20" : "bg-emerald-100"
                                }`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    bookingData.paymentMethod === method.id ? "text-white" : "text-emerald-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-base sm:text-lg">{method.name}</h4>
                                <p
                                  className={`text-xs sm:text-sm ${
                                    bookingData.paymentMethod === method.id ? "text-white/80" : "text-gray-600"
                                  }`}
                                >
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-cyan-900 mb-2">Payment Security</h4>
                      <ul className="text-xs sm:text-sm text-cyan-800 space-y-1">
                        <li>• All payments are processed securely</li>
                        <li>• Your financial information is encrypted and protected</li>
                        <li>• Refunds available as per our cancellation policy</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 5: Contact Information */}
                {currentStep === 5 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-3 block">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={bookingData.clientName}
                          onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                          className="w-full p-3 sm:p-4 text-sm sm:text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-3 block">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={bookingData.clientEmail}
                          onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                          className="w-full p-3 sm:p-4 text-sm sm:text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-3 block">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={bookingData.clientPhone}
                          onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
                          className="w-full p-3 sm:p-4 text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">Booking Terms & Conditions</h4>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                        <li>• Cancellation allowed up to 24 hours before the session</li>
                        <li>• Payment will be collected as per selected method</li>
                        <li>• Please ensure you have a suitable space for the session</li>
                        <li>• Trainer will arrive 10 minutes before the scheduled time</li>
                        <li>• Rescheduling is allowed once without additional charges</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 lg:pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : handleClose())}
                  className="bg-transparent px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                >
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                <Button
                  onClick={() => {
                    if (currentStep === 5) {
                      handleBooking()
                    } else {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                  disabled={!canProceedToNextStep() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : currentStep === 5 ? (
                    <span className="hidden sm:inline">Complete Booking</span>
                  ) : (
                    <span className="hidden sm:inline">Next Step</span>
                  )}
                  {currentStep === 5 && <span className="sm:hidden">Complete</span>}
                  {currentStep < 5 && <span className="sm:hidden">Next</span>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
