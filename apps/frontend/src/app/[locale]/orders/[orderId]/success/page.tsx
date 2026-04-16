'use client';

import { Package, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  // We grab the orderId directly from URL mapping.
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 text-green-500 rounded-full mb-8 shadow-sm">
        <CheckCircle2 size={48} className="animate-scale-in" />
      </div>
      
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
        Thank you! Your order <span className="font-bold text-slate-900 dark:text-white">#{params.orderId.substring(0,8).toUpperCase()}</span> has been placed successfully in our matrix.
      </p>

      <div className="max-w-md mx-auto bg-surface border border-border rounded-3xl p-8 mt-10 shadow-sm text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"/>
        
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Package className="text-primary-600" size={20}/> 
          Next Steps
        </h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600"><CheckCircle2 size={18}/></div>
            <div>
              <div className="font-bold">Payment Verified</div>
              <div className="text-sm text-slate-500 mt-1">Pending allocation into Razorpay integration layer (Step 7).</div>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600"><Truck size={18} /></div>
             <div>
                <div className="font-bold">Awaiting Dispatch</div>
                <div className="text-sm text-slate-500 mt-1">Our fulfillment engine is currently indexing stock variables.</div>
             </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/orders" className="w-full py-3.5 bg-black hover:bg-slate-800 text-white text-center font-bold rounded-xl transition-colors">
            View Order Details
          </Link>
          <Link href="/products" className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-center font-bold rounded-xl transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
