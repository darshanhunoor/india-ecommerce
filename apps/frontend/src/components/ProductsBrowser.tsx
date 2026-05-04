'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, Filter, X, ChevronDown, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants } from '@/styles/design-system';

interface ProductsBrowserProps {
  initialData: any[];
  meta: any;
  locale: string;
}

export default function ProductsBrowser({ initialData = [], meta = { total: 0, page: 1, last_page: 1, availableBrands: [] }, locale }: ProductsBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000000 // paise
  ]);
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands') ? searchParams.get('brands')!.split(',') : []
  );
  
  const [selectedCats, setSelectedCats] = useState<string[]>(
    searchParams.get('cat') ? searchParams.get('cat')!.split(',') : []
  );

  const [minRating, setMinRating] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [minDiscount, setMinDiscount] = useState<number>(Number(searchParams.get('discount')) || 0);
  
  const currentSort = searchParams.get('sort') || 'relevance';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Sync to URL
  const applyFilters = (updates: any = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    
    const pushParam = (key: string, val: any, isDefault: boolean) => {
      if (isDefault) params.delete(key);
      else params.set(key, String(val));
    };

    pushParam('minPrice', priceRange[0], priceRange[0] <= 0);
    pushParam('maxPrice', priceRange[1], priceRange[1] >= 10000000);
    pushParam('brands', selectedBrands.join(','), selectedBrands.length === 0);
    pushParam('cat', selectedCats.join(','), selectedCats.length === 0);
    pushParam('rating', minRating, minRating === 0);
    pushParam('discount', minDiscount, minDiscount === 0);
    pushParam('sort', currentSort, currentSort === 'relevance');
    
    // Any filter update resets to page 1, unless defined in updates
    pushParam('page', updates.page || 1, (updates.page || 1) === 1);
    
    if (updates.sort) pushParam('sort', updates.sort, updates.sort === 'relevance');

    router.push(`?${params.toString()}`);
  };

  const handleBrandChange = (b: string) => {
    setSelectedBrands(prev => {
      const nw = prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b];
      return nw;
    });
  };

  const handleCatChange = (c: string) => {
    setSelectedCats(prev => {
      const nw = prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c];
      return nw;
    });
  };

  const removeFilter = (type: string, val?: string) => {
    if (type === 'brand') setSelectedBrands(prev => prev.filter(x => x !== val));
    if (type === 'cat') setSelectedCats(prev => prev.filter(x => x !== val));
    if (type === 'rating') setMinRating(0);
    if (type === 'discount') setMinDiscount(0);
    if (type === 'price') setPriceRange([0, 10000000]);
  };

  // Debounced apply for non-immediate states (like if we had a slider, but here we just have effect)
  useEffect(() => {
    // Only apply if they actually clicked something. 
    // In a real robust app, we'd trigger apply on an "Apply" button or immediately on checkbox.
    // For immediate checkboxes, we should apply via the click handler. This is a bit simpler.
  }, [selectedBrands, selectedCats, minRating, minDiscount, priceRange]);

  // Using a separate function to ensure state triggers URL update cleanly
  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => {
      const nw = prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b];
      const params = new URLSearchParams(searchParams.toString());
      if (nw.length) params.set('brands', nw.join(',')); else params.delete('brands');
      params.delete('page');
      router.push(`?${params.toString()}`);
      return nw;
    });
  }

  const toggleCat = (c: string) => {
    setSelectedCats(prev => {
      const nw = prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c];
      const params = new URLSearchParams(searchParams.toString());
      if (nw.length) params.set('cat', nw.join(',')); else params.delete('cat');
      params.delete('page');
      router.push(`?${params.toString()}`);
      return nw;
    });
  }

  const setParam = (key: string, val: string | number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) params.set(key, String(val)); else params.delete(key);
      if (key !== 'page') params.delete('page'); // reset pagination on filter
      router.push(`?${params.toString()}`);
  }

  const activeFilterCount = selectedBrands.length + selectedCats.length + (minRating ? 1 : 0) + (minDiscount ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0);

  const CATEGORIES = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Kids', value: 'kids' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Home Kitchen', value: 'home-kitchen' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 font-bold px-4 py-2 bg-surface border border-border rounded-lg">
          <Filter size={18}/> Filters {activeFilterCount > 0 && <span className="bg-primary-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">{activeFilterCount}</span>}
        </button>
        <div className="flex bg-surface-alt p-1 rounded-lg border border-border">
          <button onClick={() => setLayout('grid')} className={`p-2 rounded-md ${layout === 'grid' ? 'bg-white shadow relative z-10' : 'text-muted'}`}><LayoutGrid size={18}/></button>
          <button onClick={() => setLayout('list')} className={`p-2 rounded-md ${layout === 'list' ? 'bg-white shadow relative z-10' : 'text-muted'}`}><List size={18}/></button>
        </div>
      </div>

      {/* FILTER SIDEBAR / BOTTOM SHEET */}
      <div className={`lg:w-64 flex-shrink-0 fixed lg:static inset-0 z-50 lg:z-0 bg-black/50 lg:bg-transparent transition-all ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
        <div className={`absolute lg:static bottom-0 left-0 right-0 lg:w-full bg-surface lg:bg-transparent h-[85vh] lg:h-auto overflow-y-auto rounded-t-3xl lg:rounded-none p-6 lg:p-0 transition-transform duration-300 ${showMobileFilters ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
          
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="font-display font-bold text-2xl">Filters</h2>
            <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 bg-surface-alt rounded-full flex items-center justify-center"><X size={20}/></button>
          </div>

          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(c => (
                  <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedCats.includes(c.value) ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 bg-white group-hover:border-primary-400'}`}>
                      {selectedCats.includes(c.value) && <CheckIcon />}
                    </div>
                    <span className="text-sm font-medium text-text-main">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price (Mock Slider with dropdown for now) */}
            <div>
              <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Price Range</h3>
              <select className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-main outline-none focus:border-primary-500"
                value={priceRange[1]}
                onChange={e => {
                  const max = Number(e.target.value);
                  setPriceRange([0, max]);
                  setParam('maxPrice', max < 10000000 ? max : null);
                }}
              >
                <option value="10000000">Any Price</option>
                <option value="99900">Under ₹999</option>
                <option value="199900">Under ₹1,999</option>
                <option value="499900">Under ₹4,999</option>
              </select>
            </div>

            {/* Brands */}
            {meta.availableBrands && meta.availableBrands.length > 0 && (
              <div>
                <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {meta.availableBrands.map((b: string) => (
                    <label key={b} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedBrands.includes(b) ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 bg-white group-hover:border-primary-400'}`}>
                        {selectedBrands.includes(b) && <CheckIcon />}
                      </div>
                      <span className="text-sm font-medium text-text-main line-clamp-1">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Discount */}
            <div>
              <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Discount</h3>
              <div className="space-y-2">
                {[10, 20, 30, 50].map(pct => (
                  <label key={pct} className="flex items-center gap-3 cursor-pointer group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 bg-white group-hover:border-primary-400">
                      {minDiscount === pct && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                    </div>
                    <span className="text-sm font-medium text-text-main">{pct}% or more</span>
                    {/* Hidden input to make it accessible */}
                    <input type="radio" className="hidden" checked={minDiscount === pct} onChange={() => {
                        setMinDiscount(pct);
                        setParam('discount', pct);
                    }} />
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Customer Rating</h3>
              <div className="space-y-2">
                {[4, 3].map(rate => (
                  <label key={rate} className="flex items-center gap-3 cursor-pointer group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 bg-white group-hover:border-primary-400">
                      {minRating === rate && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                    </div>
                    <span className="text-sm font-medium text-text-main flex items-center gap-1">{rate} <Star size={12} className="fill-amber-400 text-amber-500"/> & Above</span>
                    <input type="radio" className="hidden" checked={minRating === rate} onChange={() => {
                        setMinRating(rate);
                        setParam('rating', rate);
                    }} />
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => {
              router.push('/products');
              setSelectedBrands([]); setSelectedCats([]); setMinDiscount(0); setMinRating(0); setPriceRange([0, 10000000]);
            }} className="w-full py-3 text-sm font-bold text-primary-600 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors">
              Clear All Filters
            </button>
            <div className="h-10 lg:hidden"></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-display font-black text-2xl text-text-heading">
            Showing {meta.total === 0 ? 0 : (meta.page - 1) * 20 + 1} to {Math.min(meta.page * 20, meta.total)} of {meta.total} products
          </h1>
          <div className="flex items-center gap-4 hidden lg:flex">
             <div className="flex bg-surface-alt p-1 rounded-lg border border-border">
               <button onClick={() => setLayout('grid')} className={`p-2 rounded-md ${layout === 'grid' ? 'bg-white shadow relative z-10' : 'text-muted'}`}><LayoutGrid size={18}/></button>
               <button onClick={() => setLayout('list')} className={`p-2 rounded-md ${layout === 'list' ? 'bg-white shadow relative z-10' : 'text-muted'}`}><List size={18}/></button>
             </div>
             <div className="w-px h-6 bg-border"></div>
             <select 
               value={currentSort} 
               onChange={e => setParam('sort', e.target.value)}
               className="bg-surface border border-border rounded-lg outline-none px-3 py-2 text-sm font-semibold text-text-heading focus:border-primary-500 cursor-pointer"
             >
               <option value="relevance">Relevance</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
               <option value="newest">Newest Arrivals</option>
               <option value="rating_desc">Top Rated</option>
             </select>
          </div>
          {/* Mobile Sort */}
          <div className="lg:hidden">
             <select 
               value={currentSort} 
               onChange={e => setParam('sort', e.target.value)}
               className="w-full bg-surface border border-border rounded-lg outline-none px-3 py-3 text-sm font-semibold text-text-heading focus:border-primary-500 cursor-pointer"
             >
               <option value="relevance">Sort: Relevance</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
               <option value="newest">Newest Arrivals</option>
               <option value="rating_desc">Top Rated</option>
             </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCats.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-main shadow-sm">
                Category: {CATEGORIES.find(x => x.value === c)?.label || c} <button onClick={() => toggleCat(c)} className="hover:text-red-500"><X size={12}/></button>
              </span>
            ))}
            {selectedBrands.map(b => (
              <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-main shadow-sm">
                Brand: {b} <button onClick={() => toggleBrand(b)} className="hover:text-red-500"><X size={12}/></button>
              </span>
            ))}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-main shadow-sm">
                {minRating}★ & Up <button onClick={() => {setMinRating(0); setParam('rating', null);}} className="hover:text-red-500"><X size={12}/></button>
              </span>
            )}
            {minDiscount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-main shadow-sm">
                {minDiscount}%+ Off <button onClick={() => {setMinDiscount(0); setParam('discount', null);}} className="hover:text-red-500"><X size={12}/></button>
              </span>
            )}
            {priceRange[1] < 10000000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-main shadow-sm">
                Under ₹{priceRange[1]/100} <button onClick={() => {setPriceRange([0, 10000000]); setParam('maxPrice', null);}} className="hover:text-red-500"><X size={12}/></button>
              </span>
            )}
          </div>
        )}

        {/* Product Grid / List */}
        {initialData.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-text-heading mb-2">No products found</h3>
            <p className="text-muted">Try adjusting your filters to see more results.</p>
            <button onClick={() => {
              router.push('/products');
            }} className="mt-6 px-6 py-3 bg-primary-500 text-white font-bold rounded-xl shadow-glow-saffron">Reset Filters</button>
          </div>
        ) : (
          <>
            <motion.div
              variants={motionVariants.stagger}
              initial="hidden"
              animate="visible"
              className={layout === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" : "flex flex-col gap-4 sm:gap-6"}
            >
              {initialData.map(p => (
                 <ProductCard key={p.id} product={p} locale={locale} layout={layout} />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {meta.last_page > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 bg-surface p-3 rounded-2xl border border-border w-fit mx-auto shadow-sm">
                <button 
                  disabled={meta.page <= 1}
                  onClick={() => setParam('page', meta.page - 1)}
                  className="px-4 py-2 font-semibold text-sm rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setParam('page', pageNum === 1 ? null : pageNum)}
                      className={`w-9 h-9 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${pageNum === meta.page ? 'bg-primary-500 text-white shadow-md' : 'text-text-main hover:bg-slate-100'}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={meta.page >= meta.last_page}
                  onClick={() => setParam('page', meta.page + 1)}
                  className="px-4 py-2 font-semibold text-sm rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
