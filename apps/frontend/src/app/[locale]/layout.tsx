import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {Inter, Outfit} from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 glass">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="font-display font-bold text-2xl text-primary-600 tracking-tight">
                  <a href={`/${locale}`}>MBEcommerce</a>
                </div>
                <div className="flex items-center gap-6">
                  <nav className="hidden md:flex gap-4">
                    <a href={`/${locale}`} className="text-sm font-medium hover:text-primary-500 transition-colors">Home</a>
                    <a href={`/${locale}/products`} className="text-sm font-medium hover:text-primary-500 transition-colors">Products</a>
                  </nav>
                  {/* Language Switcher placeholder */}
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <a href="/en" className={locale === 'en' ? 'text-primary-600' : 'text-slate-400'}>EN</a>
                    <span className="text-slate-300">|</span>
                    <a href="/hi" className={locale === 'hi' ? 'text-primary-600' : 'text-slate-400'}>HI</a>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
            
            <footer className="bg-surface border-t border-border mt-auto py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} MBEcommerce India. All rights reserved.
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
