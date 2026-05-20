"use client"

import { useState } from 'react'
import { useData, type PaymentStatus } from '@/contexts/data-context'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader2,
  ShieldCheck,
  BarChart3
} from 'lucide-react'

export default function PaymentsPage() {
  const { payments, updatePaymentStatus, updateOrderStatus, addNotification, orders } = useData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredPayments = payments.filter(payment =>
    payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'Pending').length,
    processing: payments.filter(p => p.status === 'Processing').length,
    paid: payments.filter(p => p.status === 'Paid').length,
    failed: payments.filter(p => p.status === 'Failed').length,
    totalAmount: payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] border-[oklch(0.65_0.2_145/0.3)]'
      case 'Processing':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'Pending':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
      case 'Failed':
        return 'bg-destructive/20 text-destructive border-destructive/30'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4" />
      case 'Processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'Pending':
        return <Clock className="h-4 w-4" />
      case 'Failed':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleVerifyPayment = async () => {
    if (!selectedPayment) return
    
    setIsProcessing(true)
    
    // Simulate processing
    updatePaymentStatus(selectedPayment.id, 'Processing')
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mark as paid
    updatePaymentStatus(selectedPayment.id, 'Paid')
    updateOrderStatus(selectedPayment.orderId, 'Payment Confirmed')
    
    // Find order and send notification
    const order = orders.find(o => o.id === selectedPayment.orderId)
    if (order) {
      addNotification({
        orderId: selectedPayment.orderId,
        recipient: order.customerName,
        type: 'Payment Confirmed',
        message: `Payment of $${selectedPayment.amount.toFixed(2)} confirmed for order ${selectedPayment.orderId}. Preparing your order!`,
        status: 'Sent'
      })
    }
    
    toast({
      title: "Payment Verified",
      description: `Payment for ${selectedPayment.orderId} has been confirmed`,
    })
    
    setIsProcessing(false)
    setIsVerifyDialogOpen(false)
    setSelectedPayment(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
            <div className="p-2 rounded-lg bg-[oklch(0.7_0.18_300/0.2)]">
              <CreditCard className="h-5 w-5 text-[oklch(0.7_0.18_300)]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Payment Service</h1>
          </div>
          <p className="text-muted-foreground">Process and verify payment transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_145/0.2)]">
                <DollarSign className="h-5 w-5 text-[oklch(0.65_0.2_145)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${stats.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.paid}</p>
                <p className="text-sm text-muted-foreground">Paid</p>
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
                <XCircle className="h-5 w-5 text-destructive" />
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
      <Card className="bg-card border-border border-l-4 border-l-[oklch(0.7_0.18_300)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[oklch(0.7_0.18_300/0.2)]">
              <BarChart3 className="h-5 w-5 text-[oklch(0.7_0.18_300)]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Payment Service Role</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This service processes payments after inventory is confirmed. When a payment is verified, 
                the order status changes to &quot;Payment Confirmed&quot; and the delivery preparation begins. 
                The service supports multiple payment methods and handles transaction verification.
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
              placeholder="Search by order ID, customer name, or payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Payment Transactions</CardTitle>
          <CardDescription className="text-muted-foreground">{filteredPayments.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Payment ID</TableHead>
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Method</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-border hover:bg-secondary/30">
                    <TableCell className="font-mono text-sm text-foreground">{payment.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{payment.orderId}</TableCell>
                    <TableCell className="text-foreground">{payment.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-medium">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(payment.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(payment.status)} border`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.status === 'Pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setIsVerifyDialogOpen(true)
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      {payment.status === 'Paid' && (
                        <span className="text-sm text-[oklch(0.65_0.2_145)] flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Verified
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Verify Payment Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verify Payment
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Confirm and process this payment transaction
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm text-foreground">{selectedPayment.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">{selectedPayment.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer</span>
                  <span className="text-foreground">{selectedPayment.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="flex items-center gap-2 text-foreground">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {selectedPayment.method}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-medium text-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-foreground">${selectedPayment.amount.toFixed(2)}</span>
                </div>
              </div>

              {isProcessing && (
                <div className="p-4 rounded-lg bg-primary/10 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">Processing payment...</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground"
                  onClick={() => setIsVerifyDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleVerifyPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
