"use client"

import { useState } from "react"
import { Clock, User, MapPin, Star, X, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Trainer {
  id: number
  name: string
  specialization: string
  experience: string
  rating: number
  reviews: number
  location: string
  image: string
  price: string
  availability: string
  bio: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  trainer: Trainer | null
}

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface BookingData {
  date: string
  time: string
  specialRequests: string
  clientName: string
  clientEmail: string
  clientPhone: string
}

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

export function BookingModal({ isOpen, onClose, trainer }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    time: "",
    specialRequests: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
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
    return date.toISOString().split("T")[0]
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0 // Not Sunday and not in the past
  }

  const calculateTotalPrice = () => {
    const basePrice = Number.parseInt(trainer?.price?.replace(/[^\d]/g, "") || "1200")
    const selectedTimeSlot = timeSlots.find((slot) => slot.time === selectedTime)
    const timePrice = selectedTimeSlot?.price || basePrice

    return Math.round(timePrice)
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
    setSelectedDate("")
    setSelectedTime("")
    setBookingComplete(false)
    setBookingData({
      date: "",
      time: "",
      specialRequests: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
    })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen || !trainer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {bookingComplete ? (
          // Success Screen
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Booking Confirmed!</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Your session with {trainer.name} has been successfully booked.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Booking Details:</h3>
              <div className="space-y-1.5 sm:space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-green-600">₹{calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-4">
              A confirmation email has been sent to your email address with all the details.
            </p>
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full max-h-[95vh] sm:max-h-[90vh]">
            {/* Left Panel - Trainer Info (hidden on mobile, shown as header on mobile) */}
            <div className="lg:w-1/3 bg-gradient-to-br from-green-50 to-blue-50 p-3 sm:p-4 lg:p-6 flex flex-col">
              <div className="flex-1">
                <div className="text-center mb-4 sm:mb-6">
                  <img
                    src={trainer.image || "/placeholder.svg"}
                    alt={trainer.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-2 sm:mb-4 object-cover shadow-lg"
                  />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{trainer.name}</h3>
                  <p className="text-green-600 font-medium text-sm sm:text-base">{trainer.specialization}</p>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{trainer.rating}</span>
                    <span className="text-xs sm:text-sm text-gray-500">({trainer.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-4 hidden lg:block">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>{trainer.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>{trainer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>{trainer.availability}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg hidden lg:block">
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{trainer.bio}</p>
                </div>
              </div>

              {/* Price Summary */}
              {selectedDate && selectedTime && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Booking Summary</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                      <div className="flex justify-between font-bold text-green-600">
                        <span>Total:</span>
                        <span>₹{calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Booking Steps */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                        currentStep >= step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 2 && (
                      <div
                        className={`w-12 sm:w-16 h-0.5 sm:h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                          currentStep > step ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] sm:min-h-[400px] overflow-y-auto flex-1 pb-16 sm:pb-20">
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Select Date & Time</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Choose your preferred date and time slot</p>
                    </div>

                    {/* Calendar */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </h3>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                            }
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                            }
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div
                            key={day}
                            className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                        {generateCalendarDates().map((date, index) => {
                          const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                          const isAvailable = isDateAvailable(date)
                          const isSelected = selectedDate === formatDate(date)
                          const isToday = formatDate(date) === formatDate(new Date())

                          return (
                            <button
                              key={index}
                              onClick={() => isAvailable && isCurrentMonth && setSelectedDate(formatDate(date))}
                              disabled={!isAvailable || !isCurrentMonth}
                              className={`p-1.5 sm:p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                                isSelected
                                  ? "bg-green-600 text-white shadow-lg"
                                  : isToday
                                    ? "bg-blue-100 text-blue-600 font-medium"
                                    : isAvailable && isCurrentMonth
                                      ? "hover:bg-green-50 text-gray-900"
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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Available Time Slots
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 ${
                                selectedTime === slot.time
                                  ? "bg-green-600 text-white border-green-600 shadow-lg"
                                  : slot.available
                                    ? "border-gray-200 hover:border-green-300 hover:bg-green-50"
                                    : "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                              }`}
                            >
                              <div>{slot.time}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Contact Information</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Please provide your details to complete the booking
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={bookingData.clientName}
                          onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                          className="w-full text-sm sm:text-base"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={bookingData.clientEmail}
                          onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                          className="w-full text-sm sm:text-base"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={bookingData.clientPhone}
                          onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
                          className="w-full text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex-shrink-0 flex justify-between items-center px-2 sm:px-4 lg:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 absolute bottom-0 left-0 right-0">
                <Button
                  variant="outline"
                  onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : handleClose())}
                  className="bg-transparent text-sm sm:text-base px-3 sm:px-4"
                >
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                <Button
                  onClick={() => {
                    if (currentStep === 2) {
                      handleBooking()
                    } else {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                  disabled={
                    (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                    (currentStep === 2 &&
                      (!bookingData.clientName || !bookingData.clientEmail || !bookingData.clientPhone)) ||
                    isLoading
                  }
                  className="bg-green-600 hover:bg-green-700 min-w-[100px] sm:min-w-[120px] text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking...</span>
                    </div>
                  ) : currentStep === 2 ? (
                    "Complete Booking"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
