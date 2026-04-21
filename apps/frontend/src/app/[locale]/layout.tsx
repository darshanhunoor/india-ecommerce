import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Instrument_Sans, Playfair_Display } from 'next/font/google';
import '../globals.css';
import HeaderAuth from '@/components/HeaderAuth';
import CartInitializer from '@/components/CartInitializer';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import BackToTop from '@/components/BackToTop';
import PageTransition from '@/components/PageTransition';
import MobileMenu from '@/components/MobileMenu';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

// ── Fonts ──────────────────────────────────────────────────────────────────
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'MBEcommerce — Premium Indian Fashion & Lifestyle', template: '%s | MBEcommerce' },
  description: 'Shop Men, Women & Kids fashion, electronics and home essentials. Authentic Indian brands, fast delivery pan-India.',
  keywords: ['Indian ecommerce', 'fashion', 'men women kids', 'online shopping India'],
  metadataBase: new URL('https://mbecommerce.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'MBEcommerce',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${playfairDisplay.variable}`}
      >
        <NextTopLoader color="#F97316" showSpinner={false} height={3} shadow="0 0 10px #F97316,0 0 5px #F97316" />
        <Toaster position="top-right" toastOptions={{
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))' } },
          error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))' } },
          duration: 3000,
        }} />
        <NextIntlClientProvider messages={messages}>
          <CartInitializer />
          <CartDrawer />
          <div className="min-h-screen flex flex-col">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <header className="glass sticky top-0 z-50 border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">

                {/* Mobile Menu Hamburger (Left) */}
                <div className="md:hidden flex-none w-1/3 text-left">
                  <MobileMenu />
                </div>

                {/* Logo (Centered on mobile, left on desktop) */}
                <div className="md:flex-none flex-1 flex justify-center md:justify-start">
                  <a href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-saffron">
                      <span className="text-white font-display font-black text-sm leading-none">M</span>
                    </div>
                    <span className="font-display font-bold text-xl text-navy-900 group-hover:text-primary-600 transition-colors tracking-tight hidden sm:block">
                      MBEcommerce
                    </span>
                  </a>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
                  {[
                    { href: '/products',         label: 'All' },
                    { href: '/products?cat=men',   label: 'Men' },
                    { href: '/products?cat=women', label: 'Women' },
                    { href: '/products?cat=kids',  label: 'Kids' },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="px-4 py-2 text-sm font-semibold text-navy-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Cart / Auth (Right) */}
                <div className="md:flex-none w-1/3 flex justify-end">
                  <HeaderAuth />
                </div>
              </div>
            </header>

            {/* ── Main with page transitions ──────────────────────────────── */}
            <main className="flex-grow">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="bg-navy-900 text-navy-300 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                  {/* Brand */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <a href="/" className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-saffron">
                        <span className="text-white font-display font-black">M</span>
                      </div>
                      <span className="font-display font-bold text-white text-xl group-hover:text-primary-500 transition-colors">MBEcommerce</span>
                    </a>
                    <p className="text-sm leading-relaxed text-navy-400 mb-5 max-w-xs">
                      Premium Indian fashion &amp; lifestyle — authentic brands, GST-inclusive pricing, pan-India delivery.
                    </p>
                    {/* Social */}
                    <div className="flex gap-3">
                      {[['Instagram','📸'],['Twitter','🐦'],['WhatsApp','💬']].map(([s,e]) => (
                        <div key={s} title={s} className="w-9 h-9 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-sm cursor-pointer hover:border-primary-500 hover:bg-navy-700 transition-all">{e}</div>
                      ))}
                    </div>
                  </div>

                  {/* Shop */}
                  <div>
                    <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Shop</h4>
                    <ul className="space-y-2.5 text-sm">
                      {[['Men','/products?cat=men'],['Women','/products?cat=women'],['Kids','/products?cat=kids'],['Electronics','/products?cat=electronics'],['Home & Kitchen','/products?cat=home-kitchen']].map(([l,h]) => (
                        <li key={h}><Link href={h} className="text-navy-400 hover:text-primary-400 transition-colors">{l}</Link></li>
                      ))}
                    </ul>
                  </div>

                  {/* Account */}
                  <div>
                    <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Account</h4>
                    <ul className="space-y-2.5 text-sm">
                      {[['Login','/login'],['My Orders','/orders'],['Cart','/cart'],['Checkout','/checkout']].map(([l,h]) => (
                        <li key={h}><Link href={h} className="text-navy-400 hover:text-primary-400 transition-colors">{l}</Link></li>
                      ))}
                    </ul>
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Info</h4>
                    <ul className="space-y-2.5 text-sm text-navy-400">
                      <li>GST: 07ABCDE1234F1Z5</li>
                      <li>Pan-India Delivery</li>
                      <li>24/7 Customer Support</li>
                      <li className="pt-1"><a href="mailto:hello@mbecommerce.in" className="hover:text-primary-400 transition-colors">hello@mbecommerce.in</a></li>
                    </ul>
                  </div>
                </div>

                {/* Payment methods + copyright */}
                <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-navy-600 text-center sm:text-left">
                    © {new Date().getFullYear()} MBEcommerce India Pvt. Ltd. · All rights reserved.
                  </p>
                  {/* Payment icons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-navy-600 font-medium mr-1">We accept</span>
                    {[
                      { label: 'UPI',        bg: '#6734B0', text: '#fff' },
                      { label: 'VISA',       bg: '#1A1F71', text: '#fff' },
                      { label: 'MC',         bg: '#252525', text: '#fff' },
                      { label: 'Razorpay',   bg: '#072654', text: '#3395FF' },
                      { label: 'NetBanking', bg: '#1B4F72',  text: '#fff' },
                      { label: 'COD',        bg: '#1E5631', text: '#fff' },
                    ].map(({ label, bg, text }) => (
                      <div
                        key={label}
                        className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-wide"
                        style={{ background: bg, color: text }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </footer>

            <MobileBottomNav />
            <BackToTop />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
