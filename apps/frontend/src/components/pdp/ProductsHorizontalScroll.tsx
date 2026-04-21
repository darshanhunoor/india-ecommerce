'use client';

import { useRef } from 'react';
import ProductCard from '../ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsHorizontalScroll({ title, products }: { title: string, products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 pt-10 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-900">{title}</h2>
        
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x pb-4"
        style={{ scrollPaddingLeft: '1rem' }}
      >
        {products.map(p => (
          <div key={p.id} className="min-w-[240px] sm:min-w-[280px] snap-start">
            <ProductCard product={p} locale="en" />
          </div>
        ))}
      </div>
    </section>
  );
}
