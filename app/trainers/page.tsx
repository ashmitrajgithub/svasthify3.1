"use client"

import { trainers, type Trainer } from "@/lib/trainers"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Shield, Search, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingModal } from "@/components/booking-modal"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TrainersPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const filteredAndSortedTrainers = trainers
    .filter((trainer) => {
      const matchesSearch =
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "price":
          return Number.parseInt(a.price.replace(/[^\d]/g, "")) - Number.parseInt(b.price.replace(/[^\d]/g, ""))
        case "location":
          return a.location.localeCompare(b.location)
        case "availability":
          return a.availability.localeCompare(b.availability)
        default:
          return 0
      }
    })

  return (
    <>
      <Header />

      <main className="pt-24 pb-16 px-6 bg-background">
        <div className="container mx-auto max-w-7xl relative">
          <Link
            href="/"
            className="absolute top-0 right-0 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Back to home
          </Link>

          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight tracking-tight">
              Explore all{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Trainers
              </span>
            </h2>
          </div>

          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                <Input
                  type="text"
                  placeholder="Search trainers by name, specialization, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 py-3 text-base border-2 border-gray-200/50 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 placeholder:text-gray-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-gray-200/50 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedTrainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden rounded-3xl border border-border">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={trainer.image || "/placeholder.svg?height=400&width=400&query=trainer-image"}
                    alt={trainer.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {trainer.verified && (
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16">
                        {/* Main curved ribbon with enhanced gradient */}
                        <div
                          className="absolute top-0 right-0 bg-gradient-to-bl from-emerald-400 via-green-500 to-green-600"
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "0 0 0 100%",
                            boxShadow: "0 4px 16px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        />
                        {/* Inner highlight for depth */}
                        <div
                          className="absolute top-0 right-0 bg-gradient-to-bl from-white/25 to-transparent"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "0 0 0 100%",
                            top: "2px",
                            right: "2px",
                          }}
                        />
                        <div className="absolute top-2 right-2 transform -rotate-60 text-white text-center">
                          <div className="flex flex-col items-center justify-center space-y-0.5">
                            <Shield className="w-4 h-4 drop-shadow-md" />
                            <div className="text-[8px] font-extrabold leading-tight tracking-wider drop-shadow-md whitespace-nowrap">
                              VERIFIED
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-colors text-white font-bold px-3 py-1 shadow-lg"
                    >
                      {trainer.price}
                    </Badge>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 " />
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{trainer.name}</h3>
                      <p className="text-sm text-muted-foreground">{trainer.title}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 border text-xs">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="font-medium text-foreground">{trainer.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({trainer.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {trainer.location}
                    </span>
                  </div>

                  {trainer.highlights && trainer.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trainer.highlights.slice(0, 3).map((h) => (
                        <Badge
                          key={h}
                          variant="secondary"
                          className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-colors"
                        >
                          {h}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-5">
                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-colors"
                      onClick={() => {
                        setSelectedTrainer(trainer)
                        setBookingModalOpen(true)
                      }}
                    >
                      Book Your Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAndSortedTrainers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No trainers found</h3>
              <p className="text-gray-600 mb-6 text-base">
                Try adjusting your search terms or browse all trainers below.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="rounded-xl px-6 py-2 border-2 hover:bg-green-50 hover:border-green-200 transition-all duration-300"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          <BookingModal
            isOpen={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            trainer={selectedTrainer}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}
