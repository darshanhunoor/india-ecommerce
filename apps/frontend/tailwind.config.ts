import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary: Saffron palette ──────────────────────────────────────────
        primary: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA6C0A',
          700: '#C2570A',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // ── Navy scale ────────────────────────────────────────────────────────
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50:  '#F8FAFC',
        },
        // ── Semantic tokens consumed by components ─────────────────────────────
        background:  'var(--bg)',
        foreground:  'var(--fg)',
        surface:     'var(--surface)',
        'surface-alt':'var(--surface-alt)',
        border:      'var(--border)',
        muted:       'var(--muted)',
        accent:      '#F97316',
      },
      fontFamily: {
        sans:    ['Arial', 'sans-serif'],
        display: ['"Times New Roman"', 'serif'],
      },
      boxShadow: {
        'glow-saffron': '0 0 30px -5px rgba(249,115,22,0.45)',
        'glow-navy':    '0 0 30px -5px rgba(15,23,42,0.35)',
        'card':         '0 2px 12px 0 rgba(15,23,42,0.07)',
        'card-hover':   '0 8px 30px 0 rgba(15,23,42,0.12)',
        'sm':           '0 1px 2px 0 rgba(15,23,42,0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.45s ease-out',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.22,1,0.36,1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.22,1,0.36,1)',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.8' },
          '50%':     { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-saffron': 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #9A3412 100%)',
        'gradient-navy':    'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
