import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow public access to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // All other routes require authentication
  const vercelCookie = request.cookies.get('__vercel_jwt');
  if (!vercelCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
} 