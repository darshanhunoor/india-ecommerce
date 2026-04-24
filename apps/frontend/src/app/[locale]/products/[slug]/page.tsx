import { setRequestLocale } from 'next-intl/server';
import { Star, ShieldCheck, Truck, Package, RotateCcw, Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 30;

import ProductGallery from '@/components/pdp/ProductGallery';
import ProductActions from '@/components/pdp/ProductActions';
import PincodeChecker from '@/components/pdp/PincodeChecker';
import ProductAccordions from '@/components/pdp/ProductAccordions';
import ProductReviews from '@/components/pdp/ProductReviews';
import ProductsHorizontalScroll from '@/components/pdp/ProductsHorizontalScroll';

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) { if (res.status === 404) return null; throw new Error('Failed'); }
    return res.json();
  } catch { return null; }
}

async function getSimilarProducts(categorySlug: string, currentId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/products?cat=${categorySlug}&limit=6`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.filter((p: any) => p.id !== currentId).slice(0, 5);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'Product Not Found' };
  const name = p.name[params.locale] || p.name['en'];
  return { title: name, description: String(p.description['en']).slice(0, 155) };
}

const TRUST = [
  { icon: Truck,       label: 'Pan-India Delivery',    sub: '3–7 business days' },
  { icon: ShieldCheck, label: '100% Authentic',        sub: 'Quality guaranteed' },
  { icon: RotateCcw,   label: '7-Day Returns',         sub: 'Hassle-free returns' },
  { icon: Package,     label: 'GST Invoice',           sub: 'Included with order' },
];

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const p = await getProduct(params.slug);
  if (!p) notFound();

  const similarProducts = await getSimilarProducts(p.category?.slug, p.id);

  const name    = p.name[params.locale] || p.name['en'];
  const desc    = p.description[params.locale] || p.description['en'];
  const price   = (p.price_paise / 100).toLocaleString('en-IN');
  const mrp     = (p.mrp_paise / 100).toLocaleString('en-IN');
  const discount= p.discountPercentage;
  const saving  = ((p.mrp_paise - p.price_paise) / 100).toLocaleString('en-IN');

  const highlights = [
    'Premium quality materials suitable for Indian climate',
    'Carefully crafted for maximum durability',
    'Perfect for both casual and formal occasions',
    'Designed directly by top Indian creators'
  ];

  const accordions = [
    { title: 'Description', content: desc },
    { title: 'Specifications', content: <ul className="list-disc pl-5 space-y-1"><li>HSN Code: {p.hsn_code || 'N/A'}</li><li>GST Rate: {p.gst_rate}%</li><li>Country of Origin: India</li></ul> },
    { title: 'Shipping Policy', content: 'Free delivery on all orders above ₹499. Orders are usually dispatched within 24 hours. Transit times vary from 3 to 7 days based on the pincode.' },
    { title: 'Return Policy', content: 'We offer a hassle-free 7-day return policy. Items must be in their original condition with tags attached. Refunds are processed to the original payment method within 3 business days of receiving the returned item.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8 font-medium">
        <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <span>/</span>
        {p.category && (
          <>
            <Link href={`/products?cat=${p.category.slug}`} className="hover:text-primary-600 transition-colors">{p.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-navy-900 truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

        {/* ── Left Side: Gallery ────────────────────────────────────── */}
        <div className="lg:col-span-6 animate-fade-in">
          {/* Sticky wrapper for gallery on desktop */}
          <div className="lg:sticky lg:top-24">
            <ProductGallery images={p.images} name={name} discount={discount} stock={p.stock} />
          </div>
        </div>

        {/* ── Right Side: Info ──────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col animate-slide-up pb-10">

          {/* Brand */}
          {p.brand && (
            <Link href={`/products?brands=${p.brand}`} className="inline-block text-xs font-black text-primary-600 uppercase tracking-widest mb-3 hover:text-primary-700 transition-colors">
              {p.brand}
            </Link>
          )}

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-navy-900 leading-[1.1] mb-5 text-balance">
            {name}
          </h1>

          {/* Rating */}
          <a href="#reviews" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer w-fit">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(p.average_rating || 0) ? 'fill-amber-400 text-amber-500' : 'text-navy-200'} />
                ))}
              </div>
              <span className="font-bold text-amber-700">
                {p.average_rating > 0 ? p.average_rating.toFixed(1) : 'New'}
              </span>
            </div>
            <span className="text-sm font-medium text-primary-600 underline underline-offset-4 decoration-primary-200">
              {p.reviews?.length || 0} Reviews
            </span>
          </a>

          {/* Price block */}
          <div className="mb-8">
            <div className="flex items-end gap-3 mb-2">
              <span className="font-black text-4xl sm:text-5xl text-navy-900">₹{price}</span>
              {p.mrp_paise > p.price_paise && (
                <span className="text-xl sm:text-2xl font-bold text-muted line-through mb-1">₹{mrp}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="badge badge-green text-sm sm:text-base px-3 py-1 bg-[#dcfce7] text-green-800 border-green-200">
                  You save ₹{saving}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-muted">Inclusive of all taxes (GST {p.gst_rate}%)</span>
              </div>
            )}
          </div>

          {/* Product Highlights */}
          <div className="mb-8 space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-navy-700 font-medium">
                <Check size={16} className="text-primary-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* CTAs / Variant Selection */}
          <div className="mb-10 pb-10 border-b border-border">
            <ProductActions product={p} />
          </div>

          {/* Pincode Checker */}
          <div className="mb-10">
            <PincodeChecker />
          </div>

          {/* Trust grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 bg-surface p-3 rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900">{label}</div>
                  <div className="text-[10px] text-muted font-medium">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <ProductAccordions items={accordions} />

        </div>
      </div>

      {/* ── Below The Fold ────────────────────────────────────────── */}
      <ProductReviews reviews={p.reviews || []} average={p.average_rating || 0} />
      
      {similarProducts.length > 0 && (
        <ProductsHorizontalScroll title="Similar Products" products={similarProducts} />
      )}
      
      {/* We can use the same component for recently viewed if we implement local state for it, skipping for now */}

    </div>
  );
}
