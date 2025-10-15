"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Shield, Bell } from "lucide-react"

interface LocationPermissionProps {
  onPermissionGranted: () => void
  onPermissionDenied: () => void
}

export function LocationPermission({ onPermissionGranted, onPermissionDenied }: LocationPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false)

  const requestPermission = async () => {
    setIsRequesting(true)

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" })

      if (permission.state === "granted") {
        onPermissionGranted()
      } else if (permission.state === "denied") {
        onPermissionDenied()
      } else {
        // Request permission
        navigator.geolocation.getCurrentPosition(
          () => {
            onPermissionGranted()
          },
          () => {
            onPermissionDenied()
          },
        )
      }
    } catch (error) {
      console.log("[v0] Permission request error:", error)
      onPermissionDenied()
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Enable Location Services</CardTitle>
          <CardDescription>
            Allow SilentQueue to access your location for better queue management and proximity alerts
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Find Nearby Services</p>
                <p className="text-xs text-gray-600">Discover queues and services close to your location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Proximity Alerts</p>
                <p className="text-xs text-gray-600">Get notified when you're near your queued location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Privacy Protected</p>
                <p className="text-xs text-gray-600">Your location is only used for queue management</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onPermissionDenied}
              disabled={isRequesting}
            >
              Not Now
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={requestPermission}
              disabled={isRequesting}
            >
              {isRequesting ? "Requesting..." : "Allow Location"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
