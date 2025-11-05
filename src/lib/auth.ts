import 'server-only'
import { NextRequest } from 'next/server'
import { verifyTokenFromHeader, JwtPayload } from '../server/jwt'

/**
 * Authentication and authorization utilities for protecting admin routes.
 * Server-only module to prevent client-side exposure.
 */

export interface AuthenticatedPrincipal {
  id: string
  role: string
  sub: string
}

export interface AuthResult {
  ok: true
  principal: AuthenticatedPrincipal
} | {
  ok: false
  status: 401 | 403
  body: { error: string }
}

/**
 * Authenticates a request and verifies admin role.
 * 
 * @param request - The incoming request with Authorization header
 * @returns AuthResult with ok: true and principal if authenticated and authorized, 
 *          or ok: false with status and error message if not
 */
export async function authenticateAdmin(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')

  // No credentials provided
  if (!authHeader) {
    return {
      ok: false,
      status: 401,
      body: { error: 'Authentication required. Please provide an Authorization header.' }
    }
  }

  // Verify JWT token
  let payload: JwtPayload
  try {
    payload = verifyTokenFromHeader(authHeader)
  } catch (error) {
    // Invalid or expired token
    return {
      ok: false,
      status: 401,
      body: { error: error instanceof Error ? error.message : 'Invalid authentication token.' }
    }
  }

  // Extract user ID and role from token
  const userId = payload.sub || payload.id as string || 'unknown'
  const role = payload.role as string || 'user'

  // Verify admin role
  if (role !== 'admin') {
    return {
      ok: false,
      status: 403,
      body: { error: 'Forbidden. Admin role required.' }
    }
  }

  return {
    ok: true,
    principal: {
      id: userId,
      role: 'admin',
      sub: userId
    }
  }
}

/**
 * Sensitive fields that should never be exposed in API responses.
 */
const SENSITIVE_FIELDS = [
  'password',
  'ssn',
  'salary',
  'creditCard',
  'apiKey',
  'secret',
  'privateKey',
  'token',
  'personalNotes',
  'internalNotes'
] as const

/**
 * Sanitizes a user object by removing sensitive fields.
 * 
 * @param user - User object that may contain sensitive data
 * @returns Sanitized user object with only safe fields
 */
export function sanitizeUser<T extends Record<string, unknown>>(user: T): Omit<T, typeof SENSITIVE_FIELDS[number]> {
  const sanitized = { ...user }
  
  for (const field of SENSITIVE_FIELDS) {
    delete sanitized[field]
  }
  
  return sanitized
}

/**
 * Sanitizes an array of user objects.
 * 
 * @param users - Array of user objects
 * @returns Array of sanitized user objects
 */
export function sanitizeUsers<T extends Record<string, unknown>>(users: T[]): Array<Omit<T, typeof SENSITIVE_FIELDS[number]>> {
  return users.map(user => sanitizeUser(user))
}

