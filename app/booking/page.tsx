"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Clock,
  User,
  MapPin,
  Star,
  ArrowLeft,
  SortAsc,
  CheckCircle,
  CreditCard,
  Shield,
  Search,
  X,
  RotateCw,
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

// Using OpenStreetMap Nominatim API for free address suggestions
const fetchAddressSuggestions = async (query: string): Promise<string[]> => {
  try {
    console.log("[v0] Fetching address suggestions for:", query)

    // Delhi NCR bounding box coordinates (more precise)
    // Southwest: 28.4089, 76.8473 | Northeast: 28.8842, 77.3489
    const boundingBox = "76.8473,28.4089,77.3489,28.8842"

    // Use a more reliable endpoint with better parameters
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=in&viewbox=${boundingBox}&bounded=1&q=${encodeURIComponent(query)}&city=Delhi&city=Gurgaon&city=Noida&city=Ghaziabad&city=Faridabad`

    console.log("[v0] API URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "AddressAutocomplete/1.0",
        Accept: "application/json",
      },
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Raw API response:", data)

    // Filter and format results to only include Delhi NCR locations
    const delhiNCRLocations = data.filter((item: any) => {
      const address = item.address || {}
      const state = address.state?.toLowerCase() || ""
      const city = address.city?.toLowerCase() || address.town?.toLowerCase() || address.village?.toLowerCase() || ""
      const district = address.state_district?.toLowerCase() || ""
      const displayName = item.display_name?.toLowerCase() || ""

      // Check if location is in Delhi NCR
      const isDelhi = state.includes("delhi") || displayName.includes("delhi")
      const isHaryana =
        (state.includes("haryana") || displayName.includes("haryana")) &&
        (city.includes("gurgaon") ||
          city.includes("gurugram") ||
          city.includes("faridabad") ||
          displayName.includes("gurgaon") ||
          displayName.includes("gurugram") ||
          displayName.includes("faridabad"))
      const isUP =
        (state.includes("uttar pradesh") || displayName.includes("uttar pradesh")) &&
        (city.includes("noida") ||
          city.includes("greater noida") ||
          city.includes("ghaziabad") ||
          displayName.includes("noida") ||
          displayName.includes("ghaziabad"))

      return isDelhi || isHaryana || isUP
    })

    console.log("[v0] Filtered Delhi NCR locations:", delhiNCRLocations.length)

    const formattedSuggestions = delhiNCRLocations
      .map((item: any) => {
        // Format the address nicely for Delhi NCR
        const address = item.address || {}
        const parts = []

        // Add house number and road
        if (address.house_number && address.road) {
          parts.push(`${address.house_number} ${address.road}`)
        } else if (address.road) {
          parts.push(address.road)
        }

        // Add neighbourhood or suburb
        if (address.neighbourhood) {
          parts.push(address.neighbourhood)
        } else if (address.suburb) {
          parts.push(address.suburb)
        }

        // Add city - prioritize specific NCR cities
        let cityName = ""
        if (address.city) {
          cityName = address.city
        } else if (address.town) {
          cityName = address.town
        } else if (address.village) {
          cityName = address.village
        }

        // Normalize city names for better display
        if (cityName.toLowerCase().includes("gurgaon")) {
          cityName = "Gurgaon"
        } else if (cityName.toLowerCase().includes("gurugram")) {
          cityName = "Gurugram"
        } else if (cityName.toLowerCase().includes("noida")) {
          cityName = "Noida"
        } else if (cityName.toLowerCase().includes("greater noida")) {
          cityName = "Greater Noida"
        } else if (cityName.toLowerCase().includes("ghaziabad")) {
          cityName = "Ghaziabad"
        } else if (cityName.toLowerCase().includes("faridabad")) {
          cityName = "Faridabad"
        } else if (cityName.toLowerCase().includes("delhi")) {
          cityName = "New Delhi"
        }

        if (cityName) {
          parts.push(cityName)
        }

        // Add state for clarity
        if (address.state && !address.state.toLowerCase().includes("delhi")) {
          parts.push(address.state)
        } else if (cityName !== "New Delhi") {
          parts.push("Delhi NCR")
        }

        const formatted = parts.join(", ") || item.display_name
        return formatted
      })
      .filter((suggestion, index, self) => self.indexOf(suggestion) === index) // Remove duplicates
      .slice(0, 8) // Limit to 8 suggestions

    console.log("[v0] Final formatted suggestions:", formattedSuggestions)
    return formattedSuggestions
  } catch (error) {
    console.error("[v0] Error fetching address suggestions:", error)

    // Fallback to some common Delhi NCR locations if API fails
    const fallbackSuggestions = [
      "Connaught Place, New Delhi, Delhi NCR",
      "Sector 18, Noida, Delhi NCR",
      "Cyber City, Gurgaon, Delhi NCR",
      "Karol Bagh, New Delhi, Delhi NCR",
      "Lajpat Nagar, New Delhi, Delhi NCR",
      "Rajouri Garden, New Delhi, Delhi NCR",
    ].filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))

    return fallbackSuggestions
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

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
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
    { id: 0, title: "Service" },
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

  useEffect(() => {
    const filtered = services.filter((service) => {
      const categoryMatch = serviceFilters.category === "all" || service.category === serviceFilters.category
      const difficultyMatch = serviceFilters.difficulty === "all" || service.difficulty === serviceFilters.difficulty
      const searchMatch =
        serviceSearchQuery === "" ||
        service.title.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(serviceSearchQuery.toLowerCase())

      const priceMatch =
        serviceFilters.priceRange === "all" ||
        (() => {
          const price = Number.parseInt(service.price.replace(/[^0-9]/g, ""))
          switch (serviceFilters.priceRange) {
            case "low":
              return price < 1000
            case "medium":
              return price >= 1000 && price < 1500
            case "high":
              return price >= 1500
            default:
              return true
          }
        })()

      const ratingMatch =
        serviceFilters.rating === "all" ||
        (() => {
          switch (serviceFilters.rating) {
            case "4+":
              return service.rating >= 4
            case "4.5+":
              return service.rating >= 4.5
            case "5":
              return service.rating === 5
            default:
              return true
          }
        })()

      return categoryMatch && difficultyMatch && searchMatch && priceMatch && ratingMatch
    })

    // Sort services
    filtered.sort((a, b) => {
      switch (serviceSortBy) {
        case "price-low":
          return Number.parseInt(a.price.replace(/[^0-9]/g, "")) - Number.parseInt(b.price.replace(/[^0-9]/g, ""))
        case "price-high":
          return Number.parseInt(b.price.replace(/[^0-9]/g, "")) - Number.parseInt(a.price.replace(/[^0-9]/g, ""))
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }, [serviceFilters, serviceSortBy, serviceSearchQuery])

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

  // Auto-select service if coming from URL
  useEffect(() => {
    if (serviceTitle) {
      const service = services.find((s) => s.title === serviceTitle)
      if (service) {
        setSelectedService(service)
        setCurrentStep(1)
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
      case 0:
        return selectedService !== null
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

  const handleResetServiceFilters = () => {
    setServiceFilters({
      category: "all",
      difficulty: "all",
      priceRange: "all",
      rating: "all",
    })
    setServiceSearchQuery("")
    setServiceSortBy("rating")
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

  const selectAddressSuggestion = (suggestion: string) => {
    const parts = suggestion.split(", ")
    let addressLine1 = suggestion
    let city = ""
    let state = ""

    if (parts.length >= 3) {
      // Format: "Location Name, Area/Sector, City, State"
      addressLine1 = parts.slice(0, -2).join(", ") // Everything except last 2 parts
      city = parts[parts.length - 2] // Second to last part
      state = parts[parts.length - 1] // Last part
    } else if (parts.length === 2) {
      // Format: "Location, City"
      addressLine1 = parts[0]
      city = parts[1]
    }

    // Attempt to map common city names to state values
    let mappedState = ""
    const lowerCity = city.toLowerCase()
    if (lowerCity.includes("delhi") || lowerCity === "new delhi") {
      mappedState = "delhi"
    } else if (lowerCity.includes("gurgaon") || lowerCity.includes("gurugram")) {
      mappedState = "haryana"
    } else if (lowerCity.includes("noida") || lowerCity.includes("greater noida") || lowerCity.includes("ghaziabad")) {
      mappedState = "uttar pradesh"
    } else if (lowerCity.includes("faridabad")) {
      mappedState = "haryana"
    } else {
      // Fallback to the state part if available and not 'Delhi NCR'
      if (state && !state.toLowerCase().includes("delhi ncr")) {
        mappedState = state.toLowerCase().replace(/\s+/g, "-")
      }
    }

    setBookingData({
      ...bookingData,
      addressLine1: addressLine1,
      city: city,
      state: mappedState, // Use the mapped state
    })
    setShowAddressSuggestions(false)
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
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Book Your Session</h1>
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
          {/* Step 0: Select Service */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Wellness Service</h2>
                <p className="text-gray-600 text-lg">Select from our range of certified wellness programs</p>
              </div>

              {/* REBUILT: Sticky & Compact Service Filter Toolbar */}
              <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-green-200 shadow-lg shadow-green-500/10 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Search services by name..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="pl-11 w-full h-12 bg-white border-gray-200 rounded-lg shadow-sm hover:border-green-300 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    {serviceSearchQuery && (
                      <button
                        onClick={() => setServiceSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <Select
                    value={serviceFilters.category}
                    onValueChange={(value) => setServiceFilters({ ...serviceFilters, category: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={serviceFilters.difficulty}
                    onValueChange={(value) => setServiceFilters({ ...serviceFilters, difficulty: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-[150px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={serviceFilters.priceRange}
                    onValueChange={(value) => setServiceFilters({ ...serviceFilters, priceRange: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-[150px]">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under ₹1,000</SelectItem>
                      <SelectItem value="medium">₹1,000 - ₹1,500</SelectItem>
                      <SelectItem value="high">Above ₹1,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-green-100/80">
                  <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                    Showing <span className="font-bold text-green-600">{filteredServices.length}</span> of{" "}
                    {services.length} services
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={serviceSortBy} onValueChange={setServiceSortBy}>
                      <SelectTrigger className="w-auto h-10 text-sm bg-white border-gray-200 rounded-lg shadow-sm">
                        <SortAsc className="w-4 h-4 mr-2" /> <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={handleResetServiceFilters} className="rounded-full">
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* REBUILT: Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                {filteredServices.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedService(service)}
                    className={`cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      selectedService?.title === service.title
                        ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-2xl shadow-green-500/20"
                        : "border-green-200/50 bg-white hover:border-green-300/50 hover:bg-gray-50"
                    }`}
                  >
                    {/* Service Card content remains the same */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-xl mb-3">{service.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{service.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-2xl mb-2">{service.price}</div>
                        <Badge variant="outline" className="border-green-400/30 text-green-400 text-xs">
                          {service.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.description}</p>

                    <div className="space-y-3">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep(1)}
                  disabled={!canProceedToNextStep()}
                  aria-label="Continue to choose trainer"
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

          {/* Step 1: Choose Trainer */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Trainer</h2>
                <p className="text-gray-600 text-lg">Select from our certified wellness experts</p>
              </div>

              {/* REBUILT: Sticky & Compact Trainer Filter Toolbar */}
              <div
                role="region"
                aria-label="Trainer filters"
                className="sticky top-16 z-10 relative bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-green-200/80 shadow-lg shadow-green-500/10 space-y-4"
              >
                {/* Accent bar */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400"
                />

                {/* Controls */}
                <div
                  role="toolbar"
                  aria-label="Trainer filter controls"
                  className="grid grid-cols-1 md:grid-cols-4 gap-3"
                >
                  <div className="relative flex-1 md:col-span-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Search trainers by name, specialty..."
                      value={trainerSearchQuery}
                      onChange={(e) => setTrainerSearchQuery(e.target.value)}
                      className="pl-11 w-full h-12 bg-white border-gray-200 rounded-lg shadow-sm hover:border-green-300 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors"
                      aria-label="Search trainers"
                    />
                    {trainerSearchQuery && (
                      <button
                        onClick={() => setTrainerSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear trainer search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <Select
                    value={trainerFilters.specialization}
                    onValueChange={(value) => setTrainerFilters({ ...trainerFilters, specialization: value })}
                  >
                    <SelectTrigger
                      className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-full"
                      aria-label="Filter by specialization"
                    >
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="power">Power Yoga</SelectItem>
                      <SelectItem value="prenatal">Prenatal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={trainerFilters.experience}
                    onValueChange={(value) => setTrainerFilters({ ...trainerFilters, experience: value })}
                  >
                    <SelectTrigger
                      className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-full"
                      aria-label="Filter by experience"
                    >
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience</SelectItem>
                      <SelectItem value="5-">Under 5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={trainerFilters.location}
                    onValueChange={(value) => setTrainerFilters({ ...trainerFilters, location: value })}
                  >
                    <SelectTrigger
                      className="h-12 bg-white border-gray-200 rounded-lg shadow-sm text-gray-600 md:w-full"
                      aria-label="Filter by location"
                    >
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="jaipur">Jaipur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Footer: results + sort + reset + active chips */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-green-100/80">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-bold text-green-600">{filteredTrainers.length}</span> of{" "}
                      {trainers.length} trainers
                    </div>

                    {/* Active filter chips */}
                    <div className="flex flex-wrap gap-2">
                      {trainerSearchQuery && (
                        <Badge variant="outline" className="border-green-300/50 bg-green-50/40 text-gray-700">
                          Search: {trainerSearchQuery}
                          <button
                            onClick={() => setTrainerSearchQuery("")}
                            className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Clear search"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      )}
                      {trainerFilters.specialization !== "all" && (
                        <Badge variant="outline" className="border-green-300/50 bg-green-50/40 text-gray-700">
                          Specialty: {trainerFilters.specialization}
                          <button
                            onClick={() => setTrainerFilters({ ...trainerFilters, specialization: "all" })}
                            className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Clear specialty filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      )}
                      {trainerFilters.experience !== "all" && (
                        <Badge variant="outline" className="border-green-300/50 bg-green-50/40 text-gray-700">
                          Experience: {trainerFilters.experience}
                          <button
                            onClick={() => setTrainerFilters({ ...trainerFilters, experience: "all" })}
                            className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Clear experience filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      )}
                      {trainerFilters.location !== "all" && (
                        <Badge variant="outline" className="border-green-300/50 bg-green-50/40 text-gray-700">
                          Location: {trainerFilters.location}
                          <button
                            onClick={() => setTrainerFilters({ ...trainerFilters, location: "all" })}
                            className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Clear location filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto">
                    <Select value={trainerSortBy} onValueChange={setTrainerSortBy}>
                      <SelectTrigger className="w-auto h-10 text-sm bg-white border-gray-200 rounded-lg shadow-sm">
                        <SortAsc className="w-4 h-4 mr-2" /> <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="experience">Most Experienced</SelectItem>
                        <SelectItem value="sessions">Most Sessions</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleResetTrainerFilters}
                      className="rounded-full"
                      aria-label="Reset filters"
                      title="Reset filters"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
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
                    onClick={() => setSelectedTrainer(trainer)}
                    className={`group relative cursor-pointer rounded-2xl p-[1px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                      selectedTrainer?.id === trainer.id
                        ? "bg-gradient-to-br from-green-400/40 via-green-300/30 to-transparent shadow-2xl shadow-green-500/20"
                        : "bg-gradient-to-br from-green-200/40 via-transparent to-transparent hover:from-green-300/50"
                    }`}
                  >
                    {/* Inner card surface */}
                    <div
                      className={`rounded-2xl bg-white p-6 border transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 ${
                        selectedTrainer?.id === trainer.id
                          ? "border-green-300/60"
                          : "border-green-200/50 group-hover:border-green-300/50"
                      }`}
                    >
                      {/* Selected pill */}
                      {selectedTrainer?.id === trainer.id && (
                        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
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
                            src={trainer.image || "/placeholder.svg"}
                            alt={trainer.name}
                            className="relative w-24 h-24 rounded-xl object-cover ring-2 ring-green-300/30"
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
                              <span>
                                {trainer.rating} ({trainer.reviews} reviews)
                              </span>
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
                          <div className="mt-3 flex flex-wrap gap-2">
                            {trainer.languages.slice(0, 2).map((lang, i) => (
                              <span
                                key={`${trainer.id}-lang-${i}`}
                                className="text-[11px] font-medium rounded-full border border-green-300/40 bg-green-50/40 text-gray-700 px-2 py-0.5"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
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

              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)} aria-label="Go back to select service">
                  <span className="inline-flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </span>
                </Button>
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Schedule Your Session</h2>
                <p className="text-gray-600 text-lg">Pick your preferred date and time</p>
              </div>
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
                      <Button
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
                      </Button>
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
                    {generateCalendarDates().map((date) => (
                      <div
                        key={date.toISOString()}
                        className={`text-center p-2 rounded ${
                          isSameDay(date, new Date()) ? "bg-green-50 text-green-700 font-semibold" : ""
                        } ${
                          isSameDay(date, parseFormattedDate(selectedDate) ?? new Date())
                            ? "bg-green-100 text-green-600 font-semibold"
                            : ""
                        } ${
                          date.getMonth() !== calendarMonth.getMonth()
                            ? "text-gray-300 cursor-not-allowed"
                            : "cursor-pointer hover:bg-green-50"
                        }`}
                        onClick={() => {
                          if (date.getMonth() === calendarMonth.getMonth()) {
                            setSelectedDate(formatDate(date))
                          }
                        }}
                      >
                        {date.getDate()}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-green-200/80 shadow-xl animate-in slide-in-from-bottom duration-300">
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
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Complete Your Booking</h2>
                <p className="text-gray-600 text-lg">Enter your details and choose a payment method</p>
              </div>

              {/* Booking Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
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
                                <span className="text-green-600 ml-1">• Powered by OpenStreetMap</span>
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
                              const parts = suggestion.split(", ")
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
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Your information is secure</p>
                      <p className="text-xs text-green-600 mt-1">
                        We use industry-standard encryption to protect your personal data and never share it with third
                        parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
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
              </div>

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
