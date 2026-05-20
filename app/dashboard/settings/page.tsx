"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Server,
  Palette,
  Info,
  Save,
  Mail,
  Lock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    paymentAlerts: true,
    inventoryWarnings: true,
    deliveryUpdates: true,
    systemAlerts: false
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.name || 'System Administrator'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'admin@enterprise.com'}</p>
              <p className="text-xs text-primary mt-1">Administrator Role</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Full Name</Label>
              <Input
                defaultValue={user?.name || 'System Administrator'}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  defaultValue={user?.email || 'admin@enterprise.com'}
                  className="bg-input border-border text-foreground pl-10"
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified when orders change status' },
            { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Receive alerts for payment transactions' },
            { key: 'inventoryWarnings', label: 'Inventory Warnings', description: 'Be alerted when stock is low' },
            { key: 'deliveryUpdates', label: 'Delivery Updates', description: 'Track delivery status changes' },
            { key: 'systemAlerts', label: 'System Alerts', description: 'Receive critical system notifications' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [item.key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter current password"
                className="bg-input border-border text-foreground pl-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          <Button variant="outline" className="border-border text-foreground">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            System Information
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Service-Based Enterprise Order Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Server, label: 'System Version', value: 'v1.0.0' },
              { icon: Database, label: 'Database', value: 'PostgreSQL 15' },
              { icon: Palette, label: 'Theme', value: 'Dark Mode' },
              { icon: Server, label: 'Environment', value: 'Production' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4 bg-border" />

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium text-foreground mb-2">Connected Services</h4>
            <div className="flex flex-wrap gap-2">
              {['Inventory Service', 'Payment Service', 'Delivery Tracking', 'Notification Service'].map((service) => (
                <div key={service} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] text-sm">
                  <div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.2_145)]" />
                  {service}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
