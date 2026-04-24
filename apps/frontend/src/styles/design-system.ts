// ─── Design System Tokens ───────────────────────────────────────────────────
// Single source of truth for all design decisions.
// Import from anywhere — components, pages, utilities.

export const colors = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  primary: {
    50:  '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Saffron — Indian & energetic
    600: '#EA6C0A',
    700: '#C2570A',
    800: '#9A3412',
    900: '#7C2D12',
  },
  navy: {
    900: '#0F172A', // deep navy — primary text & headings
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
  accent: {
    green:  '#22C55E', // savings / discounts
    red:    '#EF4444', // danger / remove
    yellow: '#EAB308', // ratings / stars
    violet: '#7C3AED', // premium / highlights
  },
  // ── Semantic tokens ────────────────────────────────────────────────────────
  primaryDark:'#EA6C0A',
  secondary:  '#0F172A',
  background: '#F1F5F9',
  surface:    '#FFFFFF',
  surfaceAlt: '#E2E8F0',
  foreground: '#1E293B',
  muted:      '#64748B',
  border:     '#CBD5E1',
  smoothWhite:'#F8FAFC', // Smoother than pure white for dark sections
  offWhite:   '#F1F5F9',
} as const;

export const typography = {
  fontBody:    'var(--font-instrument)',   // Instrument Sans
  fontHeading: 'var(--font-playfair)',     // Playfair Display
  colors: {
    main:    '#1E293B',
    heading: '#0F172A',
    muted:   '#64748B',
    light:   '#F8FAFC',
  },
  sizes: {
    xs:  '0.75rem',   // 12px
    sm:  '0.875rem',  // 14px
    base:'1rem',      // 16px
    lg:  '1.125rem',  // 18px
    xl:  '1.25rem',   // 20px
    '2xl':'1.5rem',   // 24px
    '3xl':'1.875rem', // 30px
    '4xl':'2.25rem',  // 36px
    '5xl':'3rem',     // 48px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const radius = {
  sm:   '0.5rem',   // 8px
  md:   '0.75rem',  // 12px
  lg:   '1rem',     // 16px
  xl:   '1.25rem',  // 20px
  '2xl':'1.5rem',   // 24px
  '3xl':'2rem',     // 32px
  full: '9999px',
} as const;

export const shadows = {
  sm:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md:   '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg:   '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  xl:   '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  glow: '0 0 30px -5px var(--shadow-color, #F97316)',
} as const;

export const transitions = {
  fast:   'all 0.15s ease',
  base:   'all 0.25s ease',
  slow:   'all 0.4s ease',
  spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ── Framer Motion Variants (reusable across pages) ──────────────────────────
export const motionVariants = {
  pageEnter: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  },
  stagger: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  },
  item: {
    hidden:  { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 , transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  },
} as const;
