'use client';

import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type Review = {
  id: string;
  user_id: string;
  rating: number;
  body?: string;
  status: string;
  user?: { name: string };
};

export default function ProductReviews({ reviews, average }: { reviews: Review[], average: number }) {
  const total = reviews.length;
  
  // Calculate counts for each star
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating as keyof typeof counts]++;
  });

  return (
    <section id="reviews" className="mt-16 sm:mt-24 pt-10 border-t border-border scroll-mt-24">
      <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-900 mb-8">Customer Reviews</h2>
      
      {total === 0 ? (
        <div className="bg-surface-alt rounded-2xl p-8 text-center text-navy-400">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Summary / Bar Chart */}
          <div className="lg:col-span-4 bg-surface rounded-3xl border border-border p-6 shadow-sm self-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-display font-black text-navy-900">{average.toFixed(1)}</div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(average) ? 'fill-amber-400' : 'text-navy-200'} />
                  ))}
                </div>
                <div className="text-xs font-semibold text-muted tracking-wide uppercase">Based on {total} reviews</div>
              </div>
            </div>

            <div className="space-y-3">
              {[5,4,3,2,1].map((star) => {
                const count = counts[star as keyof typeof counts];
                const pct = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <div className="w-10 text-navy-600 font-medium">{star} Star</div>
                    <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <div className="w-8 text-right text-muted text-xs font-medium">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {reviews.map((r, i) => (
              <div key={r.id || i} className="bg-surface border border-border p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                      {r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                        {r.user?.name || 'Verified User'}
                        <CheckCircle size={14} className="text-green-500" />
                      </div>
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-navy-200 fill-navy-200'} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-navy-600 text-sm leading-relaxed">{r.body || 'No comment provided.'}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </section>
  );
}
