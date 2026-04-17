'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Loader2, Tag, Package, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const cart = useCartStore();
  const [clearing, setClearing] = useState(false);

  // Sync cart from server on page mount
  useEffect(() => {
    cart.fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cart.isLoading && cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={36} />
        </div>
        <p className="text-slate-500 font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center animate-fade-in">
        {/* Empty State */}
        <div className="relative mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full flex items-center justify-center">
            <ShoppingCart size={80} strokeWidth={1} className="text-primary-300" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-400 font-bold text-xl">0</div>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-sm text-center leading-relaxed">
          Looks like you haven&apos;t added any products yet. Explore our collection and find something you love.
        </p>
        <Link
          href="/products"
          className="px-8 py-4 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Package size={18} />
          Explore Collection
        </Link>
      </div>
    );
  }

  const savingsPercent = cart.subtotal_paise > 0
    ? Math.round((cart.discount_paise / cart.subtotal_paise) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Shopping Cart
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your bag</p>
        </div>
        {cart.isLoading && (
          <div className="flex items-center gap-2 text-primary-500 text-sm font-medium bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full">
            <Loader2 size={14} className="animate-spin" />
            Syncing...
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* ── Left: Cart Items ── */}
        <div className="flex-1 space-y-4 w-full">
          {cart.items.map((item) => {
            const itemLoading = cart.isItemLoading(item.id);
            const saving = item.mrp_paise - item.price_paise;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-surface border border-slate-200 dark:border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 ${
                  itemLoading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {/* Loading overlay per item */}
                {itemLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-surface/50 z-10">
                    <Loader2 className="animate-spin text-primary-500" size={28} />
                  </div>
                )}

                {/* Image */}
                <Link href={`/products/${item.slug}`} className="relative w-full sm:w-32 h-32 sm:h-auto bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 block">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                  />
                  {saving > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SAVE ₹{(saving / 100).toLocaleString('en-IN')}
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.slug}`} className="font-bold text-foreground hover:text-primary-600 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">GST: {item.gst_rate}% included</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-foreground">
                        ₹{((item.price_paise * item.quantity) / 100).toLocaleString('en-IN')}
                      </div>
                      {item.mrp_paise > item.price_paise && (
                        <div className="text-xs text-slate-400 line-through">
                          ₹{((item.mrp_paise * item.quantity) / 100).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 gap-4 flex-wrap">
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                      <button
                        disabled={itemLoading || item.quantity <= 1}
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        title="Decrease Quantity"
                        className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        disabled={itemLoading || item.quantity >= item.stock}
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        title="Increase Quantity"
                        className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Stock notice */}
                    {item.stock <= 5 && (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        Only {item.stock} left!
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      disabled={itemLoading}
                      onClick={() => cart.removeItem(item.id)}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all font-medium"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Action Buttons: Clear Cart + Continue Shopping ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-border">
            {/* Clear Cart — red/rose gradient */}
            <button
              disabled={clearing || cart.isLoading}
              onClick={async () => {
                setClearing(true);
                await cart.clearCart();
                setClearing(false);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm text-white
                bg-gradient-to-r from-red-500 via-rose-500 to-pink-500
                hover:from-red-600 hover:via-rose-600 hover:to-pink-600
                shadow-lg shadow-red-400/30 hover:shadow-xl hover:shadow-red-500/40
                transition-all duration-300 transform hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {clearing
                ? <Loader2 size={16} className="animate-spin" />
                : <Trash2 size={16} />}
              Clear Cart
            </button>

            {/* Continue Shopping — indigo/violet gradient */}
            <Link href="/products" className="flex-1 sm:flex-none">
              <button className="w-full flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm text-white
                bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500
                hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600
                shadow-lg shadow-violet-400/30 hover:shadow-xl hover:shadow-violet-500/40
                transition-all duration-300 transform hover:-translate-y-0.5 group">
                <RotateCcw size={16} className="group-hover:-rotate-90 transition-transform duration-500" />
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-border rounded-3xl p-6 sm:p-7 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Tag size={18} className="text-primary-500" />
              Order Summary
            </h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Price ({cart.itemCount} items)</span>
                <span>₹{(cart.subtotal_paise / 100).toLocaleString('en-IN')}</span>
              </div>

              {cart.discount_paise > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Platform Discount {savingsPercent > 0 ? `(${savingsPercent}% off)` : ''}</span>
                  <span>−₹{(cart.discount_paise / 100).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>GST</span>
                <span>₹{(cart.gst_paise / 100).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className={cart.delivery_paise === 0 ? 'text-green-600 font-bold' : ''}>
                  {cart.delivery_paise === 0 ? 'FREE' : `₹${(cart.delivery_paise / 100).toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-border pt-3 mt-3 flex justify-between font-black text-xl">
                <span>Total</span>
                <span className="text-primary-600">₹{(cart.total_paise / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Savings banner */}
            {cart.discount_paise > 0 && (
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl px-4 py-3 mb-5 text-sm text-green-700 dark:text-green-400 font-semibold text-center">
                🎉 You&apos;re saving ₹{(cart.discount_paise / 100).toLocaleString('en-IN')} on this order!
              </div>
            )}

            {/* CTA */}
            <Link href="/checkout">
              <button
                disabled={cart.isLoading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck size={15} className="text-green-500" />
              Secure Checkout · SSL Encrypted
            </div>

            {/* Accepted payments icons */}
            <div className="mt-4 flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-border">
              {['UPI', 'Card', 'COD', 'EMI'].map(m => (
                <span key={m} className="text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
