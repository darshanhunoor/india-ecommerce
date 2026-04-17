import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import TrustBar from '@/components/home/TrustBar';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TestimonialsStrip from '@/components/home/TestimonialsStrip';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Shop Men, Women & Kids fashion, electronics and home essentials from authentic Indian brands. GST-inclusive pricing, pan-India delivery.',
};

async function getAllProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const products = await getAllProducts();

  return (
    <div className="flex flex-col overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <CategoriesGrid />
      <FlashSaleSection products={products} />
      <FeaturedProducts products={products} locale={locale} />
      <TestimonialsStrip />
    </div>
  );
}
