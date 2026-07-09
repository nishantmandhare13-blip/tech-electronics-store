import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, ShoppingBag, Receipt, Users, Settings, Plus, Edit3, Trash2, ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingUp, DollarSign, Package, Check, RefreshCw, X, ArrowLeft, Eye, Sparkles, Search } from 'lucide-react';
import { Product, Order, Customer, SalesAnalytics } from '../types';
import { sound } from '../audio';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onRefreshData: () => void;
  onViewInvoice: (order: Order) => void;
  isSplit?: boolean;
}

export default function AdminPanel({
  products,
  orders,
  customers,
  onRefreshData,
  onViewInvoice,
  isSplit = false
}: AdminPanelProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings'>('dashboard');

  // Analytics State
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Product CRUD states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search product filters in admin
  const [adminSearch, setAdminSearch] = useState('');

  // Forms states
  const [prodForm, setProdForm] = useState({
    name: '',
    brand: '',
    description: '',
    category: 'Laptops',
    price: 1000,
    gst: 18,
    availableQuantity: 10,
    image: '',
    rating: 4.5,
    reviewsCount: 15,
    discountRuleName: 'None',
    discountRuleDesc: 'Standard consumer rules apply'
  });

  // Fetch live metrics
  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Error fetching analytics', e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [products, orders]);

  // Indian Rupee formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // ----------------------------------------------------
  // PRODUCT MANAGEMENT CRUD ACTIONS
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    sound.playClick();
    setProdForm({
      name: '',
      brand: '',
      description: '',
      category: 'Laptops',
      price: 19999,
      gst: 18,
      availableQuantity: 25,
      image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviewsCount: 10,
      discountRuleName: 'MBA Promo',
      discountRuleDesc: 'Standard PM promotional rules apply'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    sound.playClick();
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      brand: p.brand,
      description: p.description,
      category: p.category,
      price: p.price,
      gst: p.gst,
      availableQuantity: p.availableQuantity,
      image: p.image,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      discountRuleName: p.discountRules.rule,
      discountRuleDesc: p.discountRules.description
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodForm.name,
          brand: prodForm.brand,
          description: prodForm.description,
          category: prodForm.category,
          price: Number(prodForm.price),
          gst: Number(prodForm.gst),
          availableQuantity: Number(prodForm.availableQuantity),
          image: prodForm.image,
          rating: Number(prodForm.rating),
          reviewsCount: Number(prodForm.reviewsCount),
          discountRules: {
            rule: prodForm.discountRuleName,
            description: prodForm.discountRuleDesc
          }
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        sound.playSuccess();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodForm.name,
          brand: prodForm.brand,
          description: prodForm.description,
          category: prodForm.category,
          price: Number(prodForm.price),
          gst: Number(prodForm.gst),
          availableQuantity: Number(prodForm.availableQuantity),
          image: prodForm.image,
          rating: Number(prodForm.rating),
          reviewsCount: Number(prodForm.reviewsCount),
          discountRules: {
            rule: prodForm.discountRuleName,
            description: prodForm.discountRuleDesc
          }
        })
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingProduct(null);
        sound.playSuccess();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product?')) return;
    sound.playPop();
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
        sound.playSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products list for admin list
  const filteredAdminProducts = useMemo(() => {
    if (adminSearch.trim() === '') return products;
    const term = adminSearch.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term)
    );
  }, [products, adminSearch]);

  return (
    <div className={isSplit ? "flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden" : "flex flex-col md:flex-row h-full min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950"}>
      {isSplit ? (
        /* Compact Horizontal Tab Navigation for Split View */
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 shrink-0 flex items-center justify-between gap-2 shadow-sm">
          {/* Tabs Group */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 scroll-smooth">
            {[
              { id: 'dashboard', label: 'KPIs', icon: LayoutDashboard },
              { id: 'products', label: 'Inventory', icon: ShoppingBag },
              { id: 'orders', label: 'Orders', icon: Receipt },
              { id: 'customers', label: 'Customers', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); sound.playClick(); }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-sans font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* User badge compact */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 px-2.5 py-1 rounded-full text-[9px] font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">PM Admin</span>
          </div>
        </div>
      ) : (
        /* Sidebar Navigation for Full View */
        <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 space-y-2 shrink-0">
          <div className="px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono block">Signed In As</span>
            <span className="font-display font-bold text-slate-800 dark:text-white block mt-0.5">PM Store Director</span>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold uppercase border border-indigo-100 dark:border-indigo-900">
              System Admin
            </span>
          </div>

          {[
            { id: 'dashboard', label: 'KPI Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products Inventory', icon: ShoppingBag },
            { id: 'orders', label: 'Order Registry', icon: Receipt },
            { id: 'customers', label: 'Customer Profiles', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); sound.playClick(); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-sans font-semibold text-sm transition-all cursor-pointer ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Pane */}
      <div className={isSplit ? "flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" : "flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-80px)] p-6"}>
        
        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 fade-in">
            {/* Row 1 Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-slate-800 dark:text-white">
                  MBA PM Analytics Dashboard
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Live monitoring of Indian Electronics Retail Operations under a ₹20,00,000 corporate cap.
                </p>
              </div>
              <button
                onClick={() => { fetchAnalytics(); sound.playClick(); }}
                disabled={loadingAnalytics}
                className="mt-3 md:mt-0 flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                <span>Refresh Live Metrics</span>
              </button>
            </div>

            {/* Row 2 KPI Cards */}
            {loadingAnalytics ? (
              <div className={`grid gap-4 ${isSplit ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : analytics ? (
              <div className={`grid gap-4 ${isSplit ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                {/* Revenue card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Revenue</span>
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white block mt-1.5">{formatCurrency(analytics.totalRevenue)}</span>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Target: ₹1L / day</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                {/* Orders today card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Orders Placed</span>
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white block mt-1.5">{orders.length} Orders</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Active customer checkout ledger</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>

                {/* Products Count */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Catalog Products</span>
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white block mt-1.5">{analytics.totalProductsCount} Gadgets</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">19 different categories</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                {/* Stock Warning Warnings */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inventory Health</span>
                    <span className="text-lg font-mono font-bold text-amber-500 block mt-1.5">{analytics.lowStockCount} Low &bull; {analytics.outOfStockCount} OOS</span>
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Action required in catalog</span>
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl ${analytics.lowStockCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Row 3 SVG Visual Charts Grid */}
            {analytics && (
              <div className={`grid gap-6 ${isSplit ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {/* Chart A: Daily Revenue Timeline */}
                <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 mb-4">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span>Daily Revenue Trajectory (This Week)</span>
                  </h3>
                  <div className="relative h-48 w-full flex items-end justify-between px-4 pt-4 border-b border-l border-slate-100 dark:border-slate-800">
                    {analytics.dailyRevenue.map((d, idx) => {
                      const maxVal = Math.max(...analytics.dailyRevenue.map(it => it.revenue));
                      const percent = (d.revenue / maxVal) * 80; // scale limit to 80%
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer mx-1.5">
                          {/* Tooltip on hover */}
                          <div className="absolute -top-12 bg-slate-950 text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            {formatCurrency(d.revenue)}
                          </div>
                          {/* Colored bar */}
                          <div 
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300"
                            style={{ height: `${percent || 15}px` }}
                          />
                          <span className="text-[10px] font-semibold text-slate-400 mt-2 block font-mono">{d.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart B: Sales revenue distribution by Category (Horizontal Bars) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 mb-4">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>Sales Breakdown by Category</span>
                  </h3>
                  <div className="space-y-3.5 overflow-y-auto max-h-48 custom-scrollbar pr-1">
                    {analytics.categorySales.slice(0, 5).map((c, idx) => {
                      const maxVal = Math.max(...analytics.categorySales.map(it => it.value));
                      const percent = (c.value / maxVal) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <span>{c.category}</span>
                            <span className="font-mono text-slate-800 dark:text-slate-100">{formatCurrency(c.value)}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Row 4 Additional KPIs Table Details */}
            {analytics && (
              <div className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 ${isSplit ? 'flex-col text-center p-3' : 'flex-col md:flex-row'}`}>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 animate-pulse">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Best Selling Product Product</span>
                    <span className="font-display font-bold text-slate-800 dark:text-white block text-sm mt-0.5">{analytics.bestSellingProduct.name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity Dispatched</span>
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-white block mt-0.5">{analytics.bestSellingProduct.quantity} units</span>
                  </div>
                  <div className="text-center md:text-right border-l border-slate-200 dark:border-slate-800 pl-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Accumulated Volume</span>
                    <span className="font-mono text-sm font-bold text-emerald-500 block mt-0.5">{formatCurrency(analytics.bestSellingProduct.revenue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. PRODUCTS INVENTORY TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="font-display font-bold text-2xl tracking-tight text-slate-800 dark:text-white">
                  Product Catalog Ledger
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Create, update, inspect, and unregister products inside your retail database dynamically.
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs shadow-lg shadow-indigo-500/15 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Inventory Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search inventory by serial ID, name, brand, or category..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-slate-800 dark:text-white ml-2 focus:outline-none placeholder-slate-400 py-1"
              />
            </div>

            {/* Inventory Table Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider" style={{ width: '15%' }}>Product ID</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider" style={{ width: '35%' }}>Description</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider" style={{ width: '15%' }}>Category</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right" style={{ width: '15%' }}>Price</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right" style={{ width: '10%' }}>Stock</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center" style={{ width: '10%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredAdminProducts.slice(0, 50).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">{p.id}</span>
                          <span className="block text-[9px] text-slate-400 font-medium">Brand: {p.brand}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <span className="font-sans font-bold text-xs text-slate-800 dark:text-white block truncate max-w-xs">{p.name}</span>
                              <span className="block text-[9px] text-slate-400 truncate max-w-xs">{p.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{p.category}</span>
                        </td>
                        <td className="p-4 text-right font-mono text-xs font-bold text-slate-800 dark:text-white">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-white block">{p.availableQuantity}</span>
                          <span className={`inline-block text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${p.stockStatus === 'Out Of Stock' ? 'bg-red-50 dark:bg-red-950/30 text-red-500' : p.stockStatus === 'Low Stock' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'}`}>
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                              title="Unregister Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER REGISTRY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 fade-in">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-slate-800 dark:text-white">
                Orders Registry Database
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Audited transactional order registry, reflecting customer, billing, CGST/SGST shares, and full tax invoices.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-880 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <span className="text-sm font-semibold">No checkout transactions recorded</span>
                    <p className="text-xs text-slate-400 mt-1">When customers execute orders in checkout panel, they instantly save here.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-855">
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice No.</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">CGST Shares (18%)</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net Value</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-xs font-bold text-slate-800 dark:text-white block">{o.orderNumber}</span>
                            <span className="block text-[8px] text-slate-400 font-mono">ID: {o.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-sans font-bold text-xs text-slate-800 dark:text-white block">{o.customerName}</span>
                            <span className="block text-[9px] text-slate-400 font-medium">{o.customerEmail}</span>
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                            {new Date(o.timestamp).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-right font-mono text-xs text-slate-400">
                            {formatCurrency(o.gstTotal)}
                          </td>
                          <td className="p-4 text-right font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(o.finalAmount)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => { onViewInvoice(o); sound.playClick(); }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 dark:text-indigo-400 font-sans font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS REGISTRY TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6 fade-in">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-slate-800 dark:text-white">
                Customer Registry Directory
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Profiles of registered buyers, containing contact directories and aggregated historical sales values.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer ID</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Completed Orders</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Aggregated spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                        <td className="p-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {c.id}
                        </td>
                        <td className="p-4">
                          <span className="font-sans font-bold text-xs text-slate-800 dark:text-white block">{c.name}</span>
                          <span className="block text-[9px] text-slate-400 font-medium">Email: {c.email} | Phone: {c.phone}</span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                          {c.joinedDate}
                        </td>
                        <td className="p-4 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {c.ordersCount} Orders
                        </td>
                        <td className="p-4 text-right font-mono text-xs font-bold text-emerald-500">
                          {formatCurrency(c.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                Add Product to Catalog
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Title</label>
                  <input type="text" required value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand Name</label>
                  <input type="text" required value={prodForm.brand} onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Specifications / Description</label>
                <textarea required rows={3} value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none cursor-pointer">
                    {['Laptops', 'Smartphones', 'Tablets', 'Chargers', 'Earbuds', 'Smart Watches', 'Hard Drives', 'SSD', 'RAM', 'Monitors', 'Keyboards', 'Mouse', 'Printers', 'Routers', 'Educational Software', 'Antivirus Software', 'Operating Systems', 'Networking Devices', 'Accessories'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (₹ INR)</label>
                  <input type="number" required min={1} value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Initial Stock Quantity</label>
                  <input type="number" required min={0} value={prodForm.availableQuantity} onChange={(e) => setProdForm({ ...prodForm, availableQuantity: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unsplash Product Image URL</label>
                  <input type="text" required value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rating</label>
                    <input type="number" step="0.1" min="1" max="5" value={prodForm.rating} onChange={(e) => setProdForm({ ...prodForm, rating: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reviews</label>
                    <input type="number" min="0" value={prodForm.reviewsCount} onChange={(e) => setProdForm({ ...prodForm, reviewsCount: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Custom Discount Rule</label>
                  <input type="text" required placeholder="e.g. Bulk Deal" value={prodForm.discountRuleName} onChange={(e) => setProdForm({ ...prodForm, discountRuleName: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Rule Detail Description</label>
                  <input type="text" required placeholder="e.g. 5% off on checkout" value={prodForm.discountRuleDesc} onChange={(e) => setProdForm({ ...prodForm, discountRuleDesc: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer">Register New Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                Modify Product: {editingProduct.id}
              </h3>
              <button onClick={() => { setShowEditModal(false); setEditingProduct(null); }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Title</label>
                  <input type="text" required value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand Name</label>
                  <input type="text" required value={prodForm.brand} onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Specifications / Description</label>
                <textarea required rows={3} value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none cursor-pointer">
                    {['Laptops', 'Smartphones', 'Tablets', 'Chargers', 'Earbuds', 'Smart Watches', 'Hard Drives', 'SSD', 'RAM', 'Monitors', 'Keyboards', 'Mouse', 'Printers', 'Routers', 'Educational Software', 'Antivirus Software', 'Operating Systems', 'Networking Devices', 'Accessories'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (₹ INR)</label>
                  <input type="number" required min={1} value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Adjust Available Stock</label>
                  <input type="number" required min={0} value={prodForm.availableQuantity} onChange={(e) => setProdForm({ ...prodForm, availableQuantity: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Image URL</label>
                  <input type="text" required value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rating</label>
                    <input type="number" step="0.1" min="1" max="5" value={prodForm.rating} onChange={(e) => setProdForm({ ...prodForm, rating: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reviews count</label>
                    <input type="number" min="0" value={prodForm.reviewsCount} onChange={(e) => setProdForm({ ...prodForm, reviewsCount: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Custom Discount Rule</label>
                  <input type="text" required placeholder="e.g. Bulk Deal" value={prodForm.discountRuleName} onChange={(e) => setProdForm({ ...prodForm, discountRuleName: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Rule Detail Description</label>
                  <input type="text" required placeholder="e.g. 5% off on checkout" value={prodForm.discountRuleDesc} onChange={(e) => setProdForm({ ...prodForm, discountRuleDesc: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 text-slate-800 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingProduct(null); }} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
