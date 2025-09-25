import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const GOOGLE_API_KEY = "AIzaSyBcxBsa_JvAhj_f0nwsnq3P_EKANa47RvM"

    // Use Google Places API Autocomplete
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&components=country:in&location=28.6139,77.2090&radius=50000&types=address`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API error: ${data.status}`)
    }

    // Format Google Places predictions
    const formattedSuggestions = data.predictions
      ?.map((prediction: any) => prediction.description)
      .filter((suggestion: string, index: number, self: string[]) => self.indexOf(suggestion) === index)
      .slice(0, 8)

    return NextResponse.json({ suggestions: formattedSuggestions || [] })
  } catch (error) {
    console.error("Error fetching address suggestions:", error)

    // Fallback to some common Delhi NCR locations if API fails
    const fallbackSuggestions = [
      "Connaught Place, New Delhi, Delhi, India",
      "Sector 18, Noida, Uttar Pradesh, India",
      "Cyber City, Gurgaon, Haryana, India",
      "Khan Market, New Delhi, Delhi, India",
      "Sector 29, Gurgaon, Haryana, India",
      "Greater Noida, Uttar Pradesh, India",
    ]

    return NextResponse.json({ suggestions: fallbackSuggestions })
  }
}
