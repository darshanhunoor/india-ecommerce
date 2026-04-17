import { setRequestLocale } from 'next-intl/server';
import { Star, ShieldCheck, Truck, Package, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductDetailActions from '@/components/ProductDetailActions';
import Link from 'next/link';
import type { Metadata } from 'next';

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) { if (res.status === 404) return null; throw new Error('Failed'); }
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'Product Not Found' };
  const name = p.name[params.locale] || p.name['en'];
  return { title: name, description: (p.description['en'] as string).slice(0, 155) };
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

  const name    = p.name[params.locale] || p.name['en'];
  const desc    = p.description[params.locale] || p.description['en'];
  const price   = (p.price_paise / 100).toLocaleString('en-IN');
  const mrp     = (p.mrp_paise / 100).toLocaleString('en-IN');
  const discount= p.discountPercentage;
  const saving  = ((p.mrp_paise - p.price_paise) / 100).toLocaleString('en-IN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8 font-medium">
        <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-navy-900 truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">

        {/* ── Image Gallery ──────────────────────────────────────────── */}
        <div className="space-y-3 animate-fade-in">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-navy-50 border border-border shadow-card">
            {p.images[0] && (
              <Image
                src={p.images[0]}
                alt={name}
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge badge-saffron text-sm px-3 py-1">
                {discount}% OFF
              </div>
            )}
            {p.stock === 0 && (
              <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                <span className="bg-navy-900 text-white px-4 py-2 rounded-full font-bold tracking-wide">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {p.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-navy-50 border border-border cursor-pointer hover:border-primary-400 transition-colors">
                  <Image src={img} alt={`${name} view ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────── */}
        <div className="flex flex-col animate-slide-up">

          {/* Brand */}
          {p.brand && (
            <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">{p.brand}</div>
          )}

          <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-900 leading-tight mb-4 text-balance">
            {name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl text-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(p.average_rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-navy-200'} />
                ))}
              </div>
              <span className="font-bold text-amber-700 text-xs">
                {p.average_rating > 0 ? p.average_rating.toFixed(1) : 'New'}
              </span>
            </div>
            <span className="text-xs text-muted">{p.reviews?.length || 0} customer reviews</span>
          </div>

          {/* Price block */}
          <div className="bg-navy-50 rounded-2xl p-5 mb-6">
            <div className="flex items-end gap-3 mb-1">
              <span className="font-black text-4xl text-navy-900">₹{price}</span>
              {p.mrp_paise > p.price_paise && (
                <span className="text-lg text-muted line-through mb-0.5">₹{mrp}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="flex items-center gap-3">
                <span className="badge badge-green text-xs">Save ₹{saving}</span>
                <span className="text-xs text-muted">Inclusive of all taxes · GST invoice included</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-navy-600 text-sm sm:text-base leading-relaxed mb-8 pb-8 border-b border-border">
            {desc}
          </div>

          {/* Stock warning */}
          {p.stock > 0 && p.stock <= 10 && (
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              Only {p.stock} left — order soon!
            </div>
          )}

          {/* CTA */}
          <ProductDetailActions product={p} />

          {/* Trust grid */}
          <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-border">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900">{label}</div>
                  <div className="text-[10px] text-muted">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
