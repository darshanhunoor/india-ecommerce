'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { MapPin, Truck, CreditCard, ChevronRight, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CheckoutStep = 'ADDRESS' | 'DELIVERY' | 'PAYMENT';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const cart = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('ADDRESS');
  
  // States mapping Address Module
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: user?.name || '', mobile: user?.mobile || '', flat: '', street: '', city: '', state: '', pin_code: '' });
  
  // Deliverability Mapping
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  
  // Payment Mapping
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        const def = data.find((a: any) => a.is_default);
        if (def) setSelectedAddressId(def.id);
        else if (data.length > 0) setSelectedAddressId(data[0].id);
      }
    } catch (e) {}
  };

  const handlePinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setNewAddr({ ...newAddr, pin_code: pin });
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === 'Success') {
          setNewAddr(prev => ({
            ...prev,
            city: data[0].PostOffice[0].District,
            state: data[0].PostOffice[0].State
          }));
        }
      } catch (err) { /* ignore */ }
    }
  };

  const saveAddress = async () => {
    if (newAddr.pin_code.length !== 6) return setErrorText('Pincode must be 6 digits');
    if (!newAddr.flat || !newAddr.street || !newAddr.city || !newAddr.state) return setErrorText('Fill all fields');
    setErrorText('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr)
      });
      if (res.ok) {
        await fetchAddresses();
        setShowAddForm(false);
      } else { throw new Error('Could not save address'); }
    } catch (err: any) { setErrorText(err.message); }
  };

  const proceedToDelivery = async () => {
    if (!selectedAddressId) return setErrorText('Please select an address');
    const selected = addresses.find(a => a.id === selectedAddressId);
    if (!selected) return;

    setErrorText('');
    setIsProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/delivery/check?pin=${selected.pin_code}`, {credentials:'include'});
      if (!res.ok) throw new Error('Failed to verify pin code natively');
      const data = await res.json();
      setDeliveryInfo(data);
      setStep('DELIVERY');
    } catch (e: any) { setErrorText(e.message) }
    finally { setIsProcessing(false) }
  };

  const placeOrder = async () => {
    setIsProcessing(true);
    setErrorText('');
    try {
      const pMethod = paymentMethod === 'COD' ? 'COD' : 'RAZORPAY';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: selectedAddressId, paymentMethod: pMethod })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      if (pMethod === 'RAZORPAY' && data.razorpay_order_id) {
        if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

        // Check if it's the mock order
        if (data.razorpay_order_id.startsWith('mock_order_')) {
          cart.clearCart();
          window.location.href = `/orders/${data.order_id}/success`;
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay Key Id
          amount: data.total_paise,
          currency: 'INR',
          name: 'MBEcommerce',
          description: 'Order Payment',
          order_id: data.razorpay_order_id,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/payments/verify`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: data.order_id,
                })
              });
              if (!verifyRes.ok) throw new Error('Payment verification failed');
              
              cart.clearCart();
              window.location.href = `/orders/${data.order_id}/success`;
            } catch (verr: any) {
              setErrorText(verr.message);
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name,
            contact: user?.mobile,
          },
          theme: { color: '#F97316' },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setErrorText(response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // COD logic
        cart.clearCart();
        window.location.href = `/orders/${data.order_id}/success`;
      }
    } catch (e: any) {
      setErrorText(e.message);
      setIsProcessing(false);
    }
  };

  if(!user) return <div className="p-8 text-center"><Loader2 className="animate-spin inline"/></div>

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Three Step Progress */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
         <div className={`flex flex-col items-center gap-2 ${step === 'ADDRESS' ? 'text-primary-600' : 'text-slate-400'}`}>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step==='ADDRESS'||step==='DELIVERY'||step==='PAYMENT'?'bg-primary-600 text-white':'bg-slate-100 dark:bg-surface text-slate-400'}`}><MapPin size={18}/></div>
           <span className="text-sm font-medium">Address</span>
         </div>
         <div className="flex-1 h-1 bg-slate-100 dark:bg-surface mx-4 relative overflow-hidden">
           <div className={`absolute inset-y-0 left-0 bg-primary-600 transition-all duration-500 ${step === 'DELIVERY' || step === 'PAYMENT' ? 'w-full' : 'w-0'}`}/>
         </div>
         <div className={`flex flex-col items-center gap-2 ${step === 'DELIVERY' || step === 'PAYMENT' ? 'text-primary-600' : 'text-slate-400'}`}>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step==='DELIVERY'||step==='PAYMENT'?'bg-primary-600 text-white':'bg-slate-100 dark:bg-surface text-slate-400'}`}><Truck size={18}/></div>
           <span className="text-sm font-medium">Delivery</span>
         </div>
         <div className="flex-1 h-1 bg-slate-100 dark:bg-surface mx-4 relative overflow-hidden">
           <div className={`absolute inset-y-0 left-0 bg-primary-600 transition-all duration-500 ${step === 'PAYMENT' ? 'w-full' : 'w-0'}`}/>
         </div>
         <div className={`flex flex-col items-center gap-2 ${step === 'PAYMENT' ? 'text-primary-600' : 'text-slate-400'}`}>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step==='PAYMENT'?'bg-primary-600 text-white':'bg-slate-100 dark:bg-surface text-slate-400'}`}><CreditCard size={18}/></div>
           <span className="text-sm font-medium">Payment</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {errorText && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{errorText}</div>}

          {/* STEP 1 */}
          {step === 'ADDRESS' && (
             <div className="space-y-6 animate-fade-in">
               <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Select Shipping Address</h2>
               {addresses.length > 0 && !showAddForm ? (
                 <div className="grid gap-4">
                   {addresses.map(addr => (
                     <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${selectedAddressId === addr.id ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'border-border bg-surface hover:border-primary-200'}`}>
                       <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary-600' : 'border-slate-300'}`}>
                         {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"/>}
                       </div>
                       <div>
                         <div className="font-bold text-foreground">
                           {addr.label || user.name}
                           {addr.is_default && <span className="ml-2 text-[10px] uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Default</span>}
                         </div>
                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">{addr.flat}, {addr.street}, {addr.city}, {addr.state} - <span className="font-semibold text-slate-700 dark:text-slate-300">{addr.pin_code}</span></p>
                       </div>
                     </div>
                   ))}
                   <button onClick={() => setShowAddForm(true)} className="text-primary-600 font-semibold p-4 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 transition-colors">
                     + Add New Address
                   </button>
                   <button onClick={proceedToDelivery} disabled={isProcessing} className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg mt-4 disabled:opacity-50">
                     {isProcessing ? <Loader2 className="animate-spin inline" /> : 'Deliver Here'}
                   </button>
                 </div>
               ) : (
                 <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm animate-slide-up">
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-semibold text-slate-500 uppercase">Pincode</label><input title="Pincode" placeholder="6-digit PIN" type="text" maxLength={6} value={newAddr.pin_code} onChange={handlePinCodeChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-4 py-3 mt-1" /></div>
                     <div><label className="text-xs font-semibold text-slate-500 uppercase">City</label><input title="City" placeholder="City" type="text" readOnly value={newAddr.city} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 mt-1 text-slate-500" /></div>
                   </div>
                   <div><label className="text-xs font-semibold text-slate-500 uppercase">Flat / House No.</label><input title="Flat Number" placeholder="Flat, Suite, House no." type="text" value={newAddr.flat} onChange={e => setNewAddr({...newAddr, flat: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-4 py-3 mt-1" /></div>
                   <div><label className="text-xs font-semibold text-slate-500 uppercase">Street / Landmark</label><input title="Street Name" placeholder="Area, Street, Sector, Village" type="text" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-4 py-3 mt-1" /></div>
                   <div className="flex gap-4 pt-4">
                     <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-slate-600 font-medium bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                     <button onClick={saveAddress} className="flex-1 py-3 text-white font-medium bg-black rounded-xl hover:bg-slate-800 transition-colors">Save Address</button>
                   </div>
                 </div>
               )}
             </div>
          )}

          {/* STEP 2 */}
          {step === 'DELIVERY' && deliveryInfo && (
            <div className="space-y-6 animate-fade-in">
               <button onClick={() => setStep('ADDRESS')} className="text-sm font-semibold text-slate-500 hover:text-foreground">← Back to Address</button>
               <h2 className="text-xl font-bold text-foreground">Delivery Matrix</h2>
               {deliveryInfo.is_serviceable ? (
                 <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                   <div className="flex items-center gap-3 text-green-600 font-bold text-lg">
                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><Check size={20}/></div>
                     Serviceable
                   </div>
                   <p className="text-slate-500 mt-2">Delivery expected in ~<span className="font-bold text-slate-700 dark:text-slate-300">{deliveryInfo.estimated_days} days</span> safely by Shiprocket couriers.</p>
                   {!deliveryInfo.cod_available && (
                      <p className="text-amber-600 text-sm mt-3 font-medium bg-amber-50 p-3 rounded-lg">Cash on Delivery (COD) is temporarily disabled by couriers for this pincode mapping.</p>
                   )}
                   <button onClick={() => setStep('PAYMENT')} className="w-full py-4 mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg">
                     Continue to Payment
                   </button>
                 </div>
               ) : (
                 <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                   <h3 className="text-red-600 font-bold">Unserviceable Pincode</h3>
                   <p className="text-red-500/80 text-sm mt-1">Our courier partners currently cannot reach the previously selected address mapping.</p>
                 </div>
               )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 'PAYMENT' && (
            <div className="space-y-6 animate-fade-in">
              <button onClick={() => setStep('DELIVERY')} className="text-sm font-semibold text-slate-500 hover:text-foreground">← Back to Delivery</button>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Payment Gateway</h2>
              <div className="grid gap-3">
                <div onClick={() => setPaymentMethod('UPI')} className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer ${paymentMethod==='UPI'?'border-primary-600 bg-primary-50/50':'border-border bg-surface'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-primary-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'UPI' && <div className="w-2 h-2 bg-primary-600 rounded-full"/>}
                  </div>
                  <span className="font-bold">UPI / QR (Instant)</span>
                </div>
                <div onClick={() => setPaymentMethod('CARD')} className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer ${paymentMethod==='CARD'?'border-primary-600 bg-primary-50/50':'border-border bg-surface'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-primary-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'CARD' && <div className="w-2 h-2 bg-primary-600 rounded-full"/>}
                  </div>
                  <span className="font-bold">Credit / Debit Card</span>
                </div>
                {deliveryInfo?.cod_available && (
                   <div onClick={() => setPaymentMethod('COD')} className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer ${paymentMethod==='COD'?'border-primary-600 bg-primary-50/50':'border-border bg-surface'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 bg-primary-600 rounded-full"/>}
                    </div>
                    <span className="font-bold">Cash on Delivery</span>
                  </div>
                )}
              </div>
              <button onClick={placeOrder} disabled={isProcessing} className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-xl mt-4 disabled:opacity-50">
                {isProcessing ? <Loader2 className="animate-spin inline" /> : 'Place Order Securely'}
              </button>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-[400px]">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Breakdown</h3>
            <div className="space-y-4 mb-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-white rounded-lg border border-border relative overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover"/>
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold line-clamp-2">{item.name}</div>
                    <div className="text-primary-600 font-bold mt-1 text-sm">₹{(item.price_paise/100).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3 text-sm">
               <div className="flex justify-between text-slate-500"><span>Subtotal (MRP)</span><span>₹{(cart.subtotal_paise/100).toLocaleString('en-IN')}</span></div>
               {cart.discount_paise > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount Mapping</span><span>-₹{(cart.discount_paise/100).toLocaleString('en-IN')}</span></div>}
               <div className="flex justify-between text-slate-500"><span>GST Excl. Deduction</span><span>₹{(cart.gst_paise/100).toLocaleString('en-IN')}</span></div>
               <div className="flex justify-between text-slate-500"><span>Secure Delivery</span><span>{cart.delivery_paise===0?'FREE':`₹${(cart.delivery_paise/100).toLocaleString()}`}</span></div>
               <div className="flex justify-between text-lg font-bold pt-4 border-t border-slate-200 dark:border-slate-800">
                 <span>Grand Total</span>
                 <span className="text-primary-600">₹{(cart.total_paise/100).toLocaleString('en-IN')}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
