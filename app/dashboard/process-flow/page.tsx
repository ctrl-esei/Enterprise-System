"use client"

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Database,
  CreditCard,
  Truck,
  Bell,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  GitBranch,
  Play,
  RotateCcw,
  Info
} from 'lucide-react'

interface WorkflowStep {
  id: number
  name: string
  service: string
  icon: typeof ShoppingCart
  color: string
  bgColor: string
  borderColor: string
  description: string
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    name: 'Order Created',
    service: 'Order Service',
    icon: ShoppingCart,
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary',
    description: 'Customer submits a new order through the system. The order is registered with all product details, customer information, and payment method.'
  },
  {
    id: 2,
    name: 'Validate Stock',
    service: 'Inventory Service',
    icon: Database,
    color: 'text-[oklch(0.65_0.2_165)]',
    bgColor: 'bg-[oklch(0.65_0.2_165/0.2)]',
    borderColor: 'border-[oklch(0.65_0.2_165)]',
    description: 'The Inventory Service checks if all ordered products are available in stock. If successful, items are reserved for the order.'
  },
  {
    id: 3,
    name: 'Process Payment',
    service: 'Payment Service',
    icon: CreditCard,
    color: 'text-[oklch(0.7_0.18_300)]',
    bgColor: 'bg-[oklch(0.7_0.18_300/0.2)]',
    borderColor: 'border-[oklch(0.7_0.18_300)]',
    description: 'The Payment Service verifies and processes the payment transaction. Multiple payment methods are supported including credit card, PayPal, and bank transfer.'
  },
  {
    id: 4,
    name: 'Assign Rider',
    service: 'Delivery Tracking Service',
    icon: Truck,
    color: 'text-[oklch(0.75_0.15_85)]',
    bgColor: 'bg-[oklch(0.75_0.15_85/0.2)]',
    borderColor: 'border-[oklch(0.75_0.15_85)]',
    description: 'The Delivery Tracking Service assigns an available rider and tracks the delivery progress through multiple stages until completion.'
  },
  {
    id: 5,
    name: 'Send Updates',
    service: 'Notification Service',
    icon: Bell,
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary',
    description: 'The Notification Service sends automated updates to customers at each stage, keeping them informed throughout the order journey.'
  }
]

export default function ProcessFlowPage() {
  const { orders, processOrderStep } = useData()
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get sample order for demonstration
  const sampleOrder = orders.find(o => o.status !== 'Delivered' && o.status !== 'Failed') || orders[0]

  const simulateWorkflow = async () => {
    setIsAnimating(true)
    setActiveStep(0)

    for (let i = 0; i < workflowSteps.length; i++) {
      setActiveStep(i + 1)
      await new Promise(resolve => setTimeout(resolve, 1200))
    }

    setIsAnimating(false)
  }

  const resetDemo = () => {
    setActiveStep(0)
    setIsAnimating(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary/20">
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Business Process Flow</h1>
          </div>
          <p className="text-muted-foreground">Visualize how services interact to complete orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetDemo}
            disabled={isAnimating}
            className="border-border text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={simulateWorkflow}
            disabled={isAnimating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="h-4 w-4 mr-2" />
            {isAnimating ? 'Running...' : 'Simulate Workflow'}
          </Button>
        </div>
      </div>

      {/* Service Architecture Info */}
      <Card className="bg-card border-border border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Service-Based Architecture</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This system demonstrates a service-based enterprise architecture where each service operates independently 
                but collaborates to complete the order management business process. Each service has a specific responsibility 
                and communicates through well-defined interfaces, enabling scalability, maintainability, and fault isolation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Workflow Diagram */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Order Processing Workflow</CardTitle>
          <CardDescription className="text-muted-foreground">
            Click &quot;Simulate Workflow&quot; to see how services process an order step by step
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Horizontal Flow */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between relative">
              {workflowSteps.map((step, index) => {
                const isActive = index < activeStep
                const isCurrent = index === activeStep - 1
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    {/* Connection Line */}
                    {index > 0 && (
                      <div 
                        className={`absolute right-full top-8 w-full h-1 transition-all duration-500 ${
                          isActive ? step.bgColor : 'bg-border'
                        }`}
                        style={{ width: 'calc(100% + 2rem)', right: '50%', marginRight: '2rem' }}
                      />
                    )}
                    
                    {/* Step Circle */}
                    <div 
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? `${step.bgColor} border-2 ${step.borderColor}` 
                          : 'bg-secondary border-2 border-border'
                      } ${isCurrent ? 'ring-4 ring-offset-2 ring-offset-card animate-pulse' : ''}`}
                      style={isCurrent ? { '--tw-ring-color': `oklch(0.7 0.15 200 / 0.5)` } as React.CSSProperties : {}}
                    >
                      <step.icon className={`h-7 w-7 ${isActive ? step.color : 'text-muted-foreground'}`} />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[oklch(0.65_0.2_145)] flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="mt-4 text-center max-w-[140px]">
                      <p className={`text-sm font-medium ${isActive ? step.color : 'text-muted-foreground'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{step.service}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Vertical Flow for Mobile */}
          <div className="lg:hidden space-y-4">
            {workflowSteps.map((step, index) => {
              const isActive = index < activeStep
              const isCurrent = index === activeStep - 1
              
              return (
                <div key={step.id} className="relative">
                  {index < workflowSteps.length - 1 && (
                    <div 
                      className={`absolute left-7 top-14 w-0.5 h-8 transition-all duration-500 ${
                        isActive ? step.bgColor : 'bg-border'
                      }`}
                    />
                  )}
                  <div className="flex items-start gap-4">
                    <div 
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                        isActive 
                          ? `${step.bgColor} border-2 ${step.borderColor}` 
                          : 'bg-secondary border-2 border-border'
                      } ${isCurrent ? 'ring-4 ring-offset-2 ring-offset-card' : ''}`}
                    >
                      <step.icon className={`h-6 w-6 ${isActive ? step.color : 'text-muted-foreground'}`} />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[oklch(0.65_0.2_145)] flex items-center justify-center">
                          <CheckCircle className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isActive ? step.color : 'text-muted-foreground'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.service}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowSteps.map((step, index) => {
          const isActive = index < activeStep
          
          return (
            <Card 
              key={step.id} 
              className={`bg-card border-border transition-all duration-500 ${
                isActive ? `border-l-4 ${step.borderColor}` : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${step.bgColor}`}>
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{step.name}</p>
                        <p className="text-xs text-muted-foreground">{step.service}</p>
                      </div>
                      {isActive && (
                        <Badge className="bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)]">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Order Progress */}
      {sampleOrder && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Live Order Progress Example</CardTitle>
            <CardDescription className="text-muted-foreground">
              View a real order progressing through the service workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
              <div className="p-3 rounded-lg bg-primary/20">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-foreground">{sampleOrder.id}</p>
                  <Badge className={
                    sampleOrder.status === 'Delivered' 
                      ? 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)]'
                      : 'bg-primary/20 text-primary'
                  }>
                    {sampleOrder.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sampleOrder.customerName} | ${sampleOrder.total.toFixed(2)} | {sampleOrder.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-foreground font-medium">{sampleOrder.products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Benefits */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Service Architecture Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: 'Scalability', 
                description: 'Each service can scale independently based on demand',
                icon: GitBranch
              },
              { 
                title: 'Fault Isolation', 
                description: 'Service failures are contained and don&apos;t affect the entire system',
                icon: AlertCircle
              },
              { 
                title: 'Maintainability', 
                description: 'Services can be updated or replaced without affecting others',
                icon: Clock
              },
              { 
                title: 'Reusability', 
                description: 'Services can be reused across different business processes',
                icon: CheckCircle
              },
            ].map((benefit) => (
              <div key={benefit.title} className="p-4 rounded-lg bg-secondary/30">
                <benefit.icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-medium text-foreground">{benefit.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
