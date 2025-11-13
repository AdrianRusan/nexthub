import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter (only if Redis is configured)
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
    analytics: true,
  });
}

const protectedRoutes = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recordings',
  '/personal-room',
  '/meeting(.*)'
]);

const publicRoutes = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/health'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');

  // CSP Header - Environment-aware for Clerk and Stream.io development domains
  const isDevelopment = process.env.NODE_ENV === 'development';

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://js.clerk.dev
      https://clerk.nexthub.com
      ${isDevelopment ? 'https://*.clerk.accounts.dev' : ''};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data:
      https://img.clerk.com
      https://images.clerk.dev
      ${isDevelopment ? 'https://*.clerk.accounts.dev' : ''};
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self'
      https://api.clerk.dev
      https://clerk.nexthub.com
      ${isDevelopment ? 'https://*.clerk.accounts.dev' : ''}
      wss://video.stream-io-api.com
      https://stream-io-api.com
      ${isDevelopment ? 'wss://*.stream-io-api.com https://*.stream-io-api.com' : ''};
    media-src 'self'
      https://stream-io-api.com
      ${isDevelopment ? 'https://*.stream-io-api.com' : ''};
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // Apply rate limiting for API routes
  if (req.nextUrl.pathname.startsWith('/api') && ratelimit) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 
               req.headers.get('x-real-ip') ?? 
               '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_middleware_${ip}`);

    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

    if (!success) {
      return new NextResponse('API rate limit exceeded', { 
        status: 429,
        headers: response.headers,
      });
    }
  }

  // Handle authentication for protected routes
  if (protectedRoutes(req) && !publicRoutes(req)) {
    const authResult = await auth();
    if (!authResult.userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};