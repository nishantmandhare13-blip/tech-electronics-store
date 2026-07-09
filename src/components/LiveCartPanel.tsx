import React, { useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShieldCheck, HelpCircle, FileCheck2, Info } from 'lucide-react';
import { CartItem, Product } from '../types';
import { sound } from '../audio';

interface LiveCartPanelProps {
  cartItems: CartItem[];
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  customerProfile: { name: string; email: string; phone: string; address: string };
  isCheckingOut: boolean;
}

export default function LiveCartPanel({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  customerProfile,
  isCheckingOut
}: LiveCartPanelProps) {
  // 1. Total items count in cart
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // 2. Determine bulk discount rate based on total item quantity
  // 1–9 Items -> No Discount
  // 10–19 Items -> 10% Discount
  // 20–49 Items -> 15% Discount
  // 50+ Items -> 20% Discount
  const discountRate = useMemo(() => {
    if (totalItemsCount >= 50) return 0.20;
    if (totalItemsCount >= 20) return 0.15;
    if (totalItemsCount >= 10) return 0.10;
    return 0.00;
  }, [totalItemsCount]);

  // Next discount tier info for progress bar
  const nextDiscountTier = useMemo(() => {
    if (totalItemsCount < 10) return { itemsNeeded: 10 - totalItemsCount, nextRate: 10, currentRate: 0 };
    if (totalItemsCount < 20) return { itemsNeeded: 20 - totalItemsCount, nextRate: 15, currentRate: 10 };
    if (totalItemsCount < 50) return { itemsNeeded: 50 - totalItemsCount, nextRate: 20, currentRate: 15 };
    return null;
  }, [totalItemsCount]);

  // 3. Subtotal, Discounts, GST Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return subtotal * discountRate;
  }, [subtotal, discountRate]);

  const discountedSubtotal = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Standard electronics GST in India is 18%, inclusive in original price,
  // let's display the calculated internal GST component for transparency.
  const gstTotal = useMemo(() => {
    // price = base_price + GST = base_price + 0.18*base_price = 1.18 * base_price
    // base_price = price / 1.18
    // GST = price - base_price = price - (price / 1.18) = price * (0.18 / 1.18)
    return discountedSubtotal * (18 / 118);
  }, [discountedSubtotal]);

  const finalAmount = discountedSubtotal; // price inclusive of GST

  // Indian Rupee formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDecreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQty(item.product.id, item.quantity - 1);
      sound.playClick();
    } else {
      onRemoveItem(item.product.id);
      sound.playPop();
    }
  };

  const handleIncreaseQty = (item: CartItem) => {
    if (item.quantity < item.product.availableQuantity) {
      onUpdateQty(item.product.id, item.quantity + 1);
      sound.playClick();
    } else {
      sound.playPop();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 p-6">
      {/* Header Cart Titles */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-white">
            Live Selected Cart
          </h3>
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-sans font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            {totalItemsCount}
          </span>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={() => { onClearCart(); sound.playPop(); }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-750 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items List or Empty state */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center h-full text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-sans font-semibold text-sm text-slate-600 dark:text-slate-400">
              Your cart is empty
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
              Browse the customer panel, select from 100+ gadgets, and tap "Add to Cart" to compile your order.
            </p>
          </div>
        ) : (
          cartItems.map((item) => {
            const rowTotal = item.product.price * item.quantity;
            const maxAvailable = item.product.availableQuantity;

            return (
              <div
                key={item.product.id}
                className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-200 dark:hover:border-indigo-950 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                      {item.product.brand}
                    </span>
                    <button
                      onClick={() => { onRemoveItem(item.product.id); sound.playPop(); }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-white truncate pr-2">
                    {item.product.name}
                  </h4>

                  {/* Quantity and Prices */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 p-0.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => handleDecreaseQty(item)}
                        className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-mono font-bold text-slate-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQty(item)}
                        disabled={item.quantity >= maxAvailable}
                        className={`p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${item.quantity >= maxAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                        {formatCurrency(rowTotal)}
                      </span>
                      <span className="block text-[8px] text-slate-400 font-mono">
                        {formatCurrency(item.product.price)} each
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Totals & Bulk discount Meter */}
      {cartItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 shrink-0">
          {/* BULK DISCOUNT METER */}
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Bulk Savings Status</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 font-mono">
                {discountRate > 0 ? `${discountRate * 100}% Discount Applied` : 'Standard Price'}
              </span>
            </div>

            {/* Micro progress bar for savings */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalItemsCount / 50) * 100)}%` }}
              />
            </div>

            {/* Dynamic saving notification */}
            {nextDiscountTier ? (
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                Add <span className="font-bold text-indigo-600 dark:text-indigo-400">{nextDiscountTier.itemsNeeded} more items</span> to cart to qualify for the <span className="font-bold text-indigo-600 dark:text-indigo-400">{nextDiscountTier.nextRate}% bulk discount</span>!
              </p>
            ) : (
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-bold leading-snug">
                🎉 Maximum Bulk Discount achieved! 20% flat discount applied to your business order!
              </p>
            )}
          </div>

          {/* Pricing computation summary details */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Cart Subtotal</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatCurrency(subtotal)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Bulk Discount ({discountRate * 100}%)</span>
                <span className="font-mono">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium border-b border-dashed border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-1">
                <span>Calculated internal GST</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-850">
                  18%
                </span>
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatCurrency(gstTotal)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <div>
                <span className="text-sm font-display font-bold text-slate-800 dark:text-white">
                  Total Payable
                </span>
                <span className="block text-[9px] text-slate-400 leading-none">Inclusive of GST Taxes</span>
              </div>
              <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="pt-2">
            <button
              onClick={() => { onCheckout(); sound.playCashRegister(); }}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm tracking-wide transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-950/20 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              <span>{isCheckingOut ? 'Securing Transaction...' : 'Confirm Order Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center space-x-1.5 mt-2.5 text-[10px] text-slate-400 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Encrypted Secure Invoicing &bull; India Retail</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
