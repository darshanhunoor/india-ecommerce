'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, MapPin, Truck, CreditCard, ShieldCheck, Phone, Mail, ArrowRight, Loader2, Package, RotateCcw, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

// Dummy data for UPI apps
const UPI_APPS = [
  { name: 'GPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
  { name: 'PhonePe', icon: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png' },
  { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Paytm_logo.png' }
];

const STEPS = ['Address', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const cart = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  
  // States
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [pincode, setPincode] = useState('');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto trigger pincode serviceability
  useEffect(() => {
    if (pincode.length === 6) {
      setServiceable(null);
      setTimeout(() => setServiceable(true), 600);
    } else {
      setServiceable(null);
    }
  }, [pincode]);

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    // simulate delay
    await new Promise(r => setTimeout(r, 2000));
    toast.success('Order Placed Successfully!');
    // Ideally we route to success page
    setTimeout(() => {
      cart.clearCart();
      window.location.href = '/orders';
    }, 1000);
  };

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const saving = subtotal * ((cart.discountPercentage || 0) / 100);
  const finalPrice = subtotal - saving;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <ShoppingBag size={64} className="text-navy-200 mb-6" />
        <h1 className="text-3xl font-display font-black text-navy-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-900 mb-8 sm:mb-12">Secure Checkout</h1>

        {/* ── Progress Bar ── */}
        <div className="mb-10 lg:mb-16">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            {/* Connector Line Background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0 rounded-full" />
            {/* Connector Line Animated Filled */}
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            
            {/* Step Nodes */}
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div 
                    initial={false}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isPast ? 'bg-primary-500 text-white' : isActive ? 'bg-primary-500 text-white shadow-glow-saffron' : 'bg-surface text-navy-400 border-[2px] border-border'}`}
                  >
                    {isPast ? <CheckCircle2 size={16} /> : idx + 1}
                  </motion.div>
                  <span className={`text-xs font-bold uppercase tracking-wider absolute top-10 whitespace-nowrap ${isActive || isPast ? 'text-primary-700' : 'text-muted'}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16">
          {/* Main Flow */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 animate-fade-in">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: ADDRESS */}
              {currentStep === 0 && (
                <motion.div key="step-0" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
                  <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><MapPin className="text-primary-500" /> Select Delivery Address</h2>
                  
                  {/* Existing Address Card list Mockup */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2].map((id) => (
                      <div 
                        key={id} 
                        onClick={() => setSelectedAddress(id)}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${selectedAddress === id ? 'border-primary-500 bg-primary-50/30 shadow-sm' : 'border-border bg-surface hover:border-navy-300'}`}
                      >
                        {selectedAddress === id && <span className="absolute top-3 right-3 text-primary-500"><CheckCircle2 size={22} className="fill-white" /></span>}
                        <h4 className="font-bold text-navy-900 mb-1">Rohan Sharma</h4>
                        <p className="text-sm text-navy-600 leading-relaxed mb-3">142, Orchid Pearl Apts, Indiranagar<br/>Bengaluru, Karnataka 560038</p>
                        <span className="text-xs font-semibold text-navy-500 flex flex-col gap-1">
                          <span className="flex items-center gap-1.5"><Phone size={12}/> +91 98765 43210</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-primary-600 font-bold text-sm hover:underline">+ Add New Address</button>
                  
                  <AnimatePresence>
                    {showNewAddress && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-6 bg-surface border border-border rounded-2xl space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="floating-input-group col-span-2 sm:col-span-1">
                              <input type="text" placeholder=" " id="fname" />
                              <label htmlFor="fname">First Name</label>
                            </div>
                            <div className="floating-input-group col-span-2 sm:col-span-1">
                              <input type="text" placeholder=" " id="mobile" />
                              <label htmlFor="mobile">Mobile Number</label>
                            </div>
                            <div className="floating-input-group col-span-2">
                              <input type="text" placeholder=" " id="address" />
                              <label htmlFor="address">Flat, House no., Building</label>
                            </div>
                            <div className="floating-input-group col-span-2 sm:col-span-1 relative">
                              <input type="text" placeholder=" " id="pin" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))} />
                              <label htmlFor="pin">Pincode</label>
                              {serviceable === true && <CheckCircle2 size={16} className="absolute right-4 top-4 text-green-500 animate-fade-in" />}
                            </div>
                            <div className="floating-input-group col-span-2 sm:col-span-1">
                              <input type="text" placeholder=" " id="city" defaultValue={serviceable ? 'Bengaluru' : ''} />
                              <label htmlFor="city">City</label>
                            </div>
                          </div>
                          {serviceable === false && <p className="text-xs text-red-500 font-medium">Sorry, we don&apos;t deliver to this pincode yet.</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button onClick={() => setCurrentStep(1)} className="btn-primary w-full sm:w-auto px-8">Continue to Delivery</button>
                </motion.div>
              )}

              {/* STEP 2: DELIVERY */}
              {currentStep === 1 && (
                <motion.div key="step-1" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
                  <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><Truck className="text-primary-500" /> Delivery Estimates</h2>
                  
                  <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                    {/* Timeline Tracker Graphic */}
                    <div className="flex items-center mb-8 relative px-4">
                        <div className="absolute top-1/2 left-8 right-8 h-1 bg-primary-100 -translate-y-1/2 -z-10 rounded-full"></div>
                        <div className="flex justify-between w-full">
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center outline outline-4 outline-white"><Package size={16}/></div>
                            <span className="text-[10px] font-bold text-navy-800 uppercase tracking-widest text-center">Placed</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-primary-100 text-primary-400 w-8 h-8 rounded-full flex items-center justify-center outline outline-4 outline-white border border-primary-200"><Loader2 size={16}/></div>
                            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest text-center">Processing<br/><span className="text-muted tracking-normal">Tomorrow</span></span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-surface-alt text-border w-8 h-8 rounded-full flex items-center justify-center outline outline-4 outline-white border border-border"></div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-center">Delivered<br/><span className="tracking-normal">3-5 Days</span></span>
                          </div>
                        </div>
                    </div>
                    
                    <p className="text-sm text-navy-700 bg-surface-alt p-4 rounded-xl font-medium flex items-start gap-2">
                      <Truck size={18} className="text-primary-500 flex-shrink-0" />
                      All items will be shipped together via premium courier partners. Tracking links will be provided via SMS.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(0)} className="btn-secondary">Back</button>
                    <button onClick={() => setCurrentStep(2)} className="btn-primary flex-1">Proceed to Payment</button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 2 && (
                <motion.div key="step-2" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
                  <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><CreditCard className="text-primary-500" /> Payment Method</h2>
                  
                  <div className="flex flex-col gap-3">
                    
                    {/* UPI Option */}
                    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}>
                      <label className="flex items-center gap-3 p-5 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary-500' : 'border-border'}`}>
                          {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                        </div>
                        <span className="font-bold text-navy-900">UPI (Google Pay, PhonePe, Paytm)</span>
                        <span className="ml-auto badge badge-green text-xs blur-0">Recommended</span>
                      </label>
                      
                      <AnimatePresence>
                        {paymentMethod === 'upi' && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-primary-50/30 border-t border-primary-100">
                            <div className="p-5 flex flex-wrap gap-3">
                              {UPI_APPS.map(app => (
                                <button key={app.name} onClick={() => setSelectedUpiApp(app.name)} className={`px-4 py-2 bg-white rounded-xl border flex items-center gap-2 transition-all ${selectedUpiApp === app.name ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md' : 'border-border hover:border-navy-300 shadow-sm'}`}>
                                  {app.name}
                                </button>
                              ))}
                              <div className="w-full mt-2 floating-input-group">
                                <input type="text" placeholder=" " id="vpa" className="bg-white" />
                                <label htmlFor="vpa" className="bg-transparent">Enter other UPI ID</label>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cards */}
                    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}>
                      <label className="flex items-center gap-3 p-5 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-500' : 'border-border'}`}>
                          {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                        </div>
                        <span className="font-bold text-navy-900">Credit / Debit Card</span>
                      </label>
                      <AnimatePresence>
                        {paymentMethod === 'card' && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-primary-50/30 border-t border-primary-100">
                            <div className="p-5 grid grid-cols-2 gap-4">
                              <div className="col-span-2 floating-input-group"><input type="text" placeholder=" "/><label>Card Number</label></div>
                              <div className="col-span-1 floating-input-group"><input type="text" placeholder=" "/><label>MM/YY</label></div>
                              <div className="col-span-1 floating-input-group"><input type="text" placeholder=" "/><label>CVV</label></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}>
                      <label className="flex items-center gap-3 p-5 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-500' : 'border-border'}`}>
                          {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                        </div>
                        <span className="font-bold text-navy-900">Cash on Delivery</span>
                      </label>
                    </div>

                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setCurrentStep(1)} className="btn-secondary" disabled={isProcessing}>Back</button>
                    {/* Place Order Button */}
                    <button 
                      onClick={handlePlaceOrder} 
                      disabled={isProcessing}
                      className="btn-primary flex-1 shadow-glow-saffron text-lg flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                          <Loader2 size={24} className="animate-spin text-white" />
                          <span className="text-white">Processing Securely...</span>
                        </motion.div>
                      ) : (
                        <>Place Order <ArrowRight size={18}/></>
                      )}
                    </button>
                  </div>
                  
                  {/* Trust Badges under CTA */}
                  <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-navy-400 mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><ShieldCheck size={14}/> Secure Checkout</span>
                    <span className="flex items-center gap-1"><RotateCcw size={14}/> Easy Returns</span>
                    <span className="flex items-center gap-1"><Phone size={14}/> 24/7 Support</span>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 h-fit sticky top-24">
            <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-navy-900 mb-5 pb-5 border-b border-border">Order Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2 mb-6 border-b border-border pb-6">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 relative rounded-lg bg-surface-alt overflow-hidden flex-shrink-0 border border-border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-navy-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold z-10 border border-surface">{item.qty}</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-sm font-semibold text-navy-900 line-clamp-2 leading-snug">{item.name}</div>
                      <div className="text-xs text-muted mb-1">Qty: {item.qty}</div>
                      <div className="font-bold text-navy-900">₹{((item.price * item.qty) / 100).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm font-medium text-navy-600 mb-6">
                 <div className="flex justify-between"><span>Subtotal ({cart.items.length} items)</span><span>₹{(subtotal/100).toLocaleString('en-IN')}</span></div>
                 {saving > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{(saving/100).toLocaleString('en-IN')}</span></div>}
                 <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                 <div className="flex justify-between"><span>Taxes</span><span>Included</span></div>
              </div>

              <div className="pt-5 border-t border-border flex justify-between items-center bg-primary-50 -mx-6 -mb-6 p-6 rounded-b-3xl mt-4">
                <span className="text-lg font-bold text-navy-900">Total</span>
                <span className="text-2xl font-black text-navy-900">₹{(finalPrice/100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
