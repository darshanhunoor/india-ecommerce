import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, RotateCcw, Phone, ArrowRight, Loader2 } from 'lucide-react';

const UPI_APPS = [
  { name: 'GPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
  { name: 'PhonePe', icon: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png' },
  { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Paytm_logo.png' }
];

export default function PaymentStep({
  paymentMethod, setPaymentMethod,
  selectedUpiApp, setSelectedUpiApp,
  isProcessing, onPlaceOrder, onBack
}: any) {
  return (
    <motion.div key="step-2" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
      <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><CreditCard className="text-primary-500" /> Payment Method</h2>
      
      <div className="flex flex-col gap-3">
        {/* UPI Option */}
        <div 
          onClick={() => setPaymentMethod('upi')}
          className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer pointer-events-auto ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}
        >
          <div className="flex items-center gap-3 p-5">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary-500' : 'border-border'}`}>
              {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </div>
            <span className="font-bold text-navy-900">UPI (Google Pay, PhonePe, Paytm)</span>
            <span className="ml-auto badge badge-green text-xs blur-0 hidden sm:inline-block">Recommended</span>
          </div>
          
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
        <div 
          onClick={() => setPaymentMethod('card')}
          className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer pointer-events-auto ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}
        >
          <div className="flex items-center gap-3 p-5">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-500' : 'border-border'}`}>
              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </div>
            <span className="font-bold text-navy-900">Credit / Debit Card</span>
          </div>
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
        
        <div 
          onClick={() => setPaymentMethod('cod')}
          className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer pointer-events-auto ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/10' : 'border-border bg-surface'}`}
        >
          <div className="flex items-center gap-3 p-5">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-500' : 'border-border'}`}>
              {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </div>
            <span className="font-bold text-navy-900">Cash on Delivery</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="btn-secondary" disabled={isProcessing}>Back</button>
        <button 
          onClick={onPlaceOrder} 
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
  );
}
