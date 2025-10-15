"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Navigation } from "lucide-react"

interface Business {
  id: number
  name: string
  type: string
  address: string
  currentQueue: number
  estimatedWait: string
  status: "open" | "busy" | "closed"
  distance: string
}

interface QueueCardProps {
  business: Business
  onJoinQueue: (business: Business) => void
  index?: number
}

export function QueueCard({ business, onJoinQueue, index = 0 }: QueueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {business.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">{business.type}</CardDescription>
            </div>
            <Badge className={`${getStatusColor(business.status)} font-medium`}>{business.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{business.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              <div>
                <span className="font-semibold text-gray-900">{business.currentQueue}</span>
                <span className="text-gray-600 text-xs ml-1">in queue</span>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-600" />
              <span className="font-semibold text-gray-900">{business.estimatedWait}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Navigation className="w-3 h-3 mr-1" />
              {business.distance} away
            </div>

            <Button
              onClick={() => onJoinQueue(business)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6"
              disabled={business.status === "closed"}
            >
              {business.status === "closed" ? "Closed" : "Join Queue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
