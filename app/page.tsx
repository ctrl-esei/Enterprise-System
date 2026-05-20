"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Lock, Mail, Server, Database, CreditCard, Truck, Bell } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Please use the demo credentials.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-chart-3/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left side - Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm text-muted-foreground mb-6">
            <Server className="h-4 w-4 text-primary" />
            Enterprise Solution
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            Service-Based Enterprise
            <span className="block text-primary mt-1">Order Management System</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto lg:mx-0 text-pretty">
            A unified platform demonstrating how multiple services collaborate to manage complete order workflows.
          </p>

          {/* Service Icons */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border/50">
              <div className="p-2 rounded-md bg-[oklch(0.65_0.2_165/0.2)]">
                <Database className="h-5 w-5 text-[oklch(0.65_0.2_165)]" />
              </div>
              <span className="text-sm font-medium text-foreground">Inventory Service</span>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border/50">
              <div className="p-2 rounded-md bg-[oklch(0.7_0.18_300/0.2)]">
                <CreditCard className="h-5 w-5 text-[oklch(0.7_0.18_300)]" />
              </div>
              <span className="text-sm font-medium text-foreground">Payment Service</span>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border/50">
              <div className="p-2 rounded-md bg-[oklch(0.75_0.15_85/0.2)]">
                <Truck className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
              </div>
              <span className="text-sm font-medium text-foreground">Delivery Service</span>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border/50">
              <div className="p-2 rounded-md bg-[oklch(0.7_0.15_200/0.2)]">
                <Bell className="h-5 w-5 text-[oklch(0.7_0.15_200)]" />
              </div>
              <span className="text-sm font-medium text-foreground">Notification Service</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">Admin Login</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access the enterprise dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Demo Credentials</p>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Email:</span> admin@enterprise.com
                  </p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Password:</span> admin123
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Academic Demonstration System
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
