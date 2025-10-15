"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Navigation, X, Clock } from "lucide-react"

interface ActiveQueueProps {
  businessName: string
  position: number
  totalInQueue: number
  estimatedWait: string
  onLeaveQueue: () => void
  onGetDirections: () => void
}

export function ActiveQueueStatus({
  businessName,
  position,
  totalInQueue,
  estimatedWait,
  onLeaveQueue,
  onGetDirections,
}: ActiveQueueProps) {
  const progressPercentage = ((totalInQueue - position + 1) / totalInQueue) * 100

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-20 z-40">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            You're in Queue
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-lg">{businessName}</p>
              <p className="text-sm text-gray-600">Position #{position} in queue</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-700">
                <Clock className="w-5 h-5 mr-1" />
                <span className="text-2xl font-bold">~{estimatedWait}</span>
              </div>
              <p className="text-sm text-gray-600">estimated wait</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex justify-between text-sm mb-2 text-gray-700">
              <span>Queue Progress</span>
              <span>
                {totalInQueue - position + 1} of {totalInQueue}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {position === 1 ? "You're next!" : `${position - 1} people ahead of you`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-green-300 hover:bg-green-50 bg-transparent"
              onClick={onGetDirections}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onLeaveQueue}>
              <X className="w-4 h-4 mr-2" />
              Leave Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
