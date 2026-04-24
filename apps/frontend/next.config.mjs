import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react']
  }
};

export default withNextIntl(nextConfig);
