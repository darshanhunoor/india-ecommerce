import { motion } from 'framer-motion';
import { Truck, Package, Loader2 } from 'lucide-react';

export default function DeliveryStep({ onBack, onNext }: any) {
  return (
    <motion.div key="step-1" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
      <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><Truck className="text-primary-500" /> Delivery Estimates</h2>
      
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
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
        <button onClick={onBack} className="btn-secondary">Back</button>
        <button onClick={onNext} className="btn-primary flex-1">Proceed to Payment</button>
      </div>
    </motion.div>
  );
}
