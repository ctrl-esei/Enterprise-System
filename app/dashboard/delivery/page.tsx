"use client"

import { useState } from 'react'
import { useData, type DeliveryStatus } from '@/contexts/data-context'
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
  Truck,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Package,
  Navigation,
  UserPlus,
  BarChart3,
  Phone
} from 'lucide-react'

export default function DeliveryPage() {
  const { deliveries, riders, orders, updateDeliveryStatus, assignRider, updateOrderStatus, addNotification } = useData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState<typeof deliveries[0] | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [newStatus, setNewStatus] = useState<DeliveryStatus | ''>('')

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (delivery.riderName && delivery.riderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableRiders = riders.filter(r => r.status === 'Available')

  const stats = {
    total: deliveries.length,
    preparing: deliveries.filter(d => d.status === 'Preparing').length,
    outForDelivery: deliveries.filter(d => d.status === 'Out for Delivery').length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
    activeRiders: riders.filter(r => r.status === 'On Delivery').length,
  }

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] border-[oklch(0.65_0.2_145/0.3)]'
      case 'Out for Delivery':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
      case 'Picked Up':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'Rider Assigned':
        return 'bg-[oklch(0.7_0.18_300/0.2)] text-[oklch(0.7_0.18_300)] border-[oklch(0.7_0.18_300/0.3)]'
      case 'Preparing':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'Out for Delivery':
        return <Navigation className="h-4 w-4" />
      case 'Picked Up':
        return <Package className="h-4 w-4" />
      case 'Rider Assigned':
        return <User className="h-4 w-4" />
      case 'Preparing':
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleAssignRider = () => {
    if (!selectedDelivery || !selectedRiderId) return

    const rider = riders.find(r => r.id === selectedRiderId)
    if (!rider) return

    assignRider(selectedDelivery.id, selectedRiderId)
    updateOrderStatus(selectedDelivery.orderId, 'Rider Assigned')
    
    const order = orders.find(o => o.id === selectedDelivery.orderId)
    if (order) {
      addNotification({
        orderId: selectedDelivery.orderId,
        recipient: order.customerName,
        type: 'Rider Assigned',
        message: `${rider.name} has been assigned to deliver your order ${selectedDelivery.orderId}. Track your delivery in real-time!`,
        status: 'Sent'
      })
    }

    toast({
      title: "Rider Assigned",
      description: `${rider.name} has been assigned to order ${selectedDelivery.orderId}`,
    })

    setIsAssignDialogOpen(false)
    setSelectedDelivery(null)
    setSelectedRiderId('')
  }

  const handleUpdateStatus = () => {
    if (!selectedDelivery || !newStatus) return

    updateDeliveryStatus(selectedDelivery.id, newStatus)
    
    // Update order status based on delivery status
    if (newStatus === 'Out for Delivery') {
      updateOrderStatus(selectedDelivery.orderId, 'Out for Delivery')
    } else if (newStatus === 'Delivered') {
      updateOrderStatus(selectedDelivery.orderId, 'Delivered')
    }

    const order = orders.find(o => o.id === selectedDelivery.orderId)
    if (order) {
      const notificationMessages: Record<DeliveryStatus, string> = {
        'Preparing': `Your order ${selectedDelivery.orderId} is being prepared for delivery.`,
        'Rider Assigned': `A rider has been assigned to your order ${selectedDelivery.orderId}.`,
        'Picked Up': `Your order ${selectedDelivery.orderId} has been picked up and is on its way!`,
        'Out for Delivery': `Your order ${selectedDelivery.orderId} is out for delivery! Track your rider.`,
        'Delivered': `Your order ${selectedDelivery.orderId} has been delivered. Thank you!`
      }

      addNotification({
        orderId: selectedDelivery.orderId,
        recipient: order.customerName,
        type: newStatus,
        message: notificationMessages[newStatus],
        status: 'Sent'
      })
    }

    toast({
      title: "Status Updated",
      description: `Delivery status updated to ${newStatus}`,
    })

    setIsStatusDialogOpen(false)
    setSelectedDelivery(null)
    setNewStatus('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[oklch(0.75_0.15_85/0.2)]">
              <Truck className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Delivery Tracking Service</h1>
          </div>
          <p className="text-muted-foreground">Assign riders and track delivery progress</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.75_0.15_85/0.2)]">
                <Navigation className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.outForDelivery}</p>
                <p className="text-sm text-muted-foreground">Out for Delivery</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeRiders}</p>
                <p className="text-sm text-muted-foreground">Active Riders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Info */}
      <Card className="bg-card border-border border-l-4 border-l-[oklch(0.75_0.15_85)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[oklch(0.75_0.15_85/0.2)]">
              <BarChart3 className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Delivery Tracking Service Role</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This service manages the delivery process after payment is confirmed. It handles rider assignments, 
                tracks delivery progress through multiple stages, and provides estimated delivery times. 
                Each status change triggers notifications to keep customers informed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Riders */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Available Riders</CardTitle>
          <CardDescription className="text-muted-foreground">{availableRiders.length} riders available for assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {riders.map((rider) => (
              <div
                key={rider.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  rider.status === 'Available' 
                    ? 'bg-[oklch(0.65_0.2_145/0.1)] border-[oklch(0.65_0.2_145/0.3)]' 
                    : rider.status === 'On Delivery'
                    ? 'bg-[oklch(0.75_0.15_85/0.1)] border-[oklch(0.75_0.15_85/0.3)]'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="p-2 rounded-full bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{rider.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {rider.phone}
                  </div>
                </div>
                <Badge className={`ml-2 ${
                  rider.status === 'Available' 
                    ? 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)]' 
                    : rider.status === 'On Delivery'
                    ? 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)]'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {rider.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, rider name, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Delivery List</CardTitle>
          <CardDescription className="text-muted-foreground">{filteredDeliveries.length} deliveries found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Delivery ID</TableHead>
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Rider</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground">Est. Time</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="border-border hover:bg-secondary/30">
                    <TableCell className="font-mono text-sm text-foreground">{delivery.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{delivery.orderId}</TableCell>
                    <TableCell>
                      {delivery.riderName ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-secondary">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-foreground">{delivery.riderName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground truncate">{delivery.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {delivery.estimatedTime ? formatDate(delivery.estimatedTime) : 'TBD'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(delivery.status)} border`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(delivery.status)}
                          {delivery.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!delivery.riderId && delivery.status === 'Preparing' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedDelivery(delivery)
                              setIsAssignDialogOpen(true)
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        )}
                        {delivery.status !== 'Delivered' && delivery.riderId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDelivery(delivery)
                              setNewStatus('')
                              setIsStatusDialogOpen(true)
                            }}
                            className="border-border text-foreground"
                          >
                            Update
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

      {/* Assign Rider Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Assign Rider
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a rider to assign to this delivery
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">{selectedDelivery.orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedDelivery.address}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Select Rider</Label>
                <Select value={selectedRiderId} onValueChange={setSelectedRiderId}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Choose an available rider" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableRiders.length > 0 ? (
                      availableRiders.map((rider) => (
                        <SelectItem key={rider.id} value={rider.id}>
                          {rider.name} - {rider.phone}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No riders available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleAssignRider}
                  disabled={!selectedRiderId}
                >
                  Assign Rider
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Update Delivery Status</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the current status of this delivery
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4 pt-4">
              {/* Timeline */}
              <div className="space-y-2">
                <Label className="text-foreground">Delivery Timeline</Label>
                <div className="p-4 rounded-lg bg-secondary/30">
                  {selectedDelivery.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 relative">
                      {index < selectedDelivery.timeline.length - 1 && (
                        <div className="absolute left-[11px] top-6 w-0.5 h-[calc(100%+0.5rem)] bg-border" />
                      )}
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                        index === selectedDelivery.timeline.length - 1 
                          ? 'bg-primary' 
                          : 'bg-[oklch(0.65_0.2_145)]'
                      }`}>
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-foreground">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">New Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as DeliveryStatus)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {['Picked Up', 'Out for Delivery', 'Delivered'].map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground"
                  onClick={() => setIsStatusDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
