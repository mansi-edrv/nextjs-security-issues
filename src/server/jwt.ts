import 'server-only'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from './config/env'

/**
 * Server-only JWT service for token operations.
 * Centralizes JWT signing and verification to ensure consistent security settings.
 */

export interface JwtPayload {
  sub: string
  role?: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

/**
 * Signs a JWT token with the server-side secret.
 * 
 * @param payload - The JWT payload to sign
 * @param expiresIn - Token expiration time (default: 15 minutes)
 * @returns The signed JWT token
 */
export function signToken(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  expiresIn: string = '15m'
): string {
  const secret = getJwtSecret()

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
    issuer: 'nextjs-security-app',
  })
}

/**
 * Verifies and decodes a JWT token.
 * 
 * @param token - The JWT token to verify
 * @returns The decoded payload if valid
 * @throws Error if token is invalid, expired, or signature doesn't match
 */
export function verifyToken(token: string): JwtPayload {
  const secret = getJwtSecret()

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'nextjs-security-app',
    }) as JwtPayload

    return decoded
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`JWT verification failed: ${error.message}`)
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(`JWT token expired at ${error.expiredAt}`)
    }
    throw error
  }
}

/**
 * Verifies a JWT token from an Authorization header.
 * 
 * @param authHeader - The Authorization header value (e.g., "Bearer <token>")
 * @returns The decoded payload if valid
 * @throws Error if header is missing, malformed, or token is invalid
 */
export function verifyTokenFromHeader(authHeader: string | null): JwtPayload {
  if (!authHeader) {
    throw new Error('Authorization header is required')
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with "Bearer "')
  }

  const token = authHeader.substring(7) // Remove "Bearer " prefix
  return verifyToken(token)
}

