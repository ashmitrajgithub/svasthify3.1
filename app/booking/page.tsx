"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import {
  User,
  MapPin,
  Star,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Shield,
  Search,
  X,
  Check,
  BadgeCheck,
  Briefcase,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Service {
  title: string
  price: string
  duration: string
  description: string
  features: string[]
  category: string
  difficulty: string
  rating: number
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
  isVerified: boolean
}

interface BookingData {
  trainer: Trainer | null
  date: string
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  paymentMethod: "card" | "upi" | "cash"
  specialRequests: string
  // Added structured address fields
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

const fetchAddressSuggestions = async (query: string): Promise<any[]> => {
  try {
    console.log("[v0] Fetching address suggestions for:", query)

    // Use our server-side API route instead of direct Google Places API call
    const url = `/api/places?query=${encodeURIComponent(query)}`

    console.log("[v0] API route URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] API response:", data)

    if (data.error) {
      throw new Error(data.error)
    }

    console.log("[v0] Final formatted suggestions:", data.suggestions)
    return data.suggestions || []
  } catch (error) {
    console.error("[v0] Error fetching address suggestions:", error)

    const fallbackSuggestions = [
      { description: "Connaught Place, New Delhi, Delhi, India", place_id: null },
      { description: "Sector 18, Noida, Uttar Pradesh, India", place_id: null },
      { description: "Cyber City, Gurgaon, Haryana, India", place_id: null },
      { description: "Khan Market, New Delhi, Delhi, India", place_id: null },
      { description: "Sector 29, Gurgaon, Haryana, India", place_id: null },
      { description: "Greater Noida, Uttar Pradesh, India", place_id: null },
    ]
    return fallbackSuggestions
  }
}

const fetchPlaceDetails = async (placeId: string) => {
  try {
    console.log("[v0] Fetching place details for:", placeId)

    const response = await fetch(`/api/places/details?place_id=${encodeURIComponent(placeId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Place details response:", data)

    return data
  } catch (error) {
    console.error("[v0] Error fetching place details:", error)
    return null
  }
}

const services = [
  {
    title: "Personal Yoga Training",
    description: "One-on-one yoga sessions tailored to your fitness level and wellness goals.",
    features: ["Customized routines", "Posture correction", "Breathing techniques", "Flexibility improvement"],
    price: "₹1,200",
    duration: "60 min",
    rating: 4.9,
    category: "yoga",
    difficulty: "beginner",
  },
  {
    title: "Meditation & Mindfulness",
    description: "Guided meditation sessions to reduce stress and improve mental clarity.",
    features: ["Stress reduction", "Better focus", "Emotional balance", "Sleep improvement"],
    price: "₹800",
    duration: "45 min",
    rating: 4.8,
    category: "meditation",
    difficulty: "beginner",
  },
  {
    title: "Wellness Coaching",
    description: "Comprehensive lifestyle coaching covering nutrition, habits, and wellness practices.",
    features: ["Nutrition guidance", "Lifestyle planning", "Goal setting", "Progress tracking"],
    price: "₹1,500",
    duration: "90 min",
    rating: 5.0,
    category: "coaching",
    difficulty: "intermediate",
  },
  {
    title: "Prenatal Yoga",
    description: "Safe and gentle yoga practices designed specifically for expecting mothers.",
    features: ["Safe poses", "Breathing for labor", "Pelvic floor strength", "Stress relief"],
    price: "₹1,000",
    duration: "50 min",
    rating: 4.9,
    category: "yoga",
    difficulty: "beginner",
  },
  {
    title: "Power Yoga",
    description: "Dynamic and challenging yoga sequences to build strength and endurance.",
    features: ["Strength building", "Cardio benefits", "Core strengthening", "Flexibility"],
    price: "₹1,400",
    duration: "75 min",
    rating: 4.7,
    category: "yoga",
    difficulty: "advanced",
  },
  {
    title: "Ayurvedic Consultation",
    description: "Traditional Ayurvedic health assessment and personalized wellness recommendations.",
    features: ["Body type analysis", "Diet recommendations", "Herbal guidance", "Lifestyle tips"],
    price: "₹2,000",
    duration: "90 min",
    rating: 4.8,
    category: "consultation",
    difficulty: "beginner",
  },
]

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
    isVerified: true,
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
    isVerified: true,
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
    isVerified: true,
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
    isVerified: false,
  },
]

const timeSlots = [
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

export default function BookingPage() {
  const searchParams = useSearchParams()
  const serviceTitle = searchParams.get("service")

  const [currentStep, setCurrentStep] = useState(1) // Start at Step 1
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const [serviceFilters, setServiceFilters] = useState({
    category: "all",
    difficulty: "all",
    priceRange: "all",
    rating: "all",
  })
  const [serviceSortBy, setServiceSortBy] = useState("rating")
  const [serviceSearchQuery, setServiceSearchQuery] = useState("")

  // State for the new trainer filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedRating, setSelectedRating] = useState("")

  const [trainerFilters, setTrainerFilters] = useState({
    specialization: "all",
    experience: "all",
    location: "all",
    rating: "all",
  })
  const [trainerSortBy, setTrainerSortBy] = useState("rating")
  const [trainerSearchQuery, setTrainerSearchQuery] = useState("")

  const [filteredServices, setFilteredServices] = useState(services)
  const [filteredTrainers, setFilteredTrainers] = useState(trainers)

  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

  const timeSlotsRef = useRef<HTMLDivElement>(null)

  const [bookingData, setBookingData] = useState<BookingData>({
    trainer: null,
    date: "",
    time: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "", // This field is now redundant with structured fields
    paymentMethod: "card",
    specialRequests: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  })

  const steps = [
    { id: 1, title: "Trainer" },
    { id: 2, title: "Schedule" },
    { id: 3, title: "Payment" },
  ]

  const parseFormattedDate = (s: string | null | undefined) => {
    if (!s) return undefined
    // Try the native parser first
    const native = new Date(s)
    if (!isNaN(native.getTime())) return native

    // Fallback for en-GB short formats: "Tue, 24 Sep 2025" or "Tue, 24 Sept 2025"
    try {
      const cleaned = s.replace(/,/g, "").trim() // "Tue 24 Sep 2025"
      const parts = cleaned.split(/\s+/) // ["Tue","24","Sep","2025"]
      // Expect at least 4 parts; if weekday present, skip it
      let dayStr = "",
        monStr = "",
        yearStr = ""
      if (parts.length >= 4) {
        ;[/*weekday*/ , dayStr, monStr, yearStr] = parts
      } else if (parts.length === 3) {
        ;[dayStr, monStr, yearStr] = parts
      }
      const day = Number.parseInt(dayStr, 10)
      const monMap: Record<string, number> = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Sept: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      }
      const month = monMap[monStr as keyof typeof monMap]
      const year = Number.parseInt(yearStr, 10)
      if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined
      const d = new Date(year, month, day)
      d.setHours(0, 0, 0, 0)
      return d
    } catch {
      return undefined
    }
  }

  // --- REBUILT USEEFFECT FOR FILTERS AND SORTING ---
  // The service filters and sort logic is removed because the section is gone.
  // The trainer filters and sort logic remains.

  useEffect(() => {
    const filtered = trainers.filter((trainer) => {
      const specializationMatch =
        trainerFilters.specialization === "all" ||
        trainer.specialization.toLowerCase().includes(trainerFilters.specialization.toLowerCase())

      const experienceMatch =
        trainerFilters.experience === "all" ||
        (() => {
          const years = Number.parseInt(trainer.experience)
          switch (trainerFilters.experience) {
            case "5-":
              return years < 5
            case "5-10":
              return years >= 5 && years <= 10
            case "10+":
              return years > 10
            default:
              return true
          }
        })()

      const locationMatch =
        trainerFilters.location === "all" ||
        trainer.location.toLowerCase().includes(trainerFilters.location.toLowerCase())

      const ratingMatch =
        trainerFilters.rating === "all" ||
        (() => {
          switch (trainerFilters.rating) {
            case "4+":
              return trainer.rating >= 4
            case "4.5+":
              return trainer.rating >= 4.5
            case "5":
              return trainer.rating === 5
            default:
              return true
          }
        })()

      const searchMatch =
        trainerSearchQuery === "" ||
        trainer.name.toLowerCase().includes(trainerSearchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(trainerSearchQuery.toLowerCase()) ||
        trainer.bio.toLowerCase().includes(trainerSearchQuery.toLowerCase())

      return specializationMatch && experienceMatch && locationMatch && ratingMatch && searchMatch
    })

    // Sort trainers
    filtered.sort((a, b) => {
      switch (trainerSortBy) {
        case "price-low":
          return Number.parseInt(a.price.replace(/[^0-9]/g, "")) - Number.parseInt(b.price.replace(/[^0-9]/g, ""))
        case "price-high":
          return Number.parseInt(b.price.replace(/[^0-9]/g, "")) - Number.parseInt(a.price.replace(/[^0-9]/g, ""))
        case "experience":
          return Number.parseInt(b.experience) - Number.parseInt(a.experience)
        case "rating":
          return b.rating - a.rating
        case "sessions":
          return b.sessions - a.sessions
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredTrainers(filtered)
  }, [trainerFilters, trainerSortBy, trainerSearchQuery])

  // Effect for the new trainer filters
  useEffect(() => {
    const filtered = trainers.filter((trainer) => {
      const specializationMatch =
        !selectedSpecialization || trainer.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase())
      const experienceMatch =
        !selectedExperience || trainer.experience.toLowerCase().includes(selectedExperience.toLowerCase())
      const ratingMatch =
        !selectedRating ||
        (() => {
          const rating = Number.parseFloat(trainer.rating.toString())
          if (selectedRating === "4.5+") return rating >= 4.5
          if (selectedRating === "4.0+") return rating >= 4.0
          if (selectedRating === "3.5+") return rating >= 3.5
          return true
        })()
      const searchMatch =
        !searchQuery ||
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.bio.toLowerCase().includes(searchQuery.toLowerCase())

      return specializationMatch && experienceMatch && ratingMatch && searchMatch
    })

    // Sort trainers (you might want to add sorting logic here too if needed)
    filtered.sort((a, b) => {
      // Example: Sort by rating descending
      if (trainerSortBy === "rating") {
        return b.rating - a.rating
      }
      // Add other sorting options if necessary
      return 0
    })

    setFilteredTrainers(filtered)
  }, [searchQuery, selectedSpecialization, selectedExperience, selectedRating, trainerSortBy])

  // Auto-select service if coming from URL
  useEffect(() => {
    if (serviceTitle) {
      const service = services.find((s) => s.title === serviceTitle)
      if (service) {
        setSelectedService(service)
      }
    }
  }, [serviceTitle])

  // Reset selectedTime when selectedDate changes to avoid stale selection
  useEffect(() => {
    setSelectedTime("")
  }, [selectedDate])

  const handleBooking = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setBookingComplete(true)
    setIsLoading(false)
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedTrainer !== null
      case 2:
        // Only require date and time here (address moved to Step 3)
        return Boolean(selectedDate && selectedTime)
      case 3: {
        // Require contact info + structured address fields
        const hasContact = Boolean(bookingData.clientName && bookingData.clientEmail && bookingData.clientPhone)
        const hasAddress = Boolean(
          (bookingData.addressLine1 || "").trim() &&
            (bookingData.city || "").trim() &&
            (bookingData.postalCode || "").trim(),
        )
        return hasContact && hasAddress
      }
      default:
        return false
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedTrainer) return 0
    // Use a default price if trainer price is not available or invalid
    const basePrice = Number.parseInt(selectedTrainer.price.replace(/[^\d]/g, "") || "1200")
    const selectedTimeSlot = timeSlots.find((slot) => slot.time === selectedTime)
    // Use the time slot's price if available, otherwise fall back to base price
    const timePrice = selectedTimeSlot?.price || basePrice
    return timePrice
  }

  const generateCalendarDates = () => {
    const dates = []
    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
    const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)
    const startDate = new Date(startOfMonth)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find the first day of the week for the start of the month
    while (startDate.getDay() !== 0) {
      // Sunday is 0
      startDate.setDate(startDate.getDate() - 1)
    }

    for (let i = 0; i < 42; i++) {
      // Display 6 weeks (42 days)
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      // Only add dates within the current month or the preceding/following days needed to fill the grid
      if (
        date.getMonth() !== calendarMonth.getMonth() &&
        date.toDateString() !== startOfMonth.toDateString() &&
        date.toDateString() !== endOfMonth.toDateString()
      ) {
        // If it's not the start or end of the month, and not in the current month, skip it.
        // This ensures we don't show too many days from adjacent months if the grid is already full.
        if (date < startOfMonth || date > endOfMonth) continue
      }
      dates.push(date)
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

  const handleResetTrainerFilters = () => {
    setTrainerFilters({
      specialization: "all",
      experience: "all",
      location: "all",
      rating: "all",
    })
    setTrainerSearchQuery("")
    setTrainerSortBy("rating")
  }

  const handleDateSelection = (date: Date) => {
    setSelectedDate(formatDate(date))

    // Auto-scroll to time slots section after a short delay
    setTimeout(() => {
      if (timeSlotsRef.current) {
        timeSlotsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 100)
  }

  const handleAddressChange = async (value: string) => {
    setBookingData({ ...bookingData, addressLine1: value })

    if (value.length > 2) {
      setIsLoadingAddresses(true)
      setShowAddressSuggestions(true)

      try {
        console.log("[v0] Starting address search for:", value)
        const suggestions = await fetchAddressSuggestions(value)
        console.log("[v0] Got suggestions:", suggestions)
        setAddressSuggestions(suggestions)
      } catch (error) {
        console.error("[v0] Failed to fetch address suggestions:", error)
        setAddressSuggestions([])
      } finally {
        setIsLoadingAddresses(false)
      }
    } else {
      setShowAddressSuggestions(false)
      setAddressSuggestions([])
    }
  }

  const selectAddressSuggestion = async (suggestion: any) => {
    const description = typeof suggestion === "string" ? suggestion : suggestion.description
    const placeId = typeof suggestion === "object" ? suggestion.place_id : null

    const parts = description.split(", ")
    let addressLine1 = description
    let city = ""
    let state = ""

    if (parts.length >= 3) {
      // Google Places format: "Street, Area, City, State, Country"
      addressLine1 = parts.slice(0, -3).join(", ") // Everything except last 3 parts (City, State, Country)
      city = parts[parts.length - 3] // Third to last part (City)
      state = parts[parts.length - 2] // Second to last part (State)
    } else if (parts.length === 2) {
      // Format: "Location, City"
      addressLine1 = parts[0]
      city = parts[1]
    }

    // Map state names to lowercase with hyphens
    let mappedState = ""
    const lowerState = state.toLowerCase()
    if (lowerState.includes("delhi")) {
      mappedState = "delhi"
    } else if (lowerState.includes("haryana")) {
      mappedState = "haryana"
    } else if (lowerState.includes("uttar-pradesh")) {
      mappedState = "uttar-pradesh"
    } else if (lowerState.includes("punjab")) {
      mappedState = "punjab"
    } else if (lowerState.includes("rajasthan")) {
      mappedState = "rajasthan"
    } else {
      mappedState = state.toLowerCase().replace(/\s+/g, "-")
    }

    let postalCode = ""
    if (placeId) {
      console.log("[v0] Fetching postal code for place:", placeId)
      const placeDetails = await fetchPlaceDetails(placeId)
      if (placeDetails && placeDetails.postal_code) {
        postalCode = placeDetails.postal_code
        console.log("[v0] Auto-filled postal code:", postalCode)

        // Also update city and state from place details if available
        if (placeDetails.city) city = placeDetails.city
        if (placeDetails.state) {
          const detailState = placeDetails.state.toLowerCase().replace(/\s+/g, "-")
          mappedState = detailState
        }
      }
    }

    setBookingData({
      ...bookingData,
      addressLine1: addressLine1,
      city: city,
      state: mappedState,
      postalCode: postalCode, // Auto-populated postal code
    })

    setShowAddressSuggestions(false)
    setAddressSuggestions([])
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full text-center shadow-2xl">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your {selectedService?.title} session has been successfully booked.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trainer:</span>
                <span className="font-semibold">{selectedTrainer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600 text-lg">₹{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>

          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* Header - Made sticky */}
      <div className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 1) {
                  // Start navigation from step 1
                  setCurrentStep(currentStep - 1)
                } else {
                  window.location.href = "/"
                }
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{currentStep > 1 ? "Back" : "Back to Home"}</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Book Your <span className="text-green-600">Session</span>
            </h1>

            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* NEW: Stepper Navigation */}
        {/* <div className="flex items-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-green-600 text-white"
                      : currentStep === step.id
                        ? "bg-green-500 text-white ring-4 ring-green-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-6 h-6" /> : <span>{step.id + 1}</span>}
                </div>
                <p
                  className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                    currentStep >= step.id ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors duration-500 ${
                    currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div> */}

        {/* Step-based Content */}
        <div className="bg-white/60 backdrop-blur-sm border border-green-100/80 rounded-2xl p-4 md:p-8">
          {/* Step 0: Select Service - REMOVED */}

          {/* Step 1: Choose Trainer */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div
                role="region"
                aria-label="Trainer filters"
                className="sticky top-16 z-10 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl py-4 px-2"
              >
                <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[280px] max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search trainers by name, specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200/60 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400/50 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2">
                    {/* Specialization Filter */}
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="px-4 py-2.5 bg-white/80 border border-gray-200/60 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <option value="">All Specializations</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Mental Health">Mental Health</option>
                    </select>

                    {/* Experience Filter */}
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="px-4 py-2.5 bg-white/80 border border-gray-200/60 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <option value="">Any Experience</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>

                    {/* Rating Filter */}
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="px-4 py-2.5 bg-white/80 border border-gray-200/60 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5+">4.5+ Stars</option>
                      <option value="4.0+">4.0+ Stars</option>
                      <option value="3.5+">3.5+ Stars</option>
                    </select>

                    {/* Clear Filters Button */}
                    {(searchQuery || selectedSpecialization || selectedExperience || selectedRating) && (
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedSpecialization("")
                          setSelectedExperience("")
                          setSelectedRating("")
                        }}
                        className="px-4 py-2.5 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/60 rounded-full text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-center mt-3">
                  <span className="text-sm text-gray-500 font-medium">
                    {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              </div>

              {/* REBUILT: Trainers Grid with new card design */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {filteredTrainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedTrainer(trainer)
                      }
                    }}
                    onClick={() => {
                      console.log("[v0] Trainer clicked:", trainer.name, trainer.id)
                      console.log("[v0] Current selectedTrainer:", selectedTrainer?.id)
                      setSelectedTrainer(trainer)
                      console.log("[v0] Setting selectedTrainer to:", trainer.id)
                    }}
                    className={`group relative cursor-pointer rounded-2xl p-[1px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                      selectedTrainer?.id === trainer.id
                        ? "bg-gradient-to-br from-green-400/40 via-green-300/30 to-transparent shadow-2xl shadow-green-500/20"
                        : "bg-gradient-to-br from-green-200/40 via-transparent to-transparent hover:from-green-300/50"
                    }`}
                  >
                    {/* Inner card surface */}
                    <div
                      className={`rounded-2xl p-6 border transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 ${
                        selectedTrainer?.id === trainer.id
                          ? "border-green-400/80 bg-gradient-to-br from-green-50/80 to-green-100/40 shadow-lg shadow-green-500/10"
                          : "border-green-200/50 group-hover:border-green-300/50 bg-white"
                      }`}
                    >
                      {/* Selected pill */}
                      {selectedTrainer?.id === trainer.id && (
                        <div className="absolute left-3 top-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      <div className="flex items-start gap-6">
                        {/* Avatar with subtle glow on hover */}
                        <div className="relative flex-shrink-0">
                          {/* decorative hover glow */}
                          <div
                            className="absolute -inset-1 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/10 blur opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            aria-hidden="true"
                          />
                          <img
                            src={trainer.image || "/03.jpg"}
                            alt={trainer.name}
                            className="relative w-24 h-24 rounded-xl object-cover object-center ring-2 ring-green-300/30"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-800 text-xl text-pretty">{trainer.name}</h3>
                                {trainer.isVerified && (
                                  <Badge className="bg-green-600 hover:bg-green-600 text-white font-semibold text-xs py-1 px-2.5 rounded-full inline-flex items-center gap-1">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    <span>Verified</span>
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-600 mt-0.5">{trainer.title}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600 text-xl md:text-2xl">{trainer.price}</div>
                            </div>
                          </div>

                          {/* Ratings and experience */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="inline-flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{trainer.rating}</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <div className="inline-flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{trainer.experience}</span>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{trainer.bio}</p>

                          {/* Optional: quick tags (languages) */}
                        </div>
                      </div>

                      {/* Stats footer */}
                      <div className="flex justify-between items-center text-sm text-gray-600 border-t border-green-200 mt-4 pt-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-green-500" />
                          <span>
                            <span className="font-bold text-gray-800">{trainer.sessions}+</span> Sessions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>
                            <span className="font-bold text-gray-800">{trainer.successRate}</span> Success Rate
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{trainer.location.split(",")[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 left-0 right-0 z-10 mt-6 p-4 bg-white/95 backdrop-blur-sm border-t border-green-200 shadow-lg flex items-center justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToNextStep()}
                  aria-label="Continue to schedule"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Schedule Your Session</h2>
                <p className="text-gray-600 text-lg">Pick your preferred date and time</p>
              </div> */}
              {/* Redesign "Select Date" into a two-column layout inspired by the provided reference */}
              <div className="grid gap-6 md:grid-cols-[320px,1fr]">
                {/* LEFT: Bold green sidebar */}
                <aside className="relative overflow-hidden rounded-2xl bg-green-600 text-white p-6 md:p-8">
                  {/* subtle gradients */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl"
                  />

                  {/* Giant day number + weekday */}
                  <div className="relative">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[88px] leading-none font-extrabold tracking-tight">
                        {(parseFormattedDate(selectedDate) ?? new Date()).getDate()}
                      </span>
                      <span className="uppercase text-white/80 font-semibold text-lg tracking-widest">
                        {(parseFormattedDate(selectedDate) ?? new Date()).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </span>
                    </div>
                    <div className="mt-4 text-white/90">
                      <div className="text-sm opacity-80">
                        {(parseFormattedDate(selectedDate) ?? new Date()).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Current Events */}
                  <div className="mt-8">
                    <h4 className="text-base font-semibold mb-2">Booking Summary</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm leading-6">
                          <span className="font-semibold">Service:</span>{" "}
                          {selectedService ? selectedService.title : "Not selected"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm leading-6">
                          <span className="font-semibold">Trainer:</span>{" "}
                          {selectedTrainer ? selectedTrainer.name : "Not selected"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm leading-6">
                          <span className="font-semibold">Date:</span> {selectedDate || "Not selected"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm leading-6">
                          <span className="font-semibold">Time:</span> {selectedTime || "Not selected"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm leading-6">
                          <span className="font-semibold">Address:</span>{" "}
                          {(bookingData.addressLine1 || "").trim() ? "Provided" : "Not provided"}
                        </span>
                      </li>
                    </ul>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm leading-6">
                        <span className="font-semibold">Est. Total:</span> ₹{calculateTotalPrice()}
                      </span>
                      {selectedService && (
                        <span className="text-xs text-white/80">
                          {selectedDate ? (selectedTime ? "All set!" : "Choose a time") : "Choose a date"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Create Event CTA */}
                  <div className="mt-8 pt-4 border-t border-white/20">
                    {selectedTrainer ? (
                      <div className="flex items-center gap-3">
                        {selectedTrainer.image ? (
                          <img
                            src={selectedTrainer.image || "/placeholder.svg"}
                            alt={`${selectedTrainer.name} profile`}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/60"
                          />
                        ) : (
                          <div
                            aria-label="Trainer initials"
                            className="h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold ring-2 ring-white/30"
                          >
                            {selectedTrainer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-white/80">Trainer</p>
                          <p className="truncate font-semibold">{selectedTrainer.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 opacity-80">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20" />
                        <div>
                          <p className="text-sm text-white/80">Trainer</p>
                          <p className="font-semibold">Not selected</p>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

                {/* RIGHT: Month strip + refined calendar */}
                <section
                  role="region"
                  aria-label="Date picker"
                  className="relative overflow-hidden rounded-2xl p-5 md:p-6 border border-green-200/70 bg-white/90 backdrop-blur-md shadow-xl"
                >
                  {/* Header: Year controls + Month strip */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Previous year"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear() - 1, calendarMonth.getMonth(), 1))
                        }
                        className="rounded-full hover:bg-green-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-200">
                        {calendarMonth.getFullYear()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Next year"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear() + 1, calendarMonth.getMonth(), 1))
                        }
                        className="rounded-full hover:bg-green-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-300">
                        {calendarMonth.toLocaleDateString("en-US", { month: "long" })}
                      </div>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full border border-green-200 bg-white hover:bg-green-50 text-green-700"
                        onClick={() => {
                          const t = new Date()
                          t.setHours(0, 0, 0, 0)
                          setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1))
                          setSelectedDate(formatDate(t))
                        }}
                      >
                        Today
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Previous month"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                        }
                        className="rounded-full hover:bg-green-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Next month"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                        }
                        className="rounded-full hover:bg-green-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div key={index} className="text-center text-gray-600 font-semibold text-sm">
                        {day}
                      </div>
                    ))}
                    {generateCalendarDates().map((date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const isPastDate = date < today
                      const isCurrentMonth = date.getMonth() === calendarMonth.getMonth()
                      const isToday = isSameDay(date, today)
                      const isSelected = isSameDay(date, parseFormattedDate(selectedDate) ?? new Date())

                      return (
                        <div
                          key={date.toISOString()}
                          className={`text-center p-2 rounded transition-all duration-200 ${
                            isToday ? "bg-green-10 text-green-700 font-semibold ring-2 ring-green-100" : ""
                          } ${isSelected ? "bg-green-100 text-green-600 font-semibold ring-2 ring-green-400" : ""} ${
                            !isCurrentMonth
                              ? "text-gray-300 cursor-not-allowed"
                              : isPastDate
                                ? "text-gray-400 cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-green-50 hover:text-green-700"
                          }`}
                          onClick={() => {
                            if (isCurrentMonth && !isPastDate) {
                              handleDateSelection(date)
                            }
                          }}
                        >
                          {date.getDate()}
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div
                  ref={timeSlotsRef}
                  className="mt-6 bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-green-200/80 shadow-xl animate-in slide-in-from-bottom duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Available Time Slots</h3>
                    <span className="text-sm text-gray-500">
                      {selectedTime ? `Selected: ${selectedTime}` : "Choose a time"}
                    </span>
                  </div>

                  {/* Show all slots with disabled state for unavailable times */}
                  {timeSlots && timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            aria-pressed={isSelected}
                            aria-label={`${slot.time}${slot.available ? "" : " (Unavailable)"}`}
                            title={slot.available ? `Select ${slot.time}` : "Unavailable"}
                            className={`h-10 rounded-lg border text-sm font-medium transition-all
                              ${isSelected ? "ring-2 ring-green-600 bg-green-50 text-green-700 border-green-300" : "border-green-200 bg-white text-gray-700 hover:bg-green-50"}
                              ${slot.available ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                          >
                            <span className="inline-flex items-center justify-center gap-2">
                              {slot.time}
                              {isSelected && <Check className="w-4 h-4 text-green-600" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-green-200 bg-green-50/50 p-6 text-center text-sm text-gray-600">
                      No time slots available for the selected date.
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)} aria-label="Go back to choose trainer">
                  <span className="inline-flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </span>
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToNextStep()}
                  aria-label="Continue to payment"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Contact Information - Now comes first */}
              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-8 shadow-lg border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
                    <p className="text-sm text-gray-600">We'll use this information to confirm your booking</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="clientName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        Full Name *
                      </Label>
                      <Input
                        id="clientName"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={bookingData.clientName}
                        onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                        className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="clientEmail"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-green-600" />
                        Email Address *
                      </Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        autoComplete="email"
                        placeholder="your.email@example.com"
                        value={bookingData.clientEmail}
                        onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                        className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="clientPhone"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-green-600" />
                        Phone Number *
                      </Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={bookingData.clientPhone}
                        onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
                        className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">Service Address *</span>
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-600">
                        Street Address
                      </Label>
                      <Input
                        id="addressLine1"
                        type="text"
                        autoComplete="address-line1"
                        placeholder="Start typing your address..."
                        value={bookingData.addressLine1}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() =>
                          bookingData.addressLine1 &&
                          bookingData.addressLine1.length > 2 &&
                          setShowAddressSuggestions(true)
                        }
                        className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />

                      {showAddressSuggestions && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                          <div className="p-2 border-b border-green-100 bg-green-50">
                            {isLoadingAddresses ? (
                              <p className="text-xs text-green-700 font-medium flex items-center gap-2">
                                <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                Searching addresses...
                              </p>
                            ) : (
                              <p className="text-xs text-green-700 font-medium">
                                {addressSuggestions.length} location{addressSuggestions.length !== 1 ? "s" : ""} found
                                <span className="text-green-600 ml-1">• Powered by Google Places</span>
                              </p>
                            )}
                          </div>

                          {isLoadingAddresses ? (
                            <div className="p-4">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 py-2">
                                  <div className="w-4 h-4 bg-green-100 rounded animate-pulse mt-0.5"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-green-100 rounded animate-pulse mb-1"></div>
                                    <div className="h-3 bg-green-50 rounded animate-pulse w-3/4"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : addressSuggestions.length > 0 ? (
                            addressSuggestions.map((suggestion, index) => {
                              const description = typeof suggestion === "string" ? suggestion : suggestion.description
                              const parts = description.split(", ")
                              const mainLocation = parts[0]
                              const area = parts.length > 2 ? parts[1] : ""
                              const cityState = parts.slice(-2).join(", ")

                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => selectAddressSuggestion(suggestion)}
                                  className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-green-50 last:border-b-0 flex items-start gap-3 transition-colors"
                                >
                                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate">{mainLocation}</div>
                                    {area && <div className="text-xs text-gray-600 truncate">{area}</div>}
                                    <div className="text-xs text-gray-500 truncate">{cityState}</div>
                                    {typeof suggestion === "object" && suggestion.place_id && (
                                      <div className="text-xs text-green-600 font-medium mt-1">
                                        📍 Postal code will be auto-filled
                                      </div>
                                    )}
                                  </div>
                                </button>
                              )
                            })
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No addresses found. Try a different search term.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-600">
                          City *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="City"
                          value={bookingData.city}
                          onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                          className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-gray-600">
                          PIN Code *
                        </Label>
                        <Input
                          id="postalCode"
                          type="text"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          placeholder="400001"
                          maxLength={6}
                          value={bookingData.postalCode}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, postalCode: e.target.value.replace(/\D/g, "") })
                          }
                          className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-gray-600">
                        State/Province
                      </Label>
                      <Select
                        value={bookingData.state}
                        onValueChange={(value) => setBookingData({ ...bookingData, state: value })}
                      >
                        <SelectTrigger className="h-12 bg-white border-green-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="west-bengal">West Bengal</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Your information is secure</p>
                        <p className="text-xs text-green-600 mt-1">
                          We use industry-standard encryption to protect your personal data and never share it with
                          third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {canProceedToNextStep() && (
                <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
                  {/* Header Section */}
                  <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-6">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Booking Summary</h3>
                        <p className="text-emerald-100 text-sm font-medium">Review your session details</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    {/* Session Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Service Card */}
                      <div className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                            <Briefcase className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Service</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{selectedService?.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedService?.duration}</p>
                          </div>
                        </div>
                      </div>

                      {/* Trainer Card */}
                      <div className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            {selectedTrainer?.image ? (
                              <img
                                src={selectedTrainer.image || "/placeholder.svg"}
                                alt={selectedTrainer.name}
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-200"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600" />
                              </div>
                            )}
                            {selectedTrainer?.isVerified && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Trainer</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{selectedTrainer?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedTrainer?.specialization}</p>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time Card */}
                      <div className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Date & Time</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{selectedDate}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Location Card */}
                      <div className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <Building2 className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{bookingData.city}</p>
                            <p className="text-sm text-gray-600 mt-1">{bookingData.addressLine1}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl"></div>
                      <div className="relative p-6 border border-emerald-200/50 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                              <CreditCard className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">Total Amount</p>
                              <p className="text-sm text-gray-600">Per session • All inclusive</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-bold text-emerald-600 tracking-tight">
                              ₹{calculateTotalPrice()}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">No hidden charges</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Verified Trainers</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium">Quality Assured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {/* <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <div key={method.id} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                          className={`p-2 rounded ${
                            bookingData.paymentMethod === method.id
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </button>
                        <div>
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div> */}

              {/* Special Requests */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Special Requests (Optional)</h3>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Any special requirements or notes for your trainer..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                />
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)} aria-label="Go back to schedule">
                  <span className="inline-flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </span>
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={!canProceedToNextStep() || isLoading}
                  aria-label="Complete booking"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Complete Booking
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
