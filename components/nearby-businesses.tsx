"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Users, Loader2 } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"
import useSWR from "swr"

interface Business {
  id: number
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  currentQueue: number
  estimatedWait: string
  status: "open" | "busy" | "closed"
  distance?: number
}

interface NearbyBusinessesProps {
  onBusinessSelect: (business: Business) => void
  maxDistance?: number // in kilometers
}

export function NearbyBusinesses({ onBusinessSelect, maxDistance = 5 }: NearbyBusinessesProps) {
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const { latitude, longitude, calculateDistance, getCurrentPosition } = useGeolocation()
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR("/api/businesses", fetcher)

  // Mock business data with coordinates
  const allBusinesses: Business[] = [
    {
      id: 1,
      name: "City Medical Clinic",
      type: "Healthcare",
      address: "123 Main St, Downtown",
      latitude: 40.7128,
      longitude: -74.006,
      currentQueue: 8,
      estimatedWait: "25 min",
      status: "open",
    },
    {
      id: 2,
      name: "Luxe Hair Salon",
      type: "Beauty",
      address: "456 Oak Ave, Midtown",
      latitude: 40.7589,
      longitude: -73.9851,
      currentQueue: 3,
      estimatedWait: "15 min",
      status: "open",
    },
    {
      id: 3,
      name: "QuickFix Auto Service",
      type: "Automotive",
      address: "789 Pine Rd, Eastside",
      latitude: 40.6892,
      longitude: -74.0445,
      currentQueue: 12,
      estimatedWait: "45 min",
      status: "busy",
    },
    {
      id: 4,
      name: "Downtown Dental Care",
      type: "Healthcare",
      address: "321 Broadway, Downtown",
      latitude: 40.7505,
      longitude: -73.9934,
      currentQueue: 5,
      estimatedWait: "20 min",
      status: "open",
    },
  ]

  useEffect(() => {
    if (!latitude || !longitude) {
      getCurrentPosition()
      return
    }

    setLoading(true)

    const source = (data?.businesses as any[])?.length ? data.businesses : allBusinesses

    const businessesWithDistance = source
      .map((business: any) => ({
        ...business,
        distance: calculateDistance(business.latitude, business.longitude),
        status: business.isOpen === false ? "closed" : business.status || "open",
        currentQueue: business.currentQueue ?? Math.floor(Math.random() * 10) + 1,
        estimatedWait: business.estimatedWait ?? `${(business.avgServiceTime ?? 7) * 3} min`,
        type: business.type || "Service",
      }))
      .filter((business: any) => business.distance !== null && business.distance <= maxDistance)
      .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0))

    console.log("[v0] Found nearby businesses:", businessesWithDistance.length)
    setNearbyBusinesses(businessesWithDistance)
    setLoading(false)
  }, [latitude, longitude, calculateDistance, getCurrentPosition, maxDistance, data])

  const getDirections = (business: Business) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
    window.open(url, "_blank")
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Finding nearby businesses...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Nearby Services</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <MapPin className="w-3 h-3 mr-1" />
          {nearbyBusinesses.length} found
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearbyBusinesses.map((business, index) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">{business.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{business.type}</CardDescription>
                  </div>
                  <Badge
                    variant={business.status === "open" ? "default" : "secondary"}
                    className={
                      business.status === "open" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {business.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="flex-1">{business.address}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium">{business.currentQueue}</span>
                    <span className="text-gray-600 ml-1">in queue</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="font-medium">{business.estimatedWait}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-sm font-medium text-green-600">📍 {business.distance?.toFixed(1)} km away</div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => getDirections(business)}>
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onBusinessSelect(business)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      Join Queue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {nearbyBusinesses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No services found within {maxDistance} km</p>
            <p className="text-sm text-gray-500 mt-2">Try expanding your search radius</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
