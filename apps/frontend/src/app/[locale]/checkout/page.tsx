'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

import AddressStep from './components/AddressStep';
import DeliveryStep from './components/DeliveryStep';
import PaymentStep from './components/PaymentStep';

const STEPS = ['Address', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const cart = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);

  // States
  const [addresses, setAddresses] = useState<any[]>([]); // Empty for new users
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(true);
  const [pincode, setPincode] = useState('');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    api.addresses.getAll()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setAddresses(data);
          if (data.length > 0) {
            setSelectedAddress(data[0].id);
            setShowNewAddress(false);
          } else {
            setShowNewAddress(true);
          }
        }
      })
      .catch(() => setShowNewAddress(true));
  }, []);

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
    if (!selectedAddress) {
      toast.error('Please select an address');
      return setCurrentStep(0);
    }
    setIsProcessing(true);
    try {
      const pm = paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'RAZORPAY' : 'COD';
      await api.orders.create(selectedAddress, pm);

      toast.success('Order Placed Successfully!');
      setTimeout(() => {
        cart.clearCart();
        window.location.href = '/orders';
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
      setIsProcessing(false);
    }
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

              {currentStep === 0 && (
                <AddressStep
                  addresses={addresses} setAddresses={setAddresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}
                  showNewAddress={showNewAddress} setShowNewAddress={setShowNewAddress}
                  pincode={pincode} setPincode={setPincode} serviceable={serviceable}
                  onNext={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 1 && (
                <DeliveryStep
                  onBack={() => setCurrentStep(0)}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                  selectedUpiApp={selectedUpiApp} setSelectedUpiApp={setSelectedUpiApp}
                  isProcessing={isProcessing} onPlaceOrder={handlePlaceOrder} onBack={() => setCurrentStep(1)}
                />
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
                <div className="flex justify-between"><span>Subtotal ({cart.items.length} items)</span><span>₹{(subtotal / 100).toLocaleString('en-IN')}</span></div>
                {saving > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{(saving / 100).toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>Included</span></div>
              </div>

              <div className="pt-5 border-t border-border flex justify-between items-center bg-primary-50 -mx-6 -mb-6 p-6 rounded-b-3xl mt-4">
                <span className="text-lg font-bold text-navy-900">Total</span>
                <span className="text-2xl font-black text-navy-900">₹{(finalPrice / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
