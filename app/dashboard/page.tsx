"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, TrendingUp, Bell, Play, Pause, UserCheck, BarChart3 } from "lucide-react"
import { QueueManagement } from "@/components/queue-management"
import { BusinessStats } from "@/components/business-stats"
import { QueueSettings } from "@/components/queue-settings"
import useSWR from "swr"

export default function BusinessDashboard() {
  const [queueStatus, setQueueStatus] = useState<"active" | "paused">("active")
  const router = useRouter()

  // Mock business data
  const businessData = {
    name: "City Medical Clinic",
    type: "Healthcare",
    currentQueue: 8,
    averageWaitTime: "22 min",
    todayServed: 45,
    weeklyAverage: 52,
  }

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data } = useSWR("/api/dashboard/queue?businessId=1", fetcher, { refreshInterval: 5000 })

  const queueData = (data?.queue || []).map((q: any, idx: number) => ({
    id: q.id,
    name: q.customer_name,
    phone: q.phone ? `***-***-${q.phone.slice(-4)}` : "***-***-0000",
    joinTime: q.join_time,
    estimatedTime: "TBD",
    status: q.status,
  }))

  const toggleQueueStatus = () => {
    setQueueStatus(queueStatus === "active" ? "paused" : "active")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Business Dashboard</h1>
                <p className="text-sm text-gray-600">{businessData.name}</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Badge
                variant={queueStatus === "active" ? "default" : "secondary"}
                className={queueStatus === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
              >
                Queue {queueStatus}
              </Badge>
              <Button variant={queueStatus === "active" ? "outline" : "default"} size="sm" onClick={toggleQueueStatus}>
                {queueStatus === "active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Queue
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Queue
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" })
                  router.push("/")
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Queue</p>
                  <p className="text-3xl font-bold text-gray-900">{businessData.currentQueue}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-gray-900">{businessData.averageWaitTime}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today Served</p>
                  <p className="text-3xl font-bold text-gray-900">{businessData.todayServed}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weekly Avg</p>
                  <p className="text-3xl font-bold text-gray-900">{businessData.weeklyAverage}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="queue">Queue Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <QueueManagement queueData={queueData} queueStatus={queueStatus} />
            </TabsContent>

            <TabsContent value="analytics">
              <BusinessStats />
            </TabsContent>

            <TabsContent value="settings">
              <QueueSettings businessData={businessData} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
