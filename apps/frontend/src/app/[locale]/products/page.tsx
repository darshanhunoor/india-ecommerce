import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import ProductsBrowser from '@/components/ProductsBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Collection',
  description: 'Shop Men, Women, Kids fashion and electronics — best Indian brands with GST pricing.',
};

async function getProducts(params: Record<string, string>) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const query = new URLSearchParams(params).toString();
    const url = `${apiUrl}/api/products?${query}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { page: 1, last_page: 1, total: 0 } };
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
  searchParams: any; // Accept all unknown params
}) {
  setRequestLocale(locale);
  const { data: products, meta } = await getProducts(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl mb-10 texture-noise bg-surface-alt border border-border px-6 sm:px-10 py-10 sm:py-14">
        <div className="relative z-10">
          <span className="badge badge-saffron mb-3 shadow-sm bg-white">New Arrivals</span>
          <h1 className="font-display text-3xl sm:text-5xl font-black mb-3 text-balance leading-tight">
            <span style={{ color: 'hsl(0, 0%, 0%)' }}>Explore</span>{' '}
            <span style={{ color: 'hsl(25, 95%, 53%)' }}>Collection</span>
          </h1>
          <p className="text-navy-600 font-medium text-sm sm:text-base max-w-md">
            Authentic Indian brands · GST inclusive pricing · Pan-India delivery
          </p>
        </div>
        {/* Decorative saffron circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-6 w-20 h-20 rounded-full bg-primary-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Use the comprehensive PLP Browser component */}
      <ProductsBrowser initialData={products} meta={meta} locale={locale}  />
      
    </div>
  );
}
