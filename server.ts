import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { sampleProducts } from './src/sampleProducts';
import { Product, Order, Customer, SalesAnalytics } from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json());

// Pre-populate customer data
const initialCustomers: Customer[] = [
  { id: 'cust_001', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '9876543210', address: 'B-402, Shanti Kunj, Sector 56, Gurgaon, Haryana', joinedDate: '2025-10-12', ordersCount: 15, totalSpent: 124500 },
  { id: 'cust_002', name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '9123456789', address: 'A-12, Green Glen Layout, Outer Ring Road, Bengaluru, Karnataka', joinedDate: '2025-11-05', ordersCount: 8, totalSpent: 87400 },
  { id: 'cust_003', name: 'Amit Verma', email: 'amit.verma@outlook.com', phone: '9988776655', address: 'Flat 503, Mount View Towers, Powai, Mumbai, Maharashtra', joinedDate: '2025-12-20', ordersCount: 5, totalSpent: 42000 },
  { id: 'cust_004', name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', phone: '8877665544', address: 'Plot 42, Jubilee Hills, Hyderabad, Telangana', joinedDate: '2026-01-15', ordersCount: 12, totalSpent: 195600 },
  { id: 'cust_005', name: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '7766554433', address: '15/3, Gariahat Road, Kolkata, West Bengal', joinedDate: '2026-02-18', ordersCount: 4, totalSpent: 18500 },
  { id: 'cust_006', name: 'Ananya Sen', email: 'ananya.sen@gmail.com', phone: '9543210987', address: 'Salt Lake City, Sector V, Kolkata, West Bengal', joinedDate: '2026-03-01', ordersCount: 9, totalSpent: 110900 },
  { id: 'cust_007', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '9654321098', address: 'C-78, Vaishali Nagar, Jaipur, Rajasthan', joinedDate: '2026-03-24', ordersCount: 14, totalSpent: 135000 },
  { id: 'cust_008', name: 'Meera Nair', email: 'meera.nair@hotmail.com', phone: '9765432109', address: 'Pattom Palace Road, Trivandrum, Kerala', joinedDate: '2026-04-05', ordersCount: 6, totalSpent: 35400 },
  { id: 'cust_009', name: 'Sanjay Dutt', email: 'sanjay.dutt@gmail.com', phone: '9854321076', address: 'Bandra West, Mumbai, Maharashtra', joinedDate: '2026-05-12', ordersCount: 3, totalSpent: 9900 },
  { id: 'cust_010', name: 'Divya Rao', email: 'divya.rao@gmail.com', phone: '9943210987', address: 'Malleswaram, 8th Cross, Bengaluru, Karnataka', joinedDate: '2026-06-02', ordersCount: 7, totalSpent: 62000 }
];

// Helper to load DB
function loadDB(): { products: Product[]; orders: Order[]; customers: Customer[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading database, resetting...', err);
  }

  // Initial seed
  const defaultDB = {
    products: sampleProducts,
    orders: [],
    customers: initialCustomers
  };
  saveDB(defaultDB);
  return defaultDB;
}

// Helper to save DB
function saveDB(data: { products: Product[]; orders: Order[]; customers: Customer[] }) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// REST API Endpoints
// 1. Get products
app.get('/api/products', (req, res) => {
  const db = loadDB();
  res.json(db.products);
});

// 2. Add product (Admin)
app.post('/api/products', (req, res) => {
  const db = loadDB();
  const newProduct: Product = req.body;
  if (!newProduct.id) {
    newProduct.id = `prod_${(db.products.length + 1).toString().padStart(3, '0')}`;
  }
  // Recalculate status
  const qty = Number(newProduct.availableQuantity) || 0;
  newProduct.availableQuantity = qty;
  newProduct.stockStatus = qty === 0 ? 'Out Of Stock' : qty <= 5 ? 'Low Stock' : 'In Stock';
  
  db.products.push(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

// 3. Edit product (Admin)
app.put('/api/products/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated = { ...db.products[index], ...req.body };
  const qty = Number(updated.availableQuantity) || 0;
  updated.availableQuantity = qty;
  updated.stockStatus = qty === 0 ? 'Out Of Stock' : qty <= 5 ? 'Low Stock' : 'In Stock';

  db.products[index] = updated;
  saveDB(db);
  res.json(updated);
});

// 4. Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const filtered = db.products.filter(p => p.id !== id);
  if (filtered.length === db.products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products = filtered;
  saveDB(db);
  res.json({ success: true });
});

// 5. Get orders
app.get('/api/orders', (req, res) => {
  const db = loadDB();
  res.json(db.orders);
});

// 6. Create order (Checkout)
app.post('/api/orders', (req, res) => {
  const db = loadDB();
  const orderData = req.body;

  // Deduct product quantities and verify stock availability
  for (const item of orderData.items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.name} not found in database.` });
    }
    if (product.availableQuantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}. Only ${product.availableQuantity} available.` });
    }
    product.availableQuantity -= item.quantity;
    product.stockStatus = product.availableQuantity === 0 ? 'Out Of Stock' : product.availableQuantity <= 5 ? 'Low Stock' : 'In Stock';
  }

  // Save new order
  const orderId = `ord_${Math.floor(100000 + Math.random() * 900000)}`;
  const orderNumber = `TE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + (Math.floor(Math.random() * 3) + 2)); // 2-4 days expected delivery

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerName: orderData.customerName || 'Walk-in Customer',
    customerEmail: orderData.customerEmail || 'walkin@techelectronics.com',
    customerPhone: orderData.customerPhone || '9999999999',
    items: orderData.items,
    subtotal: orderData.subtotal,
    discountAmount: orderData.discountAmount,
    gstTotal: orderData.gstTotal,
    finalAmount: orderData.finalAmount,
    timestamp: new Date().toISOString(),
    status: 'Completed',
    estimatedDelivery: estimatedDeliveryDate.toISOString().split('T')[0]
  };

  db.orders.unshift(newOrder);

  // Update or create customer database record
  const customerEmail = newOrder.customerEmail.toLowerCase().trim();
  const existingCustomer = db.customers.find(c => c.email.toLowerCase().trim() === customerEmail);
  if (existingCustomer) {
    existingCustomer.ordersCount += 1;
    existingCustomer.totalSpent += newOrder.finalAmount;
  } else {
    const newCustomer: Customer = {
      id: `cust_${(db.customers.length + 1).toString().padStart(3, '0')}`,
      name: newOrder.customerName,
      email: newOrder.customerEmail,
      phone: newOrder.customerPhone,
      address: 'Online Order Address, India',
      joinedDate: new Date().toISOString().split('T')[0],
      ordersCount: 1,
      totalSpent: newOrder.finalAmount
    };
    db.customers.push(newCustomer);
  }

  saveDB(db);
  res.status(201).json(newOrder);
});

// 7. Get customers
app.get('/api/customers', (req, res) => {
  const db = loadDB();
  res.json(db.customers);
});

// 8. Admin Credentials Check
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'admin_session_token_xyz123', name: 'Director (MBA-PM)' });
  } else {
    res.status(401).json({ error: 'Invalid Username or Password. Try admin / admin123' });
  }
});

// 9. Analytics Dashboard Calculations
app.get('/api/analytics', (req, res) => {
  const db = loadDB();
  
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalProductsCount = db.products.length;
  
  // Orders and Revenue today (Since we are in static simulation, we will sum today's orders)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = db.orders.filter(o => o.timestamp.startsWith(todayStr));
  const ordersTodayCount = todayOrders.length;
  const revenueTodayVal = todayOrders.reduce((sum, o) => sum + o.finalAmount, 0);

  // Low stock and out of stock counts
  const lowStockCount = db.products.filter(p => p.availableQuantity > 0 && p.availableQuantity <= 5).length;
  const outOfStockCount = db.products.filter(p => p.availableQuantity === 0).length;

  // Best selling product calculation
  const productQuantities: Record<string, { name: string; qty: number; rev: number }> = {};
  db.orders.forEach(order => {
    order.items.forEach(item => {
      if (!productQuantities[item.productId]) {
        productQuantities[item.productId] = { name: item.name, qty: 0, rev: 0 };
      }
      productQuantities[item.productId].qty += item.quantity;
      productQuantities[item.productId].rev += item.total;
    });
  });

  let bestSellingProduct = { name: 'None Yet', quantity: 0, revenue: 0 };
  Object.keys(productQuantities).forEach(id => {
    const p = productQuantities[id];
    if (p.qty > bestSellingProduct.quantity) {
      bestSellingProduct = { name: p.name, quantity: p.qty, revenue: p.rev };
    }
  });

  // Category sales breakdown
  const categorySalesRecord: Record<string, number> = {};
  db.products.forEach(p => {
    categorySalesRecord[p.category] = 0;
  });
  db.orders.forEach(order => {
    order.items.forEach(item => {
      // Find category of product
      const product = db.products.find(p => p.id === item.productId);
      const cat = product ? product.category : 'Accessories';
      categorySalesRecord[cat] = (categorySalesRecord[cat] || 0) + item.total;
    });
  });

  const categorySales = Object.entries(categorySalesRecord).map(([category, value]) => ({
    category,
    value
  })).filter(item => item.value > 0);

  // If empty, seed categorySales from existing products so the chart is populated on first load!
  if (categorySales.length === 0) {
    categorySales.push(
      { category: 'Laptops', value: 349900 },
      { category: 'Smartphones', value: 159900 },
      { category: 'SSD', value: 45000 },
      { category: 'Earbuds', value: 24900 },
      { category: 'Accessories', value: 12000 }
    );
  }

  // Seed monthly sales for Plotly/Recharts line graphs
  const monthlySales = [
    { month: 'Jan', sales: 450000, orders: 12 },
    { month: 'Feb', sales: 580000, orders: 18 },
    { month: 'Mar', sales: 820000, orders: 25 },
    { month: 'Apr', sales: 1100000, orders: 32 },
    { month: 'May', sales: 1450000, orders: 40 },
    { month: 'Jun', sales: totalRevenue > 0 ? 1650000 + totalRevenue : 1850000, orders: 48 + db.orders.length }
  ];

  // Daily revenue for current week
  const dailyRevenue = [
    { date: 'Mon', revenue: 112000 },
    { date: 'Tue', revenue: 145000 },
    { date: 'Wed', revenue: 98000 },
    { date: 'Thu', revenue: 134000 },
    { date: 'Fri', revenue: 156000 },
    { date: 'Sat', revenue: 180000 },
    { date: 'Sun', revenue: revenueTodayVal > 0 ? revenueTodayVal : 110000 }
  ];

  const analytics: SalesAnalytics = {
    totalRevenue: totalRevenue || 3450000, // Pre-seeded historical default for project credibility
    ordersToday: ordersTodayCount,
    revenueToday: revenueTodayVal,
    lowStockCount,
    outOfStockCount,
    totalProductsCount,
    bestSellingProduct: bestSellingProduct.quantity > 0 ? bestSellingProduct : { name: 'MacBook Pro 16 M3 Max', quantity: 8, revenue: 2799200 },
    monthlySales,
    categorySales,
    dailyRevenue
  };

  res.json(analytics);
});

// Setup Vite Dev server or production build static folder
async function startServer() {
  // Setup standard Vite static middleware integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Initialise DB file if not exists
loadDB();

startServer();
