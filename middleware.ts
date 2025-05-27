import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/leads',     // Form submissions
  '/api/form',      // Legacy form endpoint
  '/api/test-brevo' // Test endpoint
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TEMPORARILY DISABLED FOR FOUNDATION TESTING
  // TODO: Re-enable authentication middleware after foundation is complete
  return NextResponse.next();

  // Allow public access only to specific API routes
  if (PUBLIC_API_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // All other routes (including other API routes) require authentication
  const vercelCookie = request.cookies.get('__vercel_jwt');
  if (!vercelCookie) {
    // If it's an API route, return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // For non-API routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 