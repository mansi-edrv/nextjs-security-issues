import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/auth'
import { serializeUsers } from '@/lib/serializers'

/**
 * GET /api/admin/users
 * 
 * Returns a list of users for authenticated admin requests only.
 * 
 * Security:
 * - Requires X-Admin-Token header matching ADMIN_API_TOKEN environment variable
 * - Only returns allowlisted, non-sensitive fields (id, username, email, role)
 * - Never exposes passwords, SSNs, salaries, or other PII
 * 
 * Authentication:
 * - Request must include header: X-Admin-Token: <token>
 * - Token must match ADMIN_API_TOKEN from environment variables
 */
export async function GET(request: NextRequest) {
  // Enforce authentication
  if (!verifyAdminAccess(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Mock user data (in production, this would come from a database)
  // NOTE: Internal representation may contain sensitive fields, but they are
  // never exposed - only serialized safe fields are returned
  const allUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'john.doe',
      email: 'john@company.com',
      role: 'user',
      lastLogin: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      username: 'jane.smith',
      email: 'jane@company.com',
      role: 'manager',
      lastLogin: '2024-01-15T09:15:00Z'
    }
  ]

  // Serialize users to include only allowed, non-sensitive fields
  // This ensures passwords, SSNs, salaries, and other PII are never exposed
  const safeUsers = serializeUsers(allUsers)

  return NextResponse.json({
    users: safeUsers,
    totalUsers: safeUsers.length
  })
}

// SECURITY ISSUE: Admin actions without proper authorization
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // SECURITY ISSUE: No input validation
  const { action, targetUserId, newData } = body
  
  // SECURITY ISSUE: No audit logging
  // SECURITY ISSUE: No confirmation required for destructive actions
  
  return NextResponse.json({
    success: true,
    message: `Admin action '${action}' executed successfully`,
    targetUserId,
    newData,
    executedBy: 'anonymous', // SECURITY ISSUE: No user tracking
    timestamp: new Date().toISOString()
  })
}

// SECURITY ISSUE: DELETE endpoint without proper safeguards
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  // SECURITY ISSUE: No confirmation required
  // SECURITY ISSUE: No soft delete option
  // SECURITY ISSUE: No audit trail
  
  return NextResponse.json({
    success: true,
    message: `User ${userId} deleted permanently`,
    deletedAt: new Date().toISOString(),
    executedBy: 'anonymous'
  })
}