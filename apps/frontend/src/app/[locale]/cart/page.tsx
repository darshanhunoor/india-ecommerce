'use client';

import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const cart = useCartStore();

  if (cart.items.length === 0 && !cart.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center animate-fade-in">
        <div className="w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-8">
          <ShoppingCart size={80} strokeWidth={1} />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-md text-center">Looks like you haven&apos;t mathematically mapped any premium products to your cart yet.</p>
        <Link href="/products" className="px-8 py-4 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 hover:shadow-lg transition-all transform hover:-translate-y-1">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground flex items-center gap-3">
           Shopping Cart
           {cart.isLoading && <Loader2 className="animate-spin text-primary-500" size={24} />}
         </h1>
         <span className="text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">{cart.itemCount} Items</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Cart Items */}
        <div className="flex-1 space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="group flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-surface border border-border shadow-sm rounded-3xl hover:border-primary-200 transition-colors">
              <div className="relative w-full sm:w-36 aspect-square sm:aspect-auto sm:h-36 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                 <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">{item.name}</h3>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-primary-600">₹{(item.price_paise / 100).toLocaleString('en-IN')}</div>
                    {item.mrp_paise > item.price_paise && (
                      <div className="text-sm text-slate-400 line-through">₹{(item.mrp_paise / 100).toLocaleString('en-IN')}</div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4">
                  {/* Stepper Logic */}
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-1.5">
                    <button 
                      disabled={cart.isLoading || item.quantity <= 1}
                      onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                      title="Decrease Quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                    <button 
                      disabled={cart.isLoading || item.quantity >= item.stock}
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                      title="Increase Quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button 
                    disabled={cart.isLoading}
                    onClick={() => cart.removeItem(item.id)} 
                    className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-medium px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary UI */}
        <div className="lg:w-[420px]">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Order Breakdown</h2>
            
            <div className="space-y-4 mb-8 text-sm sm:text-base">
               <div className="flex justify-between text-slate-500 font-medium">
                 <span>Subtotal (MRP)</span>
                 <span>₹{(cart.subtotal_paise / 100).toLocaleString('en-IN')}</span>
               </div>
               
               {cart.discount_paise > 0 && (
                 <div className="flex justify-between text-green-600 font-bold bg-green-50 dark:bg-green-500/10 p-3 rounded-xl">
                   <span>Platform Discount</span>
                   <span>-₹{(cart.discount_paise / 100).toLocaleString('en-IN')}</span>
                 </div>
               )}
               
               <div className="flex justify-between text-slate-500 font-medium">
                 <span>GST Allocation</span>
                 <span>₹{(cart.gst_paise / 100).toLocaleString('en-IN')}</span>
               </div>
               
               <div className="flex justify-between text-slate-500 font-medium">
                 <span>Delivery Partner Fee</span>
                 <span className={cart.delivery_paise === 0 ? 'text-green-600 font-bold' : ''}>
                   {cart.delivery_paise === 0 ? 'FREE' : `₹${(cart.delivery_paise / 100).toLocaleString('en-IN')}`}
                 </span>
               </div>
               
               <div className="flex justify-between text-xl font-black pt-6 border-t border-slate-200 dark:border-slate-800">
                 <span>Total Appraised</span>
                 <span className="text-primary-600">₹{(cart.total_paise / 100).toLocaleString('en-IN')}</span>
               </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <button 
                disabled={cart.isLoading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Proceed Securely
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium justify-center bg-white dark:bg-surface py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <ShieldCheck size={18} className="text-green-500" />
                SSL Encrypted Server Payload
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
