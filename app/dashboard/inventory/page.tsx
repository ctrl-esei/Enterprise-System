"use client"

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Database,
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit2,
  TrendingDown,
  TrendingUp,
  BarChart3
} from 'lucide-react'

export default function InventoryPage() {
  const { products, updateProductStock } = useData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [newStock, setNewStock] = useState('')
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === 'In Stock').length,
    lowStock: products.filter(p => p.status === 'Low Stock').length,
    outOfStock: products.filter(p => p.status === 'Out of Stock').length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-[oklch(0.65_0.2_145/0.2)] text-[oklch(0.65_0.2_145)] border-[oklch(0.65_0.2_145/0.3)]'
      case 'Low Stock':
        return 'bg-[oklch(0.75_0.15_85/0.2)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85/0.3)]'
      case 'Out of Stock':
        return 'bg-destructive/20 text-destructive border-destructive/30'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="h-4 w-4" />
      case 'Low Stock':
        return <AlertTriangle className="h-4 w-4" />
      case 'Out of Stock':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleUpdateStock = () => {
    if (!selectedProduct || !newStock) return
    
    const stockValue = parseInt(newStock)
    if (isNaN(stockValue) || stockValue < 0) {
      toast({
        title: "Invalid Stock Value",
        description: "Please enter a valid positive number",
        variant: "destructive"
      })
      return
    }

    updateProductStock(selectedProduct.id, stockValue)
    toast({
      title: "Stock Updated",
      description: `${selectedProduct.name} stock updated to ${stockValue} units`,
    })
    setIsUpdateDialogOpen(false)
    setSelectedProduct(null)
    setNewStock('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_165/0.2)]">
              <Database className="h-5 w-5 text-[oklch(0.65_0.2_165)]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Service</h1>
          </div>
          <p className="text-muted-foreground">Manage product stock and validate inventory for orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.inStock}</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Info */}
      <Card className="bg-card border-border border-l-4 border-l-[oklch(0.65_0.2_165)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[oklch(0.65_0.2_165/0.2)]">
              <BarChart3 className="h-5 w-5 text-[oklch(0.65_0.2_165)]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Inventory Service Role</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This service validates product availability when orders are created. If all products in an order are in stock, 
                the order status changes to &quot;Inventory Confirmed&quot; and stock is reserved. If any product is unavailable, 
                the order cannot proceed.
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
              placeholder="Search by product name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Product Inventory</CardTitle>
          <CardDescription className="text-muted-foreground">{filteredProducts.length} products found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Product Name</TableHead>
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
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
                    <TableCell className="text-foreground font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.stock <= 10 && product.stock > 0 ? (
                          <TrendingDown className="h-4 w-4 text-[oklch(0.75_0.15_85)]" />
                        ) : product.stock > 10 ? (
                          <TrendingUp className="h-4 w-4 text-[oklch(0.65_0.2_145)]" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="font-medium text-foreground">{product.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(product.status)} border`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(product.status)}
                          {product.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setNewStock(product.stock.toString())
                          setIsUpdateDialogOpen(true)
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Update Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Update Stock</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the stock quantity for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProduct.sku}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-medium text-foreground">{selectedProduct.stock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Status</p>
                    <Badge className={`${getStatusColor(selectedProduct.status)} border mt-1`}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground">New Stock Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="Enter new stock quantity"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleUpdateStock}
                >
                  Update Stock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
