"use client"

import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  CreditCard,
  Truck,
  Bell,
  ShoppingCart,
  DollarSign
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'

export default function ReportsPage() {
  const { orders, products, payments, deliveries, notifications } = useData()

  // Calculate stats
  const completedOrders = orders.filter(o => o.status === 'Delivered').length
  const failedPayments = payments.filter(p => p.status === 'Failed').length
  const lowStockProducts = products.filter(p => p.status === 'Low Stock')
  const outOfStockProducts = products.filter(p => p.status === 'Out of Stock')
  const successfulDeliveries = deliveries.filter(d => d.status === 'Delivered').length
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)

  // Order status distribution
  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: 'oklch(0.65 0.2 145)' },
    { name: 'In Progress', value: orders.filter(o => !['Delivered', 'Failed'].includes(o.status)).length, color: 'oklch(0.7 0.15 200)' },
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending Inventory Check').length, color: 'oklch(0.75 0.15 85)' },
  ]

  // Service performance data
  const servicePerformance = [
    { name: 'Inventory', success: products.filter(p => p.status === 'In Stock').length, total: products.length },
    { name: 'Payment', success: payments.filter(p => p.status === 'Paid').length, total: payments.length },
    { name: 'Delivery', success: deliveries.filter(d => d.status === 'Delivered').length, total: deliveries.length },
    { name: 'Notification', success: notifications.filter(n => n.status === 'Sent').length, total: notifications.length },
  ]

  // Payment method distribution
  const paymentMethodData = [
    { name: 'Credit Card', value: payments.filter(p => p.method === 'Credit Card').length },
    { name: 'PayPal', value: payments.filter(p => p.method === 'PayPal').length },
    { name: 'Bank Transfer', value: payments.filter(p => p.method === 'Bank Transfer').length },
  ]

  const COLORS = ['oklch(0.7 0.15 200)', 'oklch(0.65 0.2 165)', 'oklch(0.7 0.18 300)', 'oklch(0.75 0.15 85)']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-primary/20">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        </div>
        <p className="text-muted-foreground">View system performance and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_145/0.2)]">
                <CheckCircle className="h-5 w-5 text-[oklch(0.65_0.2_145)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
                <p className="text-sm text-muted-foreground">Completed Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_145/0.2)]">
                <DollarSign className="h-5 w-5 text-[oklch(0.65_0.2_145)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{failedPayments}</p>
                <p className="text-sm text-muted-foreground">Failed Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.75_0.15_85/0.2)]">
                <AlertTriangle className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Order Status Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">Breakdown of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.17 0.01 260)', 
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                      color: 'oklch(0.98 0 0)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Service Performance</CardTitle>
            <CardDescription className="text-muted-foreground">Success rate by service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis dataKey="name" stroke="oklch(0.65 0 0)" tick={{ fill: 'oklch(0.65 0 0)' }} />
                  <YAxis stroke="oklch(0.65 0 0)" tick={{ fill: 'oklch(0.65 0 0)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.17 0.01 260)', 
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                      color: 'oklch(0.98 0 0)'
                    }} 
                  />
                  <Bar dataKey="success" fill="oklch(0.65 0.2 145)" name="Successful" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="oklch(0.7 0.15 200)" name="Total" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
            Low Stock Products
          </CardTitle>
          <CardDescription className="text-muted-foreground">Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...lowStockProducts, ...outOfStockProducts].map((product) => (
                  <TableRow key={product.id} className="border-border hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-foreground">{product.category}</TableCell>
                    <TableCell className="text-foreground font-medium">{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={
                        product.status === 'Low Stock' 
                          ? 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }>
                        {product.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
            Delivery Performance
          </CardTitle>
          <CardDescription className="text-muted-foreground">Delivery status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { status: 'Preparing', count: deliveries.filter(d => d.status === 'Preparing').length, color: 'text-muted-foreground', bgColor: 'bg-muted' },
              { status: 'Rider Assigned', count: deliveries.filter(d => d.status === 'Rider Assigned').length, color: 'text-[oklch(0.7_0.18_300)]', bgColor: 'bg-[oklch(0.7_0.18_300/0.2)]' },
              { status: 'Out for Delivery', count: deliveries.filter(d => d.status === 'Out for Delivery').length, color: 'text-[oklch(0.75_0.15_85)]', bgColor: 'bg-[oklch(0.75_0.15_85/0.2)]' },
              { status: 'Delivered', count: deliveries.filter(d => d.status === 'Delivered').length, color: 'text-[oklch(0.65_0.2_145)]', bgColor: 'bg-[oklch(0.65_0.2_145/0.2)]' },
            ].map((item) => (
              <div key={item.status} className="p-4 rounded-lg bg-secondary/30 text-center">
                <p className={`text-3xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Logs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Notification Logs
          </CardTitle>
          <CardDescription className="text-muted-foreground">Latest system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{notification.type}</span>
                    <Badge className={
                      notification.status === 'Sent' 
                        ? 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)]'
                        : 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)]'
                    }>
                      {notification.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>To: {notification.recipient}</span>
                    <span>Order: {notification.orderId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[oklch(0.7_0.18_300)]" />
            Payment Method Usage
          </CardTitle>
          <CardDescription className="text-muted-foreground">Distribution of payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {paymentMethodData.map((method, index) => (
              <div key={method.name} className="p-4 rounded-lg bg-secondary/30 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${COLORS[index]}33` }}>
                  <CreditCard className="h-6 w-6" style={{ color: COLORS[index] }} />
                </div>
                <p className="text-2xl font-bold text-foreground">{method.value}</p>
                <p className="text-sm text-muted-foreground">{method.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
