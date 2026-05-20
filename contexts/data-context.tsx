"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Types
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  price: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Rider {
  id: string
  name: string
  phone: string
  status: 'Available' | 'On Delivery' | 'Off Duty'
  currentOrders: number
}

export type OrderStatus = 
  | 'Pending Inventory Check'
  | 'Inventory Confirmed'
  | 'Payment Pending'
  | 'Payment Confirmed'
  | 'Rider Assigned'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Failed'

export type PaymentStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed'

export type DeliveryStatus = 'Preparing' | 'Rider Assigned' | 'Picked Up' | 'Out for Delivery' | 'Delivered'

export interface Order {
  id: string
  customerId: string
  customerName: string
  products: { productId: string; productName: string; quantity: number; price: number }[]
  total: number
  status: OrderStatus
  createdAt: string
  paymentMethod: string
  deliveryAddress: string
}

export interface Payment {
  id: string
  orderId: string
  customerName: string
  amount: number
  method: string
  status: PaymentStatus
  createdAt: string
}

export interface Delivery {
  id: string
  orderId: string
  riderId: string | null
  riderName: string | null
  address: string
  status: DeliveryStatus
  estimatedTime: string | null
  timeline: { status: string; timestamp: string }[]
}

export interface Notification {
  id: string
  orderId: string
  recipient: string
  type: string
  message: string
  status: 'Sent' | 'Pending' | 'Failed'
  createdAt: string
}

interface DataContextType {
  products: Product[]
  customers: Customer[]
  riders: Rider[]
  orders: Order[]
  payments: Payment[]
  deliveries: Delivery[]
  notifications: Notification[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  updateProductStock: (productId: string, newStock: number) => void
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => string
  updatePaymentStatus: (paymentId: string, status: PaymentStatus) => void
  addDelivery: (delivery: Omit<Delivery, 'id' | 'timeline'>) => string
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void
  assignRider: (deliveryId: string, riderId: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  processOrderStep: (orderId: string) => { success: boolean; message: string; nextStatus?: OrderStatus }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Initial Sample Data
const initialProducts: Product[] = [
  { id: 'PRD001', name: 'MacBook Pro 16"', sku: 'TECH-MBP16', category: 'Electronics', stock: 25, price: 2499.99, status: 'In Stock' },
  { id: 'PRD002', name: 'iPhone 15 Pro Max', sku: 'TECH-IP15PM', category: 'Electronics', stock: 50, price: 1199.99, status: 'In Stock' },
  { id: 'PRD003', name: 'Sony WH-1000XM5', sku: 'AUDIO-WH5', category: 'Audio', stock: 8, price: 399.99, status: 'Low Stock' },
  { id: 'PRD004', name: 'Samsung 65" OLED TV', sku: 'TV-SAM65', category: 'Electronics', stock: 0, price: 1899.99, status: 'Out of Stock' },
  { id: 'PRD005', name: 'iPad Air M2', sku: 'TECH-IPADM2', category: 'Electronics', stock: 35, price: 799.99, status: 'In Stock' },
  { id: 'PRD006', name: 'Dell XPS 15', sku: 'TECH-DXPS15', category: 'Electronics', stock: 12, price: 1799.99, status: 'In Stock' },
  { id: 'PRD007', name: 'AirPods Pro 2', sku: 'AUDIO-APP2', category: 'Audio', stock: 5, price: 249.99, status: 'Low Stock' },
  { id: 'PRD008', name: 'Apple Watch Ultra 2', sku: 'WEAR-AWU2', category: 'Wearables', stock: 20, price: 799.99, status: 'In Stock' },
]

const initialCustomers: Customer[] = [
  { id: 'CUST001', name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0101', address: '123 Main St, New York, NY 10001' },
  { id: 'CUST002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0102', address: '456 Oak Ave, Los Angeles, CA 90001' },
  { id: 'CUST003', name: 'Michael Chen', email: 'mchen@email.com', phone: '+1 555-0103', address: '789 Pine Rd, Chicago, IL 60601' },
  { id: 'CUST004', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 555-0104', address: '321 Elm St, Houston, TX 77001' },
  { id: 'CUST005', name: 'Robert Wilson', email: 'rwilson@email.com', phone: '+1 555-0105', address: '654 Maple Dr, Phoenix, AZ 85001' },
]

const initialRiders: Rider[] = [
  { id: 'RDR001', name: 'Alex Thompson', phone: '+1 555-1001', status: 'Available', currentOrders: 0 },
  { id: 'RDR002', name: 'Maria Garcia', phone: '+1 555-1002', status: 'On Delivery', currentOrders: 2 },
  { id: 'RDR003', name: 'James Brown', phone: '+1 555-1003', status: 'Available', currentOrders: 0 },
  { id: 'RDR004', name: 'Lisa Anderson', phone: '+1 555-1004', status: 'Off Duty', currentOrders: 0 },
  { id: 'RDR005', name: 'David Lee', phone: '+1 555-1005', status: 'On Delivery', currentOrders: 1 },
]

const initialOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'CUST001',
    customerName: 'John Smith',
    products: [{ productId: 'PRD001', productName: 'MacBook Pro 16"', quantity: 1, price: 2499.99 }],
    total: 2499.99,
    status: 'Delivered',
    createdAt: '2024-01-15T10:30:00Z',
    paymentMethod: 'Credit Card',
    deliveryAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD002',
    customerId: 'CUST002',
    customerName: 'Sarah Johnson',
    products: [
      { productId: 'PRD002', productName: 'iPhone 15 Pro Max', quantity: 1, price: 1199.99 },
      { productId: 'PRD007', productName: 'AirPods Pro 2', quantity: 1, price: 249.99 }
    ],
    total: 1449.98,
    status: 'Out for Delivery',
    createdAt: '2024-01-16T14:20:00Z',
    paymentMethod: 'PayPal',
    deliveryAddress: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    id: 'ORD003',
    customerId: 'CUST003',
    customerName: 'Michael Chen',
    products: [{ productId: 'PRD003', productName: 'Sony WH-1000XM5', quantity: 2, price: 399.99 }],
    total: 799.98,
    status: 'Payment Confirmed',
    createdAt: '2024-01-17T09:15:00Z',
    paymentMethod: 'Credit Card',
    deliveryAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 'ORD004',
    customerId: 'CUST004',
    customerName: 'Emily Davis',
    products: [{ productId: 'PRD005', productName: 'iPad Air M2', quantity: 1, price: 799.99 }],
    total: 799.99,
    status: 'Pending Inventory Check',
    createdAt: '2024-01-18T11:45:00Z',
    paymentMethod: 'Bank Transfer',
    deliveryAddress: '321 Elm St, Houston, TX 77001'
  },
  {
    id: 'ORD005',
    customerId: 'CUST005',
    customerName: 'Robert Wilson',
    products: [{ productId: 'PRD008', productName: 'Apple Watch Ultra 2', quantity: 1, price: 799.99 }],
    total: 799.99,
    status: 'Inventory Confirmed',
    createdAt: '2024-01-18T16:30:00Z',
    paymentMethod: 'Credit Card',
    deliveryAddress: '654 Maple Dr, Phoenix, AZ 85001'
  },
]

const initialPayments: Payment[] = [
  { id: 'PAY001', orderId: 'ORD001', customerName: 'John Smith', amount: 2499.99, method: 'Credit Card', status: 'Paid', createdAt: '2024-01-15T10:35:00Z' },
  { id: 'PAY002', orderId: 'ORD002', customerName: 'Sarah Johnson', amount: 1449.98, method: 'PayPal', status: 'Paid', createdAt: '2024-01-16T14:25:00Z' },
  { id: 'PAY003', orderId: 'ORD003', customerName: 'Michael Chen', amount: 799.98, method: 'Credit Card', status: 'Paid', createdAt: '2024-01-17T09:20:00Z' },
  { id: 'PAY004', orderId: 'ORD005', customerName: 'Robert Wilson', amount: 799.99, method: 'Credit Card', status: 'Pending', createdAt: '2024-01-18T16:35:00Z' },
]

const initialDeliveries: Delivery[] = [
  { 
    id: 'DEL001', 
    orderId: 'ORD001', 
    riderId: 'RDR001', 
    riderName: 'Alex Thompson', 
    address: '123 Main St, New York, NY 10001', 
    status: 'Delivered', 
    estimatedTime: '2024-01-15T14:00:00Z',
    timeline: [
      { status: 'Preparing', timestamp: '2024-01-15T11:00:00Z' },
      { status: 'Rider Assigned', timestamp: '2024-01-15T11:30:00Z' },
      { status: 'Picked Up', timestamp: '2024-01-15T12:00:00Z' },
      { status: 'Out for Delivery', timestamp: '2024-01-15T12:30:00Z' },
      { status: 'Delivered', timestamp: '2024-01-15T13:45:00Z' },
    ]
  },
  { 
    id: 'DEL002', 
    orderId: 'ORD002', 
    riderId: 'RDR002', 
    riderName: 'Maria Garcia', 
    address: '456 Oak Ave, Los Angeles, CA 90001', 
    status: 'Out for Delivery', 
    estimatedTime: '2024-01-16T18:00:00Z',
    timeline: [
      { status: 'Preparing', timestamp: '2024-01-16T15:00:00Z' },
      { status: 'Rider Assigned', timestamp: '2024-01-16T15:30:00Z' },
      { status: 'Picked Up', timestamp: '2024-01-16T16:00:00Z' },
      { status: 'Out for Delivery', timestamp: '2024-01-16T16:30:00Z' },
    ]
  },
  { 
    id: 'DEL003', 
    orderId: 'ORD003', 
    riderId: null, 
    riderName: null, 
    address: '789 Pine Rd, Chicago, IL 60601', 
    status: 'Preparing', 
    estimatedTime: null,
    timeline: [
      { status: 'Preparing', timestamp: '2024-01-17T09:30:00Z' },
    ]
  },
]

const initialNotifications: Notification[] = [
  { id: 'NOT001', orderId: 'ORD001', recipient: 'John Smith', type: 'Order Delivered', message: 'Your order ORD001 has been delivered successfully!', status: 'Sent', createdAt: '2024-01-15T13:46:00Z' },
  { id: 'NOT002', orderId: 'ORD002', recipient: 'Sarah Johnson', type: 'Out for Delivery', message: 'Your order ORD002 is out for delivery. Expected arrival: 6:00 PM', status: 'Sent', createdAt: '2024-01-16T16:31:00Z' },
  { id: 'NOT003', orderId: 'ORD002', recipient: 'Sarah Johnson', type: 'Rider Assigned', message: 'Maria Garcia has been assigned to deliver your order ORD002.', status: 'Sent', createdAt: '2024-01-16T15:31:00Z' },
  { id: 'NOT004', orderId: 'ORD003', recipient: 'Michael Chen', type: 'Payment Confirmed', message: 'Payment confirmed for order ORD003. Preparing your items!', status: 'Sent', createdAt: '2024-01-17T09:21:00Z' },
  { id: 'NOT005', orderId: 'ORD004', recipient: 'Emily Davis', type: 'Order Received', message: 'We have received your order ORD004. Processing now.', status: 'Sent', createdAt: '2024-01-18T11:46:00Z' },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [customers] = useState<Customer[]>(initialCustomers)
  const [riders, setRiders] = useState<Rider[]>(initialRiders)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const generateId = (prefix: string) => {
    return `${prefix}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  }

  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>) => {
    const id = generateId('ORD')
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date().toISOString()
    }
    setOrders(prev => [...prev, newOrder])
    return id
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ))
  }, [])

  const updateProductStock = useCallback((productId: string, newStock: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        let status: Product['status'] = 'In Stock'
        if (newStock === 0) status = 'Out of Stock'
        else if (newStock < 10) status = 'Low Stock'
        return { ...product, stock: newStock, status }
      }
      return product
    }))
  }, [])

  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const id = generateId('PAY')
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: new Date().toISOString()
    }
    setPayments(prev => [...prev, newPayment])
    return id
  }, [])

  const updatePaymentStatus = useCallback((paymentId: string, status: PaymentStatus) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId ? { ...payment, status } : payment
    ))
  }, [])

  const addDelivery = useCallback((delivery: Omit<Delivery, 'id' | 'timeline'>) => {
    const id = generateId('DEL')
    const newDelivery: Delivery = {
      ...delivery,
      id,
      timeline: [{ status: 'Preparing', timestamp: new Date().toISOString() }]
    }
    setDeliveries(prev => [...prev, newDelivery])
    return id
  }, [])

  const updateDeliveryStatus = useCallback((deliveryId: string, status: DeliveryStatus) => {
    setDeliveries(prev => prev.map(delivery => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          status,
          timeline: [...delivery.timeline, { status, timestamp: new Date().toISOString() }]
        }
      }
      return delivery
    }))
  }, [])

  const assignRider = useCallback((deliveryId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId)
    if (!rider) return

    setDeliveries(prev => prev.map(delivery => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          riderId,
          riderName: rider.name,
          status: 'Rider Assigned' as DeliveryStatus,
          timeline: [...delivery.timeline, { status: 'Rider Assigned', timestamp: new Date().toISOString() }],
          estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }
      }
      return delivery
    }))

    setRiders(prev => prev.map(r => 
      r.id === riderId ? { ...r, status: 'On Delivery' as const, currentOrders: r.currentOrders + 1 } : r
    ))
  }, [riders])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = generateId('NOT')
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const processOrderStep = useCallback((orderId: string): { success: boolean; message: string; nextStatus?: OrderStatus } => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return { success: false, message: 'Order not found' }

    switch (order.status) {
      case 'Pending Inventory Check': {
        // Check inventory
        const allAvailable = order.products.every(item => {
          const product = products.find(p => p.id === item.productId)
          return product && product.stock >= item.quantity
        })
        
        if (allAvailable) {
          // Reserve stock
          order.products.forEach(item => {
            const product = products.find(p => p.id === item.productId)
            if (product) {
              updateProductStock(item.productId, product.stock - item.quantity)
            }
          })
          updateOrderStatus(orderId, 'Inventory Confirmed')
          addNotification({
            orderId,
            recipient: order.customerName,
            type: 'Inventory Confirmed',
            message: `Good news! All items for your order ${orderId} are in stock and reserved.`,
            status: 'Sent'
          })
          return { success: true, message: 'Inventory validated and confirmed', nextStatus: 'Inventory Confirmed' }
        } else {
          return { success: false, message: 'Some items are out of stock or have insufficient quantity' }
        }
      }

      case 'Inventory Confirmed': {
        // Create payment if not exists
        const existingPayment = payments.find(p => p.orderId === orderId)
        if (!existingPayment) {
          addPayment({
            orderId,
            customerName: order.customerName,
            amount: order.total,
            method: order.paymentMethod,
            status: 'Pending'
          })
        }
        updateOrderStatus(orderId, 'Payment Pending')
        return { success: true, message: 'Awaiting payment confirmation', nextStatus: 'Payment Pending' }
      }

      case 'Payment Pending': {
        const payment = payments.find(p => p.orderId === orderId)
        if (payment) {
          updatePaymentStatus(payment.id, 'Paid')
        }
        updateOrderStatus(orderId, 'Payment Confirmed')
        addNotification({
          orderId,
          recipient: order.customerName,
          type: 'Payment Confirmed',
          message: `Payment confirmed for order ${orderId}. Preparing your order for delivery!`,
          status: 'Sent'
        })
        return { success: true, message: 'Payment confirmed successfully', nextStatus: 'Payment Confirmed' }
      }

      case 'Payment Confirmed': {
        // Create delivery if not exists
        const existingDelivery = deliveries.find(d => d.orderId === orderId)
        if (!existingDelivery) {
          addDelivery({
            orderId,
            riderId: null,
            riderName: null,
            address: order.deliveryAddress,
            status: 'Preparing',
            estimatedTime: null
          })
        }
        
        // Auto-assign available rider
        const availableRider = riders.find(r => r.status === 'Available')
        if (availableRider) {
          const delivery = deliveries.find(d => d.orderId === orderId) || { id: generateId('DEL') }
          assignRider(delivery.id, availableRider.id)
          updateOrderStatus(orderId, 'Rider Assigned')
          addNotification({
            orderId,
            recipient: order.customerName,
            type: 'Rider Assigned',
            message: `${availableRider.name} has been assigned to deliver your order ${orderId}.`,
            status: 'Sent'
          })
          return { success: true, message: `Rider ${availableRider.name} assigned`, nextStatus: 'Rider Assigned' }
        } else {
          return { success: false, message: 'No riders available. Please try again later.' }
        }
      }

      case 'Rider Assigned': {
        const delivery = deliveries.find(d => d.orderId === orderId)
        if (delivery) {
          updateDeliveryStatus(delivery.id, 'Out for Delivery')
        }
        updateOrderStatus(orderId, 'Out for Delivery')
        addNotification({
          orderId,
          recipient: order.customerName,
          type: 'Out for Delivery',
          message: `Your order ${orderId} is now out for delivery! Track your rider in real-time.`,
          status: 'Sent'
        })
        return { success: true, message: 'Order is out for delivery', nextStatus: 'Out for Delivery' }
      }

      case 'Out for Delivery': {
        const delivery = deliveries.find(d => d.orderId === orderId)
        if (delivery) {
          updateDeliveryStatus(delivery.id, 'Delivered')
          // Free up rider
          if (delivery.riderId) {
            setRiders(prev => prev.map(r => 
              r.id === delivery.riderId ? { ...r, status: 'Available' as const, currentOrders: Math.max(0, r.currentOrders - 1) } : r
            ))
          }
        }
        updateOrderStatus(orderId, 'Delivered')
        addNotification({
          orderId,
          recipient: order.customerName,
          type: 'Order Delivered',
          message: `Your order ${orderId} has been delivered successfully! Thank you for shopping with us.`,
          status: 'Sent'
        })
        return { success: true, message: 'Order delivered successfully!', nextStatus: 'Delivered' }
      }

      case 'Delivered':
        return { success: false, message: 'Order already delivered' }

      default:
        return { success: false, message: 'Unknown order status' }
    }
  }, [orders, products, payments, deliveries, riders, updateOrderStatus, updateProductStock, addPayment, updatePaymentStatus, addDelivery, updateDeliveryStatus, assignRider, addNotification])

  return (
    <DataContext.Provider value={{
      products,
      customers,
      riders,
      orders,
      payments,
      deliveries,
      notifications,
      addOrder,
      updateOrderStatus,
      updateProductStock,
      addPayment,
      updatePaymentStatus,
      addDelivery,
      updateDeliveryStatus,
      assignRider,
      addNotification,
      processOrderStep
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
