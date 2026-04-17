'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: "The quality of the kurta set is incredible! Exactly as described. Pan-India delivery within 3 days 🙌", avatar: 'P' },
  { name: 'Rahul Verma', city: 'Delhi', rating: 5, text: "Best online shopping experience in India. GST invoice included — perfect for business purchases!", avatar: 'R' },
  { name: 'Anjali Mehta', city: 'Bangalore', rating: 5, text: "Ordered for my daughter — the kids clothes are so cute and the fabric quality is amazing. Will order again!", avatar: 'A' },
  { name: 'Suresh Kumar', city: 'Chennai', rating: 4, text: "Great product range. The men's Oxford shirt fits perfectly. Return process was very smooth too.", avatar: 'S' },
  { name: 'Divya Nair', city: 'Kochi', rating: 5, text: "Loved the wrap dress — so elegant! The packaging was premium and eco-friendly. Very impressed 😍", avatar: 'D' },
  { name: 'Amit Joshi', city: 'Pune', rating: 5, text: "MBEcommerce has become my go-to for everything. Prices are fair, quality is genuine. 100% recommend!", avatar: 'A' },
  { name: 'Sneha Pillai', city: 'Hyderabad', rating: 5, text: "Quick delivery, authentic products, transparent GST billing — this is how Indian ecommerce should work!", avatar: 'S' },
  { name: 'Vikram Singh', city: 'Jaipur', rating: 4, text: "Excellent running shoes — exactly what I needed. The embroidered blazer for my wife was a great buy too.", avatar: 'V' },
];

const DOUBLE = [...TESTIMONIALS, ...TESTIMONIALS];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-navy-200'} />
      ))}
    </div>
  );
}

export default function TestimonialsStrip() {
  return (
    <section className="py-14 sm:py-20 bg-surface-alt overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <span className="badge badge-green mb-3">Customer Love</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900">
            What India is <span className="gradient-text">Saying</span>
          </h2>
        </div>
      </div>

      {/* Marquee row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#F1F5F9] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#F1F5F9] to-transparent pointer-events-none" />

        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-4 will-change-transform"
        >
          {DOUBLE.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 bg-white border border-navy-100 rounded-2xl p-5 shadow-card"
            >
              <StarRow rating={t.rating} />
              <p className="text-navy-700 text-sm leading-relaxed mt-3 mb-4 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-navy-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900">{t.name}</div>
                  <div className="text-[10px] text-muted">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
