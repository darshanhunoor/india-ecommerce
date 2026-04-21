'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { X, Trash2, Plus, Minus, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Simple animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 400; // ms
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutStr = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOutStr);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };
    
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>₹{(displayValue / 100).toLocaleString('en-IN')}</span>;
};

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQty, removeItem, couponCode, discountPercentage, applyCoupon, removeCoupon, totalItems, totalPrice } = useCartStore();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const saving = subtotal * (discountPercentage / 100);
  const finalPrice = subtotal - saving;

  const handleUpdateQty = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(id);
    await new Promise(r => setTimeout(r, 400)); // simulate loading spinner
    updateQty(id, newQty);
    setUpdatingId(null);
  };

  const handleApplyCoupon = () => {
    if (!couponInput) return;
    try {
      applyCoupon(couponInput);
      setCouponStatus('valid');
    } catch {
      setCouponStatus('invalid');
      setTimeout(() => setCouponStatus('idle'), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) setIsOpen(false);
            }}
            className="fixed bottom-0 md:top-0 md:bottom-auto right-0 h-[85vh] md:h-[100dvh] w-full md:max-w-md bg-surface z-[101] md:shadow-2xl flex flex-col md:border-l border-border rounded-t-3xl md:rounded-none overflow-hidden"
          >
            {/* Grabber for Mobile */}
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-12 h-1.5 bg-navy-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-alt md:bg-surface">
              <h2 className="font-display font-black text-xl text-navy-900 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary-500" />
                Your Cart <span className="text-muted text-sm font-semibold">({totalItems()})</span>
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-primary-50 text-primary-300 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy-900 mb-2">Cart is Empty</h3>
                  <p className="text-navy-400 text-sm mb-6 max-w-[200px]">Looks like you haven&apos;t added anything to your cart yet.</p>
                  <button onClick={() => setIsOpen(false)} className="btn-primary">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Items list */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          className="relative"
                        >
                          {/* Swipe to delete mechanism */}
                          <div className="absolute inset-y-0 right-0 w-20 bg-red-500 rounded-2xl flex items-center justify-end pr-5">
                            <Trash2 size={20} className="text-white" />
                          </div>
                          
                          <motion.div 
                            drag="x"
                            dragConstraints={{ left: -80, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={(e, info) => {
                              if (info.offset.x < -50) removeItem(item.id);
                            }}
                            className="relative bg-surface border border-border rounded-2xl p-3 flex gap-4 z-10 w-full"
                          >
                            <div className="w-20 h-24 relative bg-surface-alt rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            
                            <div className="flex-1 flex flex-col py-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-sm text-navy-900 line-clamp-2 pr-2">{item.name}</h4>
                                <button onClick={() => removeItem(item.id)} className="text-navy-300 hover:text-red-500 transition-colors pointer-events-auto">
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="font-black text-navy-900 text-base mb-auto">
                                ₹{(item.price / 100).toLocaleString('en-IN')}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {/* Qty selector */}
                                <div className="flex items-center bg-surface-alt rounded-lg p-0.5 border border-border pointer-events-auto">
                                  <button onClick={() => handleUpdateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-navy-600">
                                    <Minus size={14} />
                                  </button>
                                  <div className="w-8 flex items-center justify-center font-bold text-xs relative">
                                    {updatingId === item.id ? (
                                      <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      item.qty
                                    )}
                                  </div>
                                  <button onClick={() => handleUpdateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-navy-600">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Coupon section */}
                  <div className="bg-surface-alt border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Coupons & Offers</span>
                    </div>
                    {couponCode ? (
                      <div className="flex items-center justify-between bg-[#dcfce7] border border-green-200 text-green-800 px-3 py-2.5 rounded-lg text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          {couponCode} Applied!
                        </div>
                        <button onClick={removeCoupon} className="text-green-800 hover:underline text-xs">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <motion.input
                          animate={couponStatus === 'invalid' ? { x: [-5, 5, -5, 5, 0] } : {}}
                          transition={{ duration: 0.3 }}
                          type="text"
                          placeholder="Enter Promo Code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className={`flex-1 bg-surface border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${couponStatus === 'invalid' ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-border focus:border-primary-400 focus:ring-1 focus:ring-primary-500'}`}
                        />
                        <button onClick={handleApplyCoupon} className="bg-navy-900 hover:bg-navy-800 text-white px-4 text-xs font-bold rounded-lg transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                    {couponStatus === 'invalid' && <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1"><AlertCircle size={12}/> Invalid coupon</p>}
                    {couponCode && <p className="text-green-700 text-xs mt-1 font-medium">You saved ₹{(saving/100).toLocaleString('en-IN')}!</p>}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm text-navy-600 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-navy-900 font-bold"><AnimatedNumber value={subtotal} /></span>
                    </div>
                    {saving > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discountPercentage}%)</span>
                        <span className="font-bold">-<AnimatedNumber value={saving} /></span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">Free</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-surface">
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn-primary w-full shadow-glow-saffron flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold">
                  <span>Checkout</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-200 text-sm font-medium">—</span>
                    <AnimatedNumber value={finalPrice} />
                  </div>
                </Link>
                <div className="text-center mt-3 text-[10px] text-muted flex items-center justify-center gap-1">
                  100% Secure Checkout | GST Included
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
