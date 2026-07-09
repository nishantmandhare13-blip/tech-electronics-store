export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number; // in INR
  gst: number; // percentage (e.g. 18)
  availableQuantity: number;
  stockStatus: 'In Stock' | 'Out Of Stock' | 'Low Stock';
  discountRules: {
    rule: string;
    description: string;
  };
  image: string; // url or placeholder
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  todayOffer?: boolean;
  latest?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  gstAmount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  gstTotal: number;
  finalAmount: number;
  timestamp: string;
  status: 'Pending' | 'Completed' | 'Shipped' | 'Cancelled';
  estimatedDelivery: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalProductsCount: number;
  bestSellingProduct: {
    name: string;
    quantity: number;
    revenue: number;
  };
  monthlySales: {
    month: string;
    sales: number;
    orders: number;
  }[];
  categorySales: {
    category: string;
    value: number;
  }[];
  dailyRevenue: {
    date: string;
    revenue: number;
  }[];
}
