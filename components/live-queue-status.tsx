"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Activity } from "lucide-react"

interface LiveQueueStatusProps {
  isConnected: boolean
  queuePosition: number | null
  estimatedWait: string | null
  businessName: string
  lastUpdate?: number
}

export function LiveQueueStatus({
  isConnected,
  queuePosition,
  estimatedWait,
  businessName,
  lastUpdate,
}: LiveQueueStatusProps) {
  if (!queuePosition) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-20 z-40">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">Live Queue Status</span>
            <div className="flex items-center space-x-2">
              <Badge
                variant={isConnected ? "default" : "secondary"}
                className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Disconnected
                  </>
                )}
              </Badge>
              {isConnected && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Activity className="w-4 h-4 text-green-600" />
                </motion.div>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-gray-900 text-lg">{businessName}</p>
            <p className="text-sm text-gray-600">Real-time queue updates</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">#{queuePosition}</p>
              <p className="text-xs text-gray-600">Your Position</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-orange-700">{estimatedWait}</p>
              <p className="text-xs text-gray-600">Est. Wait</p>
            </div>
          </div>

          {lastUpdate && (
            <p className="text-xs text-gray-500 text-center">
              Last updated: {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          )}

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex justify-between text-sm mb-2">
              <span>Queue Progress</span>
              <span>{queuePosition <= 3 ? "Almost your turn!" : `${queuePosition - 1} ahead`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(10, (10 - queuePosition + 1) * 10)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
