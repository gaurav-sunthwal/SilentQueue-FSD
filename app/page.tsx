"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Bell, MapPin } from "lucide-react"
import { useRealtimeQueue } from "@/hooks/use-realtime-queue"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useProximityAlerts } from "@/hooks/use-proximity-alerts"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { LiveQueueStatus } from "@/components/live-queue-status"
import { LocationPermission } from "@/components/location-permission"
import { NearbyBusinesses } from "@/components/nearby-businesses"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)

  const { isConnected, queuePosition, estimatedWait, notifications, joinQueue, leaveQueue } = useRealtimeQueue()

  const { latitude, longitude, error: locationError } = useGeolocation()

  // Proximity alerts for queued businesses
  const proximityAlerts = selectedBusiness
    ? [
        {
          id: `alert-${selectedBusiness.id}`,
          businessId: selectedBusiness.id.toString(),
          businessName: selectedBusiness.name,
          businessLat: selectedBusiness.latitude || 40.7128,
          businessLon: selectedBusiness.longitude || -74.006,
          alertDistance: 0.5, // 500 meters
          isActive: true,
        },
      ]
    : []

  const { startWatching, stopWatching } = useProximityAlerts({
    alerts: proximityAlerts,
    onProximityReached: (alert, distance) => {
      console.log("[v0] You're near", alert.businessName, "- Distance:", distance.toFixed(2), "km")
      // This would trigger a notification in a real app
    },
  })

  useEffect(() => {
    // Check if location permission was previously granted
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permission) => {
          if (permission.state === "granted") {
            setLocationEnabled(true)
          } else if (permission.state === "prompt") {
            setShowLocationPermission(true)
          }
        })
        .catch(() => {
          setShowLocationPermission(true)
        })
    }
  }, [])

  useEffect(() => {
    if (locationEnabled && queuePosition) {
      startWatching()
    } else {
      stopWatching()
    }
  }, [locationEnabled, queuePosition, startWatching, stopWatching])

  const handleLocationPermissionGranted = () => {
    setLocationEnabled(true)
    setShowLocationPermission(false)
  }

  const handleLocationPermissionDenied = () => {
    setLocationEnabled(false)
    setShowLocationPermission(false)
  }

  const handleJoinQueue = (business: any) => {
    joinQueue(business.id.toString())
    setSelectedBusiness(business)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {showLocationPermission && (
        <LocationPermission
          onPermissionGranted={handleLocationPermissionGranted}
          onPermissionDenied={handleLocationPermissionDenied}
        />
      )}

      <RealtimeNotifications notifications={notifications} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SilentQueue</h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              {locationEnabled && (
                <div className="flex items-center text-sm text-green-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location enabled
                </div>
              )}
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href={typeof document !== 'undefined' && document.cookie.includes('sq_auth=') ? "/dashboard" : "/sign-in"}>
                <Button size="sm">
                  {typeof document !== 'undefined' && document.cookie.includes('sq_auth=') ? "Dashboard" : "Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {queuePosition && (
          <div className="mb-8">
            <LiveQueueStatus
              isConnected={isConnected}
              queuePosition={queuePosition}
              estimatedWait={estimatedWait}
              businessName={selectedBusiness?.name || "City Medical Clinic"}
              lastUpdate={Date.now()}
            />
          </div>
        )}

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Skip the Wait, Join the Queue</h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Find nearby services, join queues remotely, and get notified when it's your turn. No more waiting in crowded
            spaces.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search clinics, salons, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-blue-200 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Location-based content */}
        {locationEnabled && latitude && longitude ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <NearbyBusinesses onBusinessSelect={handleJoinQueue} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enable Location for Better Experience</h3>
              <p className="text-gray-600 mb-6">
                Allow location access to find nearby services and get proximity alerts
              </p>
              <Button
                onClick={() => setShowLocationPermission(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Enable Location
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
