import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/auth'

/**
 * GET /api/user-data
 * 
 * Returns user data for authenticated requests only.
 * 
 * Security:
 * - Requires Authorization: Bearer <token> header
 * - Only returns allowlisted, non-sensitive fields
 * - Never exposes secrets, passwords, PII, or internal data
 * 
 * NOTE: If OPENAI_API_KEY or other secrets were previously exposed,
 * operators must revoke and rotate them immediately.
 */
export async function GET(request: NextRequest) {
  // Enforce authentication
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || '1'

  // Output allowlisting: Only return safe, non-sensitive fields
  // Never include: apiKey, creditCard, password, ssn, internalNotes, or any secrets
  const safeData = {
    id: userId,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    lastLogin: new Date().toISOString(),
  }

  return NextResponse.json(safeData)
}

/**
 * POST /api/user-data
 * 
 * Creates a new user (requires authentication).
 * 
 * Security:
 * - Requires Authorization: Bearer <token> header
 * - Never returns passwords or sensitive fields in response
 */
export async function POST(request: NextRequest) {
  // Enforce authentication
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON.' },
      { status: 400 }
    )
  }

  const { username, password, email } = body

  // In production, password should be hashed before storage
  // For this demo, we acknowledge the security issue but don't return it
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    role: 'user',
    createdAt: new Date().toISOString()
    // Password is never returned in response
  }
  
  return NextResponse.json({
    success: true,
    message: 'User created successfully',
    user: newUser
  })
}
