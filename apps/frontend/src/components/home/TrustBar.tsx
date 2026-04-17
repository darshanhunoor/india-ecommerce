'use client';

import { motion } from 'framer-motion';
import { Truck, RefreshCw, Receipt, ShieldCheck, Star, Headphones, Package } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Truck,        label: 'Free Delivery',      sub: 'Above ₹499' },
  { icon: RefreshCw,   label: '7-Day Returns',       sub: 'No questions asked' },
  { icon: Receipt,     label: 'GST Invoice',         sub: 'Included in every order' },
  { icon: ShieldCheck, label: '100% Secure',         sub: 'SSL encrypted payments' },
  { icon: Star,        label: '5★ Rated',            sub: 'By 10,000+ customers' },
  { icon: Headphones,  label: '24/7 Support',        sub: 'WhatsApp & email' },
  { icon: Package,     label: 'Pan-India Delivery',  sub: 'All 28 states + UTs' },
];

// Duplicate for infinite marquee
const ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS];

export default function TrustBar() {
  return (
    <div className="bg-navy-900 border-y border-navy-800 py-4 overflow-hidden">
      <motion.div
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-0 whitespace-nowrap will-change-transform"
      >
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 px-8 flex-shrink-0 border-r border-navy-700 last:border-r-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <item.icon size={16} className="text-primary-400" />
            </div>
            <div>
              <div className="text-navy-50 text-xs font-bold leading-none">{item.label}</div>
              <div className="text-navy-400 text-[10px] mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
