import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js middleware for protecting admin API routes.
 * Provides defense-in-depth by blocking unauthenticated requests early.
 * 
 * Note: Route-level checks in handlers are still required as the primary
 * security measure. This middleware serves as an additional layer.
 */
export function middleware(request: NextRequest) {
  // Only protect /api/admin/* routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization')

    // Block requests without Authorization header
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide an Authorization header.' },
        { status: 401 }
      )
    }

    // Validate Authorization header format
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid Authorization header format. Expected "Bearer <token>".' },
        { status: 401 }
      )
    }
  }

  // Allow the request to proceed to route handlers
  // Route handlers will perform full JWT verification and role checks
  return NextResponse.next()
}

/**
 * Configure which routes the middleware should run on.
 * Only match API routes under /api/admin
 */
export const config = {
  matcher: '/api/admin/:path*',
}

