"use client"

import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  Bell,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Database
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { orders, products, payments, deliveries, notifications } = useData()

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length,
      description: `${orders.filter(o => o.status === 'Delivered').length} completed`,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/dashboard/orders'
    },
    {
      title: 'Available Products',
      value: products.filter(p => p.status !== 'Out of Stock').length,
      description: `${products.filter(p => p.status === 'Low Stock').length} low stock`,
      icon: Package,
      color: 'text-[oklch(0.65_0.2_165)]',
      bgColor: 'bg-[oklch(0.65_0.2_165/0.1)]',
      href: '/dashboard/inventory'
    },
    {
      title: 'Pending Payments',
      value: payments.filter(p => p.status === 'Pending' || p.status === 'Processing').length,
      description: `$${payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total`,
      icon: CreditCard,
      color: 'text-[oklch(0.7_0.18_300)]',
      bgColor: 'bg-[oklch(0.7_0.18_300/0.1)]',
      href: '/dashboard/payments'
    },
    {
      title: 'Active Deliveries',
      value: deliveries.filter(d => d.status !== 'Delivered').length,
      description: `${deliveries.filter(d => d.status === 'Out for Delivery').length} out for delivery`,
      icon: Truck,
      color: 'text-[oklch(0.75_0.15_85)]',
      bgColor: 'bg-[oklch(0.75_0.15_85/0.1)]',
      href: '/dashboard/delivery'
    },
    {
      title: 'Sent Notifications',
      value: notifications.filter(n => n.status === 'Sent').length,
      description: `${notifications.length} total messages`,
      icon: Bell,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/dashboard/notifications'
    },
  ]

  const recentOrders = orders.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)]'
      case 'Out for Delivery':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)]'
      case 'Payment Confirmed':
      case 'Rider Assigned':
        return 'bg-primary/20 text-primary'
      case 'Pending Inventory Check':
      case 'Payment Pending':
        return 'bg-muted text-muted-foreground'
      case 'Failed':
        return 'bg-destructive/20 text-destructive'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your enterprise services in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Recent Order Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Latest orders in the system</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                View All
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Interaction Flow */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Service Interaction Flow</CardTitle>
            <CardDescription className="text-muted-foreground">How services work together</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Flow Steps */}
              <div className="relative">
                {[
                  { icon: ShoppingCart, label: 'Order Created', service: 'Order Service', color: 'text-primary', bgColor: 'bg-primary/10' },
                  { icon: Database, label: 'Validate Stock', service: 'Inventory Service', color: 'text-[oklch(0.65_0.2_165)]', bgColor: 'bg-[oklch(0.65_0.2_165/0.1)]' },
                  { icon: CreditCard, label: 'Process Payment', service: 'Payment Service', color: 'text-[oklch(0.7_0.18_300)]', bgColor: 'bg-[oklch(0.7_0.18_300/0.1)]' },
                  { icon: Truck, label: 'Track Delivery', service: 'Delivery Service', color: 'text-[oklch(0.75_0.15_85)]', bgColor: 'bg-[oklch(0.75_0.15_85/0.1)]' },
                  { icon: Bell, label: 'Send Updates', service: 'Notification Service', color: 'text-primary', bgColor: 'bg-primary/10' },
                ].map((step, index) => (
                  <div key={step.label} className="relative flex items-center gap-4 pb-4">
                    {index < 4 && (
                      <div className="absolute left-5 top-10 w-0.5 h-[calc(100%-1rem)] bg-border" />
                    )}
                    <div className={`relative z-10 p-2.5 rounded-lg ${step.bgColor}`}>
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.service}</p>
                    </div>
                    {index < 4 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    {index === 4 && (
                      <CheckCircle className="h-4 w-4 text-[oklch(0.65_0.2_145)]" />
                    )}
                  </div>
                ))}
              </div>

              <Link href="/dashboard/process-flow">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-primary">View Full Process Flow</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Process Orders', description: 'Handle pending orders', icon: Clock, href: '/dashboard/orders', color: 'text-primary' },
          { title: 'Check Inventory', description: 'Monitor stock levels', icon: AlertCircle, href: '/dashboard/inventory', color: 'text-[oklch(0.65_0.2_165)]' },
          { title: 'Verify Payments', description: 'Confirm transactions', icon: CreditCard, href: '/dashboard/payments', color: 'text-[oklch(0.7_0.18_300)]' },
          { title: 'Track Deliveries', description: 'Monitor riders', icon: TrendingUp, href: '/dashboard/delivery', color: 'text-[oklch(0.75_0.15_85)]' },
        ].map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group h-full">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
