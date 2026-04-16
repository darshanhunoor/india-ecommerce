import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths bypass auth checks
  
  // Check auth for protected routes
  const protectedPaths = ['/checkout', '/orders'];
  const isProtectedPath = protectedPaths.some(p => pathname.includes(p));
  
  if (isProtectedPath) {
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      // Redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = `/login`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
