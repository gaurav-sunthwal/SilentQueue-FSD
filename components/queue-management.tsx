"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, SkipForward, UserCheck, AlertCircle, MessageSquare, MoreHorizontal, Users } from "lucide-react"

interface QueueItem {
  id: number
  name: string
  phone: string
  joinTime: string
  estimatedTime: string
  status: "waiting" | "notified" | "serving"
}

interface QueueManagementProps {
  queueData: QueueItem[]
  queueStatus: "active" | "paused"
}

export function QueueManagement({ queueData, queueStatus }: QueueManagementProps) {
  const handleCallNext = () => {
    console.log("[v0] Calling next customer")
  }

  const handleNotifyCustomer = (customerId: number) => {
    console.log("[v0] Notifying customer:", customerId)
  }

  const handleSkipCustomer = (customerId: number) => {
    console.log("[v0] Skipping customer:", customerId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Waiting
          </Badge>
        )
      case "notified":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            Notified
          </Badge>
        )
      case "serving":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Serving
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Queue Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Queue Controls</span>
            <div className="flex gap-2">
              <Button onClick={handleCallNext} disabled={queueStatus === "paused"}>
                <UserCheck className="w-4 h-4 mr-2" />
                Call Next
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Notify All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue ({queueData.length} customers)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queueData.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Joined: {customer.joinTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Est: {customer.estimatedTime}</p>
                    {getStatusBadge(customer.status)}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNotifyCustomer(customer.id)}
                      disabled={customer.status === "notified"}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => handleSkipCustomer(customer.id)}>
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {queueData.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No customers in queue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
