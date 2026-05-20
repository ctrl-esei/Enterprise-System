"use client"

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Bell,
  Search,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare,
  Plus,
  BarChart3,
  Package,
  CreditCard,
  Truck,
  ShoppingCart
} from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, customers, orders, addNotification } = useData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    orderId: '',
    type: '',
    message: ''
  })

  const filteredNotifications = notifications.filter(notification =>
    notification.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'Sent').length,
    pending: notifications.filter(n => n.status === 'Pending').length,
    failed: notifications.filter(n => n.status === 'Failed').length,
  }

  const notificationTypes = [
    { value: 'Order Received', icon: ShoppingCart },
    { value: 'Inventory Confirmed', icon: Package },
    { value: 'Payment Confirmed', icon: CreditCard },
    { value: 'Rider Assigned', icon: Truck },
    { value: 'Out for Delivery', icon: Truck },
    { value: 'Order Delivered', icon: CheckCircle },
    { value: 'Custom Message', icon: MessageSquare },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] border-[oklch(0.65_0.2_145/0.3)]'
      case 'Pending':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
      case 'Failed':
        return 'bg-destructive/20 text-destructive border-destructive/30'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Order Received':
        return <ShoppingCart className="h-4 w-4" />
      case 'Inventory Confirmed':
        return <Package className="h-4 w-4" />
      case 'Payment Confirmed':
        return <CreditCard className="h-4 w-4" />
      case 'Rider Assigned':
      case 'Out for Delivery':
        return <Truck className="h-4 w-4" />
      case 'Order Delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const handleSendNotification = () => {
    if (!newNotification.orderId || !newNotification.type || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const order = orders.find(o => o.id === newNotification.orderId)
    if (!order) {
      toast({
        title: "Error",
        description: "Order not found",
        variant: "destructive"
      })
      return
    }

    addNotification({
      orderId: newNotification.orderId,
      recipient: order.customerName,
      type: newNotification.type,
      message: newNotification.message,
      status: 'Sent'
    })

    toast({
      title: "Notification Sent",
      description: `Message sent to ${order.customerName}`,
    })

    setIsAddDialogOpen(false)
    setNewNotification({ orderId: '', type: '', message: '' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateTemplateMessage = (type: string, orderId: string) => {
    const templates: Record<string, string> = {
      'Order Received': `Thank you for your order ${orderId}! We have received your order and are processing it now.`,
      'Inventory Confirmed': `Good news! All items for your order ${orderId} are in stock and have been reserved for you.`,
      'Payment Confirmed': `Payment confirmed for order ${orderId}. We are now preparing your order for delivery!`,
      'Rider Assigned': `A delivery rider has been assigned to your order ${orderId}. Track your delivery in real-time!`,
      'Out for Delivery': `Your order ${orderId} is now out for delivery! The rider is on their way to you.`,
      'Order Delivered': `Your order ${orderId} has been delivered successfully. Thank you for shopping with us!`,
      'Custom Message': ''
    }
    return templates[type] || ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Notification Service</h1>
          </div>
          <p className="text-muted-foreground">Manage and send customer notifications</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Send Notification</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Send a notification to a customer about their order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Order</Label>
                <Select 
                  value={newNotification.orderId} 
                  onValueChange={(v) => setNewNotification(prev => ({ ...prev, orderId: v }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Notification Type</Label>
                <Select 
                  value={newNotification.type} 
                  onValueChange={(v) => {
                    setNewNotification(prev => ({ 
                      ...prev, 
                      type: v,
                      message: generateTemplateMessage(v, prev.orderId)
                    }))
                  }}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.value}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Message</Label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-input border-border text-foreground min-h-[100px]"
                  placeholder="Enter notification message..."
                />
              </div>

              <Button 
                onClick={handleSendNotification} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_145/0.2)]">
                <CheckCircle className="h-5 w-5 text-[oklch(0.65_0.2_145)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.sent}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.75_0.15_85/0.2)]">
                <Clock className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Info */}
      <Card className="bg-card border-border border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notification Service Role</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This service sends automated notifications to customers at each stage of the order process. 
                Notifications are triggered when orders are received, inventory is confirmed, payments are processed, 
                riders are assigned, and deliveries are completed. This keeps customers informed throughout their journey.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by recipient, type, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Notification History</CardTitle>
          <CardDescription className="text-muted-foreground">{filteredNotifications.length} notifications found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Recipient</TableHead>
                  <TableHead className="text-muted-foreground">Order</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Message</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id} className="border-border hover:bg-secondary/30">
                    <TableCell className="font-mono text-sm text-foreground">{notification.id}</TableCell>
                    <TableCell className="text-foreground font-medium">{notification.recipient}</TableCell>
                    <TableCell className="text-muted-foreground">{notification.orderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        <span className="text-foreground">{notification.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm line-clamp-2 max-w-[300px]">
                        {notification.message}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(notification.status)} border`}>
                        <span className="flex items-center gap-1.5">
                          {notification.status === 'Sent' && <CheckCircle className="h-3 w-3" />}
                          {notification.status === 'Pending' && <Clock className="h-3 w-3" />}
                          {notification.status === 'Failed' && <AlertCircle className="h-3 w-3" />}
                          {notification.status}
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
