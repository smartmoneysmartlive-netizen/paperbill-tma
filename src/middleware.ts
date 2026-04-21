import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from './lib/services/web-auth.service';

/**
 * Paperbill Auth Middleware
 * Redirects unauthenticated web users to the landing page.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Define Public Routes
  const isPublicRoute = 
    pathname.startsWith('/landing') || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname.includes('.'); // assets

  if (isPublicRoute) return NextResponse.next();

  // 2. Auth Detection
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  // More inclusive TMA detection (checking more params and headers)
  const isTMA = 
    searchParams.has('tgWebAppData') || 
    searchParams.has('tgWebAppPlatform') ||
    request.headers.get('user-agent')?.toLowerCase().includes('telegram') ||
    request.headers.get('sec-ch-ua')?.toLowerCase().includes('telegram');

  // 3. Logic for Home/App Routes
  // If no session AND it's definitely NOT a TMA -> Landing Page
  if (!sessionToken && !isTMA) {
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
