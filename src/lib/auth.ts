import 'server-only'
import { Request } from 'next/server'
import { Env } from '../config/env'

/**
 * Authentication utilities for API routes.
 * Server-only module to prevent client-side exposure.
 */

/**
 * Checks if a request is authorized using Bearer token authentication.
 * 
 * @param req - The incoming request
 * @returns true if the request has a valid Authorization bearer token
 */
export function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization') || ''
  
  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7).trim() 
    : ''
  
  // Validate token matches expected value
  // Empty token or empty expected token results in unauthorized
  if (!token || !Env.USER_DATA_API_TOKEN) {
    return false
  }
  
  // Use constant-time comparison to prevent timing attacks
  return constantTimeEquals(token, Env.USER_DATA_API_TOKEN)
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * 
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Verifies admin access using X-Admin-Token header.
 * 
 * Checks the X-Admin-Token header against ADMIN_API_TOKEN environment variable.
 * Uses timing-safe comparison to prevent timing attacks.
 * 
 * @param req - The incoming request
 * @returns true if the request has a valid admin token
 */
export function verifyAdminAccess(req: Request): boolean {
  const adminToken = req.headers.get('x-admin-token')?.trim() || ''
  const expectedToken = Env.ADMIN_API_TOKEN
  
  // Empty token or empty expected token results in unauthorized
  if (!adminToken || !expectedToken) {
    return false
  }
  
  // Use constant-time comparison to prevent timing attacks
  return constantTimeEquals(adminToken, expectedToken)
}
