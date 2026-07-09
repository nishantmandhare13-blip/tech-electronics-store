import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import CustomerPanel from './components/CustomerPanel';
import LiveCartPanel from './components/LiveCartPanel';
import AdminPanel from './components/AdminPanel';
import ConfettiEffect from './components/ConfettiEffect';
import InvoiceModal from './components/InvoiceModal';
import { Product, CartItem, Order, Customer } from './types';
import { sound } from './audio';

export default function App() {
  // Theme and UI panel layouts
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('te_dark_mode');
    return saved ? saved === 'true' : true; // Default to eye-friendly dark mode
  });
  const [currentPanel, setCurrentPanel] = useState<'store' | 'admin' | 'split'>('split');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Core synchronized database lists
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Client shopping states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('te_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);

  // Customer billing profile
  const [customerProfile, setCustomerProfile] = useState({
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '8877665544',
    address: 'Plot 42, Jubilee Hills, Hyderabad, Telangana - 500033'
  });

  // Checkout transitions and success overlay
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Sync dark class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('te_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Load backend database on mount
  const loadDatabase = async () => {
    try {
      setLoading(true);
      const [pRes, oRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/customers')
      ]);

      if (pRes.ok && oRes.ok && cRes.ok) {
        const [pData, oData, cData] = await Promise.all([
          pRes.json(),
          oRes.json(),
          cRes.json()
        ]);
        setProducts(pData);
        setOrders(oData);
        setCustomers(cData);
      }
    } catch (err) {
      console.error('Error fetching database registers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Map cart items into an easily searchable productId-quantity record
  const cartQuantities = useMemo(() => {
    const records: Record<string, number> = {};
    cartItems.forEach(item => {
      records[item.product.id] = item.quantity;
    });
    return records;
  }, [cartItems]);

  // Wishlist handler
  const handleToggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem('te_wishlist', JSON.stringify(updated));
  };

  // Cart action managers
  const handleAddToCart = (product: Product) => {
    sound.playClick();
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      
      // Calculate max allowed quantity based on actual db inventory
      const maxAvailable = product.availableQuantity;
      
      if (existing) {
        if (existing.quantity < maxAvailable) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev; // Cap at available stock
      }
      
      if (maxAvailable > 0) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleUpdateQty = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Perform secure transaction checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    sound.playClick();

    // Calculate totals
    const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discountRate = totalItemsCount >= 50 ? 0.20 : totalItemsCount >= 20 ? 0.15 : totalItemsCount >= 10 ? 0.10 : 0.00;
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * discountRate;
    const discountedSubtotal = subtotal - discountAmount;
    const gstTotal = discountedSubtotal * (18 / 118);
    const finalAmount = discountedSubtotal;

    // Prepare items list for backend database
    const items = cartItems.map(item => {
      const itemGst = (item.product.price * (1 - discountRate)) * (18 / 118) * item.quantity;
      return {
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        gstAmount: parseFloat(itemGst.toFixed(2)),
        total: item.product.price * (1 - discountRate) * item.quantity
      };
    });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerProfile.name,
          customerEmail: customerProfile.email,
          customerPhone: customerProfile.phone,
          items,
          subtotal,
          discountAmount,
          gstTotal,
          finalAmount
        })
      });

      if (res.ok) {
        const order: Order = await res.json();
        
        // Success celebration triggers
        sound.playCashRegister();
        setTimeout(() => sound.playSuccess(), 500);

        setShowCelebration(true);
        setSuccessOrder(order);
        setCartItems([]); // Reset current cart

        // Hot refresh database to sync stock and metrics immediately
        await loadDatabase();
      } else {
        const errData = await res.json();
        alert(`Checkout Transaction Failed: ${errData.error || 'Server error occurred'}`);
      }
    } catch (e) {
      alert('Secure Checkout connection error. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-all duration-300 overflow-hidden">
      
      {/* Corporate Header Nav */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentPanel={currentPanel}
        setCurrentPanel={setCurrentPanel}
        customerProfile={customerProfile}
        setCustomerProfile={setCustomerProfile}
        wishlistLength={wishlist.length}
        showWishlistOnly={showWishlistOnly}
        setShowWishlistOnly={setShowWishlistOnly}
      />

      {/* Loading Block screen */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
          <h4 className="font-display font-bold text-slate-700 dark:text-slate-300">
            Initializing Tech Electronics Registers...
          </h4>
          <p className="text-xs text-slate-400 mt-1">Pre-loading 100 enterprise products and ledger systems.</p>
        </div>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* DUAL PANEL SPLIT LAYOUT: Customer on Left (50%), Admin on Right (50%) */}
          <div className="flex-1 grid grid-cols-2 gap-0 overflow-hidden">
            {/* Left Customer Hub */}
            <div className="flex flex-col h-full overflow-hidden border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-b border-indigo-100/50 dark:border-indigo-950/45 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-sans font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 uppercase tracking-widest">
                  🛍️ Tech Electronics POS Storefront
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-bold">POS SIMULATOR</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <CustomerPanel
                  products={products}
                  onAddToCart={handleAddToCart}
                  cartQuantities={cartQuantities}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  showWishlistOnly={showWishlistOnly}
                  cartItems={cartItems}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>

            {/* Right Admin Portal */}
            <div className="flex flex-col h-full overflow-hidden bg-slate-50/20 dark:bg-slate-950/10">
              <div className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-sans font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  📊 Real-Time Admin Ledger & Inventory
                </span>
                <span className="text-[9px] font-mono text-emerald-500 font-bold animate-pulse">● SECURE SYNC ACTIVE</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <AdminPanel
                  products={products}
                  orders={orders}
                  customers={customers}
                  onRefreshData={loadDatabase}
                  onViewInvoice={(order) => setSuccessOrder(order)}
                  isSplit={true}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FIREWORKS CELEBRATION EFFECTS OVERLAY */}
      {showCelebration && (
        <ConfettiEffect onComplete={() => setShowCelebration(false)} />
      )}

      {/* TAX INVOICE RECEIPT MODAL */}
      {successOrder && (
        <InvoiceModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
          customerProfile={customerProfile}
        />
      )}
    </div>
  );
}
