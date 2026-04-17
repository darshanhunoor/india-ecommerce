import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import ProductsGrid from '@/components/ProductsGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Collection',
  description: 'Shop Men, Women, Kids fashion and electronics — best Indian brands with GST pricing.',
};

async function getProducts(cat?: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = cat
      ? `${apiUrl}/api/products?category=${cat}`
      : `${apiUrl}/api/products`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Men',   value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids',  value: 'kids' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Home', value: 'home-kitchen' },
];

export default async function ProductsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { cat?: string };
}) {
  setRequestLocale(locale);
  const activecat = searchParams.cat || '';
  const { data: products } = await getProducts(activecat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl mb-10 texture-noise bg-gradient-to-br from-navy-900 via-navy-800 to-[#1a0a00] px-6 sm:px-10 py-10 sm:py-14">
        <div className="relative z-10">
          <span className="badge badge-saffron mb-3">New Arrivals</span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white mb-3 text-balance leading-tight">
            Explore Collection
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-md">
            Authentic Indian brands · GST inclusive pricing · Pan-India delivery
          </p>
        </div>
        {/* Decorative saffron circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-6 w-20 h-20 rounded-full bg-primary-400/15 blur-xl pointer-events-none" />
      </div>

      {/* ── Category Filter Pills ────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {CATEGORIES.map(({ label, value }) => {
          const isActive = activecat === value;
          return (
            <Link
              key={value}
              href={value ? `/products?cat=${value}` : '/products'}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-primary-500 text-white border-primary-500 shadow-glow-saffron'
                  : 'bg-surface text-navy-600 border-border hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────────── */}
      {!products || products.length === 0 ? (
        <div className="text-center py-24 card">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-lg font-semibold text-navy-700 mb-1">No products found</p>
          <p className="text-sm text-muted">Try a different category or check back soon.</p>
        </div>
      ) : (
        <ProductsGrid products={products} locale={locale} />
      )}
    </div>
  );
}
