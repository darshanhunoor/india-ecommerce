'use client';

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, X, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useCartStore();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors"
      >
        <ShoppingCart size={24} />
        {cart.itemCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {cart.itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white dark:bg-surface h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                Shopping Cart
                {cart.isLoading && <Loader2 className="animate-spin text-primary-500" size={18} />}
              </h2>
              <button title="Close Cart" aria-label="Close Drawer" onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <ShoppingCart size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Your cart is empty</h3>
                    <p className="text-slate-500 text-sm mt-1">Looks like you haven&apos;t added anything yet.</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-2 bg-primary-50 text-primary-600 font-medium rounded-full hover:bg-primary-100 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-border">
                         <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                          <button title="Remove Item" aria-label="Remove Item" onClick={() => cart.removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="text-primary-600 font-bold text-sm mt-1">
                          ₹{(item.price_paise / 100).toLocaleString('en-IN')}
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                            <button 
                              title="Decrease Quantity"
                              disabled={cart.isLoading || item.quantity <= 1}
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-foreground disabled:opacity-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              title="Increase Quantity"
                              disabled={cart.isLoading || item.quantity >= item.stock}
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-foreground disabled:opacity-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Footer */}
            {cart.items.length > 0 && (
              <div className="p-6 bg-surface border-t border-border space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{(cart.subtotal_paise / 100).toLocaleString('en-IN')}</span>
                  </div>
                  {cart.discount_paise > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{(cart.discount_paise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST Items Total</span>
                    <span>₹{(cart.gst_paise / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span>{cart.delivery_paise === 0 ? 'FREE' : `₹${(cart.delivery_paise / 100).toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary-600">₹{(cart.total_paise / 100).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/checkout'}
                  disabled={cart.isLoading}
                  className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-colors flex justify-center items-center gap-2 group disabled:opacity-70"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
