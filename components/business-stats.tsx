"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const weeklyData = [
  { day: "Mon", customers: 45, avgWait: 18 },
  { day: "Tue", customers: 52, avgWait: 22 },
  { day: "Wed", customers: 48, avgWait: 20 },
  { day: "Thu", customers: 61, avgWait: 25 },
  { day: "Fri", customers: 55, avgWait: 23 },
  { day: "Sat", customers: 38, avgWait: 15 },
  { day: "Sun", customers: 28, avgWait: 12 },
]

const hourlyData = [
  { hour: "9 AM", customers: 8 },
  { hour: "10 AM", customers: 12 },
  { hour: "11 AM", customers: 15 },
  { hour: "12 PM", customers: 18 },
  { hour: "1 PM", customers: 22 },
  { hour: "2 PM", customers: 16 },
  { hour: "3 PM", customers: 14 },
  { hour: "4 PM", customers: 11 },
  { hour: "5 PM", customers: 8 },
]

export function BusinessStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Overview */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Customer volume and average wait times</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#3b82f6" name="Customers" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Today</CardTitle>
          <CardDescription>Customer flow throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Customer Satisfaction</span>
            <span className="text-lg font-bold text-green-600">94%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Queue Efficiency</span>
            <span className="text-lg font-bold text-blue-600">87%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87%" }}></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">No-Show Rate</span>
            <span className="text-lg font-bold text-orange-600">8%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "8%" }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
