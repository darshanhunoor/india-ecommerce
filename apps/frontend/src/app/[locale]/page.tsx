import {useTranslations} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import { ChevronRight, Zap } from 'lucide-react';

export default function HomePage({params: {locale}}: {params: {locale: string}}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 shadow-sm border border-primary-100 dark:border-primary-800">
              <Zap size={16} className="text-accent-500 animate-pulse" />
              {t('Home.flashSale')}
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              {t('Home.heroTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              {t('Home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`/${locale}/products`} className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                {t('Home.shopNow')}
                <ChevronRight className="ml-2 -mr-1" size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      </section>

      {/* Mock Categories or Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{t('Home.trending')}</h2>
          <a href={`/${locale}/products`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
            View all <ChevronRight size={16} className="ml-1"/>
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Skeleton/Placeholder Products for the MVP design */}
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card overflow-hidden group">
              <div className="h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-full border-4 border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center">
                  <span className="text-slate-300 dark:text-slate-600 font-display font-bold">Image</span>
                </div>
                <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-1">Premium Item {i}</h3>
                <p className="text-primary-600 font-bold">₹1,499</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
