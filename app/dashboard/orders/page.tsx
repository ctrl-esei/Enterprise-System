"use client"

import { useState } from 'react'
import { useData, type Order, type OrderStatus } from '@/contexts/data-context'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ShoppingCart,
  Plus,
  Eye,
  PlayCircle,
  Package,
  CreditCard,
  Truck,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Database
} from 'lucide-react'

const statusFlow: OrderStatus[] = [
  'Pending Inventory Check',
  'Inventory Confirmed',
  'Payment Pending',
  'Payment Confirmed',
  'Rider Assigned',
  'Out for Delivery',
  'Delivered'
]

export default function OrdersPage() {
  const { orders, products, customers, addOrder, processOrderStep, addNotification } = useData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    productId: '',
    quantity: 1,
    paymentMethod: 'Credit Card'
  })

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] border-[oklch(0.65_0.2_145/0.3)]'
      case 'Out for Delivery':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
      case 'Payment Confirmed':
      case 'Rider Assigned':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'Inventory Confirmed':
        return 'bg-[oklch(0.65_0.2_165/0.2)] text-[oklch(0.65_0.2_165)] border-[oklch(0.65_0.2_165/0.3)]'
      case 'Pending Inventory Check':
      case 'Payment Pending':
        return 'bg-[oklch(0.7_0.18_300/0.2)] text-[oklch(0.7_0.18_300)] border-[oklch(0.7_0.18_300/0.3)]'
      case 'Failed':
        return 'bg-destructive/20 text-destructive border-destructive/30'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending Inventory Check':
        return <Database className="h-4 w-4" />
      case 'Inventory Confirmed':
        return <Package className="h-4 w-4" />
      case 'Payment Pending':
      case 'Payment Confirmed':
        return <CreditCard className="h-4 w-4" />
      case 'Rider Assigned':
      case 'Out for Delivery':
        return <Truck className="h-4 w-4" />
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleAddOrder = () => {
    const customer = customers.find(c => c.id === newOrder.customerId)
    const product = products.find(p => p.id === newOrder.productId)

    if (!customer || !product) {
      toast({
        title: "Error",
        description: "Please select a customer and product",
        variant: "destructive"
      })
      return
    }

    const orderId = addOrder({
      customerId: customer.id,
      customerName: customer.name,
      products: [{
        productId: product.id,
        productName: product.name,
        quantity: newOrder.quantity,
        price: product.price
      }],
      total: product.price * newOrder.quantity,
      status: 'Pending Inventory Check',
      paymentMethod: newOrder.paymentMethod,
      deliveryAddress: customer.address
    })

    addNotification({
      orderId,
      recipient: customer.name,
      type: 'Order Received',
      message: `We have received your order ${orderId}. Processing now.`,
      status: 'Sent'
    })

    toast({
      title: "Order Created",
      description: `Order ${orderId} has been created successfully`,
    })

    setIsAddDialogOpen(false)
    setNewOrder({
      customerId: '',
      productId: '',
      quantity: 1,
      paymentMethod: 'Credit Card'
    })
  }

  const handleProcessOrder = (orderId: string) => {
    const result = processOrderStep(orderId)
    
    if (result.success) {
      toast({
        title: "Order Processed",
        description: result.message,
      })
    } else {
      toast({
        title: "Processing Failed",
        description: result.message,
        variant: "destructive"
      })
    }
  }

  const getCurrentStep = (status: OrderStatus) => {
    return statusFlow.indexOf(status)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage and process customer orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Order</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a sample order to demonstrate the service workflow
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Customer</Label>
                <Select value={newOrder.customerId} onValueChange={(v) => setNewOrder(prev => ({ ...prev, customerId: v }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Product</Label>
                <Select value={newOrder.productId} onValueChange={(v) => setNewOrder(prev => ({ ...prev, productId: v }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {products.filter(p => p.status !== 'Out of Stock').map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)} ({product.stock} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Payment Method</Label>
                <Select value={newOrder.paymentMethod} onValueChange={(v) => setNewOrder(prev => ({ ...prev, paymentMethod: v }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddOrder} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">All Orders</CardTitle>
          <CardDescription className="text-muted-foreground">{filteredOrders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Products</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-secondary/30">
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell className="text-foreground">{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.products.map(p => p.productName).join(', ').slice(0, 30)}
                      {order.products.map(p => p.productName).join(', ').length > 30 && '...'}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailDialogOpen(true)
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status !== 'Delivered' && order.status !== 'Failed' && (
                          <Button
                            size="sm"
                            onClick={() => handleProcessOrder(order.id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="text-foreground font-medium">{selectedOrder.customerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-foreground font-medium">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-foreground font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="text-foreground font-medium text-sm">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Products</p>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{product.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                      </div>
                      <p className="text-foreground font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Progress */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Order Workflow Progress</p>
                <div className="flex items-center justify-between">
                  {statusFlow.map((status, index) => {
                    const currentStep = getCurrentStep(selectedOrder.status)
                    const isCompleted = index <= currentStep
                    const isCurrent = index === currentStep
                    
                    return (
                      <div key={status} className="flex flex-col items-center relative">
                        {index > 0 && (
                          <div 
                            className={`absolute right-1/2 top-4 w-full h-0.5 -translate-y-1/2 ${
                              index <= currentStep ? 'bg-primary' : 'bg-border'
                            }`}
                            style={{ width: 'calc(100% + 0.5rem)', right: '50%' }}
                          />
                        )}
                        <div 
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-muted-foreground'
                          } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}
                        >
                          {isCompleted && index < currentStep ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <p className={`text-[10px] mt-2 text-center max-w-[60px] ${
                          isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}>
                          {status.replace('Inventory Check', 'Inv.').replace('Confirmed', 'Conf.').replace('Assigned', 'Asgn.')}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Current Status */}
              <div className="p-4 rounded-lg bg-secondary/30 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge className={`${getStatusColor(selectedOrder.status)} border mt-1`}>
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </Badge>
                </div>
                {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Failed' && (
                  <Button
                    onClick={() => {
                      handleProcessOrder(selectedOrder.id)
                      // Refresh selected order
                      const updated = orders.find(o => o.id === selectedOrder.id)
                      if (updated) setSelectedOrder(updated)
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Process Next Step
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
