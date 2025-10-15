"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BusinessData {
  name: string
  type: string
  currentQueue: number
  averageWaitTime: string
  todayServed: number
  weeklyAverage: number
}

interface QueueSettingsProps {
  businessData: BusinessData
}

export function QueueSettings({ businessData }: QueueSettingsProps) {
  const [settings, setSettings] = useState({
    maxQueueSize: 20,
    avgServiceTime: 15,
    notificationTiming: 5,
    autoNotifications: true,
    smsNotifications: true,
    emailNotifications: false,
    businessHours: {
      open: "09:00",
      close: "17:00",
    },
  })

  const handleSaveSettings = () => {
    console.log("[v0] Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details and operating hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" defaultValue={businessData.name} />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select defaultValue={businessData.type.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="beauty">Beauty & Salon</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="government">Government Office</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openTime">Opening Time</Label>
              <Input
                id="openTime"
                type="time"
                value={settings.businessHours.open}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, open: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="closeTime">Closing Time</Label>
              <Input
                id="closeTime"
                type="time"
                value={settings.businessHours.close}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, close: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Configuration</CardTitle>
          <CardDescription>Configure queue limits and timing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxQueue">Maximum Queue Size</Label>
              <Input
                id="maxQueue"
                type="number"
                value={settings.maxQueueSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxQueueSize: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="serviceTime">Avg Service Time (minutes)</Label>
              <Input
                id="serviceTime"
                type="number"
                value={settings.avgServiceTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    avgServiceTime: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="notificationTiming">Notify Before (minutes)</Label>
              <Input
                id="notificationTiming"
                type="number"
                value={settings.notificationTiming}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationTiming: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how customers receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoNotifications">Automatic Notifications</Label>
              <p className="text-sm text-gray-600">Send notifications automatically when it's almost their turn</p>
            </div>
            <Switch
              id="autoNotifications"
              checked={settings.autoNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  autoNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <p className="text-sm text-gray-600">Send text messages to customers</p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  smsNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Send email updates to customers</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  emailNotifications: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
