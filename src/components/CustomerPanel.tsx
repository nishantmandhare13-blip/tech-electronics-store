import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, ChevronRight, Heart, Star, CheckCircle, AlertTriangle, XCircle, BellRing, ArrowUpDown, RefreshCcw, ShoppingCart, Minus, Plus, Trash2, Clock } from 'lucide-react';
import { Product, CartItem } from '../types';
import { sound } from '../audio';

interface CustomerPanelProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  cartQuantities: Record<string, number>; // Maps productId to quantity added in cart
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  showWishlistOnly: boolean;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CustomerPanel({
  products,
  onAddToCart,
  cartQuantities,
  wishlist,
  onToggleWishlist,
  showWishlistOnly,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout
}: CustomerPanelProps) {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState(350000); // Max product price
  const [stockFilter, setStockFilter] = useState('All'); // 'All' | 'InStock' | 'OutOfStock'
  const [sortOption, setSortOption] = useState('newest'); // 'newest' | 'priceAsc' | 'priceDesc' | 'rating'
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [notifiedProducts, setNotifiedProducts] = useState<Record<string, boolean>>({});

  // Reset filters
  const resetFilters = () => {
    sound.playPop();
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange(350000);
    setStockFilter('All');
    setSortOption('newest');
  };

  // Get categories and brands dynamically
  const categories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => list.add(p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  const brands = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => list.add(p.brand));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Handle out of stock "Notify Me"
  const handleNotifyMe = (productId: string, name: string) => {
    sound.playSuccess();
    setNotifiedProducts(prev => ({ ...prev, [productId]: true }));
    // Beautiful alert using native banner instead of window.alert
  };

  // Compute remaining stock for a product based on current cart quantities
  const getRemainingStock = (product: Product) => {
    const addedQty = cartQuantities[product.id] || 0;
    return Math.max(0, product.availableQuantity - addedQty);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Price
    result = result.filter(p => p.price <= priceRange);

    // Stock
    if (stockFilter === 'InStock') {
      result = result.filter(p => getRemainingStock(p) > 0);
    } else if (stockFilter === 'OutOfStock') {
      result = result.filter(p => getRemainingStock(p) === 0);
    }

    // Wishlist Only filter
    if (showWishlistOnly) {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // Sort
    result = [...result];
    if (sortOption === 'newest') {
      // Latest/newest sorting
      result.sort((a, b) => (b.latest ? 1 : 0) - (a.latest ? 1 : 0));
    } else if (sortOption === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, stockFilter, sortOption, wishlist, showWishlistOnly, cartQuantities]);

  // Featured and Today's Special Offers for slider highlights
  const sliderOffers = useMemo(() => {
    return products.filter(p => p.todayOffer || p.featured).slice(0, 5);
  }, [products]);

  // Indian Rupee formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 p-4 lg:p-6">
      {/* Banner / Interactive Slider Header */}
      {!showWishlistOnly && (
        <div className="mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-800 text-white p-6 shadow-lg border border-indigo-500/10 fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div className="mb-4 md:mb-0">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/20 text-[10px] font-mono tracking-widest uppercase mb-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Today's Mega Saving Offers</span>
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-white">
                Premium Electronics, Ultimate Pricing
              </h2>
              <p className="text-sm text-indigo-200 mt-1 max-w-xl">
                Get up to <span className="font-bold text-amber-400 text-lg">20% off</span> on Bulk Business Procurement (10+ items). All prices are GST inclusive with nationwide priority logistics!
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm self-start md:self-auto text-center">
              <span className="block text-[10px] text-slate-300 font-mono tracking-wider uppercase">Project Budget Cap</span>
              <span className="text-xl font-mono font-bold text-emerald-400">₹20,00,000</span>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME DYNAMIC TOP CART TRACKER */}
      <div className="mb-4 bg-gradient-to-r from-violet-50/60 to-pink-50/60 dark:from-violet-950/20 dark:to-pink-950/20 rounded-2xl p-4 shadow-sm border border-violet-100 dark:border-violet-900/50 fade-in">
        <div className="flex items-center justify-between mb-3 border-b border-violet-100/50 dark:border-violet-900/40 pb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              Live Selected Cart
            </h3>
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={() => { onClearCart(); sound.playPop(); }}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-widest cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="py-2.5 text-center text-xs text-slate-400 dark:text-slate-500 italic">
            🛒 Your cart is empty. Click "Add to Cart" below to instantly track it here!
          </div>
        ) : (
          <div className="space-y-3">
            {/* Horizontal scroll of items in cart */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {cartItems.map(item => {
                const remainingInDB = Math.max(0, item.product.availableQuantity - item.quantity);
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2 rounded-xl shrink-0 min-w-[280px] shadow-sm relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">Stock Remaining: {remainingInDB}</p>
                    </div>
                    {/* Quantity Adjustment inside Cart */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQty(item.product.id, item.quantity - 1);
                            sound.playPop();
                          } else {
                            onRemoveItem(item.product.id);
                            sound.playPop();
                          }
                        }}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-sans w-3 text-center">{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (item.quantity < item.product.availableQuantity) {
                            onUpdateQty(item.product.id, item.quantity + 1);
                            sound.playClick();
                          } else {
                            sound.playPop();
                          }
                        }}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart checkout totals & progress toward discount tier */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex justify-between items-baseline text-xs text-slate-600 dark:text-slate-300">
                  <span>Subtotal: <strong className="font-mono text-slate-800 dark:text-white">{formatCurrency(cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0))}</strong></span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0) >= 50 
                      ? '🔥 20% Bulk Discount Applied!' 
                      : cartItems.reduce((sum, item) => sum + item.quantity, 0) >= 20 
                      ? '🔥 15% Bulk Discount Applied!' 
                      : cartItems.reduce((sum, item) => sum + item.quantity, 0) >= 10 
                      ? '🔥 10% Bulk Discount Applied!' 
                      : 'Add 10+ items for 10% off!'}
                  </span>
                </div>
                {/* Visual offer tracking progress bar */}
                <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (cartItems.reduce((sum, item) => sum + item.quantity, 0) / 10) * 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Action Button to Checkout */}
              <button
                onClick={onCheckout}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 uppercase transition-all shadow-md shadow-emerald-100 dark:shadow-none cursor-pointer"
              >
                <span>Confirm Order & Checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 flex flex-col gap-3.5 fade-in">
        {/* Search, Sort, Categories Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search laptops, smart watches, chargers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-100 dark:bg-slate-950 rounded-full border-none focus:ring-2 focus:ring-indigo-450 text-sm text-slate-800 dark:text-white transition-all"
            />
          </div>

          <div className="relative md:col-span-3">
            <div className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value); sound.playClick(); }}
                className="w-full bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="newest">Featured & Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Rating: Highest First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 md:col-span-3">
            <button
              onClick={resetFilters}
              className="flex items-center justify-center space-x-1 px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs transition-all w-full border border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Detailed Filters Expandable (Always open for beautiful desktop view) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Chips Scroller */}
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Categories</span>
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); sound.playClick(); }}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0 cursor-pointer ${selectedCategory === cat ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-rose-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Brand Selection
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); sound.playClick(); }}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Max Budget Slider
              </label>
              <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 font-bold">
                {formatCurrency(priceRange)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={350000}
              step={1000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Stock Availability
            </label>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
              {['All', 'InStock', 'OutOfStock'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setStockFilter(opt); sound.playClick(); }}
                  className={`py-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all uppercase cursor-pointer ${stockFilter === opt ? 'bg-white dark:bg-slate-850 text-rose-500 dark:text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  {opt === 'InStock' ? 'In Stock' : opt === 'OutOfStock' ? 'OOS' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Summary Counter */}
          <div className="flex items-center justify-end md:col-span-1 pr-1 text-right">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-white">{filteredProducts.length}</span>
              <span className="block mt-0.5">Products Matched</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS DYNAMIC GRID AREA */}
      <div className="mt-2 pr-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center py-20">
            <AlertTriangle className="w-12 h-12 text-slate-300 animate-bounce mb-3" />
            <h4 className="font-display font-semibold text-lg text-slate-700 dark:text-slate-300">
              No matching products found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              We couldn't locate any electronics that meet your customized filtering criteria. Click "Reset Filters" above to explore the entire catalog!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
            {filteredProducts.map((p) => {
              const remainingStock = getRemainingStock(p);
              const isOOS = remainingStock === 0;
              const isLowStock = remainingStock > 0 && remainingStock <= 5;
              const isWishlisted = wishlist.includes(p.id);

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredProductId(p.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                  className={`group relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isOOS 
                      ? 'border-red-200 dark:border-red-950/80 shadow-sm opacity-60 bg-slate-50 dark:bg-slate-950 grayscale' 
                      : (p.featured || p.todayOffer)
                      ? 'border-2 border-rose-400 dark:border-rose-600 shadow-xl scale-[1.01] bg-rose-50/10 dark:bg-rose-950/10 hover:-translate-y-1'
                      : 'border-slate-100 dark:border-slate-850 hover:border-rose-450 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 dark:hover:shadow-rose-950/30 hover:-translate-y-1'
                  }`}
                >
                  {/* Heart / Wishlist Trigger */}
                  <button
                    onClick={() => { onToggleWishlist(p.id); sound.playPop(); }}
                    className={`absolute top-5 right-5 z-20 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                      isWishlisted 
                        ? 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 shadow-md scale-110' 
                        : 'bg-white/75 dark:bg-slate-950/60 text-slate-400 hover:text-red-500 backdrop-blur-md'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Top product badges */}
                  <div className="absolute top-5 left-5 z-10 flex flex-col space-y-1.5">
                    {p.featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                        ★ Premium
                      </span>
                    )}
                    {p.todayOffer && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider shadow animate-pulse">
                        -15% OFF
                      </span>
                    )}
                    {p.latest && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-500 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                        New Launch
                      </span>
                    )}
                  </div>

                  {/* Card Image Container with scale-110 zoom */}
                  <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl m-4 mb-3 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand & Category */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">{p.brand}</span>
                        <span>{p.category}</span>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-white leading-tight line-clamp-2 h-10 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                        {p.name}
                      </h3>

                      {/* Rating stars & Reviews */}
                      <div className="flex items-center space-x-1.5 mt-1">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold font-sans ml-1 text-slate-700 dark:text-slate-300">{p.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({p.reviewsCount} reviews)</span>
                      </div>

                      {/* Bulk Offer Badge */}
                      <div className="mt-2 px-2 py-1 bg-rose-50/60 dark:bg-rose-950/20 rounded-lg border border-rose-100/50 dark:border-rose-900/35 text-[10px] font-bold flex items-center justify-between">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">📦 Bulk Buy Offer:</span>
                        <span className="text-rose-700 dark:text-rose-300 font-extrabold">10+ pcs = 10% OFF</span>
                      </div>
                    </div>

                    {/* Stock Status details */}
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        {/* Indian Rupee Price */}
                        <div className="flex items-baseline space-x-1">
                          <span className="text-base font-sans font-black text-rose-600 dark:text-rose-400">
                            {formatCurrency(p.price)}
                          </span>
                        </div>
                        <span className="block text-[9px] text-slate-400 font-mono leading-none">GST @{p.gst}% Included</span>
                      </div>

                      {/* Stock Indicator Pills */}
                      <div className="text-right">
                        {isOOS ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/35 px-2 py-1 rounded-lg">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/35 px-2 py-1 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Only {remainingStock} Left</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/35 px-2 py-1 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{remainingStock} In Stock</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Actions Footer */}
                  <div className="px-4 pb-4 pt-1">
                    {isOOS ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-sans font-semibold text-xs cursor-not-allowed border border-slate-200/40 dark:border-slate-800"
                      >
                        SOLD OUT
                      </button>
                    ) : (
                      <button
                        onClick={() => { onAddToCart(p); sound.playClick(); }}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold text-xs transition-all shadow-md shadow-emerald-100 hover:shadow-emerald-200 dark:shadow-none cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>

                  {/* HOVER ANIMATED DETAILED POPUP OVERLAY */}
                  {hoveredProductId === p.id && (
                    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md text-white p-5 flex flex-col justify-between z-30 transition-all duration-300 animate-[fadeIn_0.25s_ease-out]">
                      {/* Popup Header info */}
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                            Product Specs
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                        </div>
                        
                        <h4 className="font-display font-bold text-sm text-white mt-1 leading-snug">
                          {p.name}
                        </h4>
                        
                        <p className="text-[11px] text-slate-300 mt-2 line-clamp-4 font-sans leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-3.5 p-2 bg-white/5 rounded-xl border border-white/10 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Discount Rule:</span>
                            <span className="font-bold text-amber-400">{p.discountRules.rule}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 leading-tight">
                            {p.discountRules.description}
                          </p>
                        </div>
                      </div>

                      {/* Popup Stock Indicators with Actions */}
                      <div className="border-t border-white/10 pt-3.5">
                        {remainingStock > 0 ? (
                          <div>
                            <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold mb-1">
                              <CheckCircle className="w-4 h-4 fill-emerald-500/20" />
                              <span>😊 In Stock ({remainingStock} units available)</span>
                            </div>
                            <div className="text-[10px] text-slate-300 flex items-center justify-between font-mono">
                              <span>Ready for Dispatch:</span>
                              <span className="text-emerald-400 font-bold">Instant</span>
                            </div>
                            <div className="text-[10px] text-slate-300 flex items-center justify-between font-mono">
                              <span>Expected Delivery:</span>
                              <span className="text-indigo-300 font-bold">2-4 Days</span>
                            </div>

                            {/* Direct ADD TO CART button inside hover overlay */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(p);
                                sound.playClick();
                              }}
                              className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1 uppercase transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-1 text-red-400 text-xs font-bold mb-1">
                              <XCircle className="w-4 h-4 fill-red-500/20" />
                              <span>☹ Out of Stock</span>
                            </div>
                            <p className="text-[9px] text-slate-400 mb-2">
                              No inventory remaining in Bengaluru & Gurgaon fulfillment hubs. Register to get alert notifications!
                            </p>
                            
                            {notifiedProducts[p.id] ? (
                              <button
                                disabled
                                className="w-full py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Notify Registered!</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleNotifyMe(p.id, p.name)}
                                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer shadow"
                              >
                                <BellRing className="w-3.5 h-3.5" />
                                <span>Notify Me When In Stock</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
