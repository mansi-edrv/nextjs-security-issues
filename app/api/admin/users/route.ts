import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, sanitizeUsers } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Enforce authentication and admin authorization
  const auth = await authenticateAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const { principal } = auth

  // Mock user data (in production, this would come from a database)
  const allUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      password: 'SuperSecret123!', // Will be sanitized before response
      role: 'admin',
      ssn: '123-45-6789', // Will be sanitized before response
      salary: 150000, // Will be sanitized before response
      personalNotes: 'CEO of the company', // Will be sanitized before response
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'john.doe',
      email: 'john@company.com',
      password: 'Password123', // Will be sanitized before response
      role: 'user',
      ssn: '987-65-4321', // Will be sanitized before response
      salary: 75000, // Will be sanitized before response
      personalNotes: 'Regular employee, good performance', // Will be sanitized before response
      lastLogin: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      username: 'jane.smith',
      email: 'jane@company.com',
      password: 'MyPassword456', // Will be sanitized before response
      role: 'manager',
      ssn: '456-78-9012', // Will be sanitized before response
      salary: 95000, // Will be sanitized before response
      personalNotes: 'Team manager, handles sensitive projects', // Will be sanitized before response
      lastLogin: '2024-01-15T09:15:00Z'
    }
  ]

  // Sanitize user data to remove sensitive fields before returning
  const sanitizedUsers = sanitizeUsers(allUsers)

  return NextResponse.json({
    success: true,
    message: 'Admin data retrieved successfully',
    users: sanitizedUsers,
    totalUsers: sanitizedUsers.length,
    systemInfo: {
      databaseConnection: 'active',
      lastBackup: '2024-01-15T02:00:00Z',
      serverLoad: '85%',
      memoryUsage: '2.1GB',
      diskSpace: '45%'
    },
    adminActions: [
      'delete_user',
      'modify_salary',
      'change_role',
      'view_audit_logs',
      'system_shutdown'
    ],
    timestamp: new Date().toISOString(),
    executedBy: principal.id
  })
}

export async function POST(request: NextRequest) {
  // Enforce authentication and admin authorization
  const auth = await authenticateAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const { principal } = auth

  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON.' },
      { status: 400 }
    )
  }

  // Basic input validation
  const { action, targetUserId, newData } = body

  if (!action) {
    return NextResponse.json(
      { error: 'Missing required field: action' },
      { status: 400 }
    )
  }

  if (!targetUserId) {
    return NextResponse.json(
      { error: 'Missing required field: targetUserId' },
      { status: 400 }
    )
  }

  // In production, validate userId format and sanitize newData
  // For now, we'll just return a success response with audit information
  
  return NextResponse.json({
    success: true,
    message: `Admin action '${action}' executed successfully`,
    targetUserId,
    newData,
    executedBy: principal.id,
    timestamp: new Date().toISOString()
  })
}

export async function DELETE(request: NextRequest) {
  // Enforce authentication and admin authorization
  const auth = await authenticateAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const { principal } = auth

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  // Input validation
  if (!userId) {
    return NextResponse.json(
      { error: 'Missing required parameter: userId' },
      { status: 400 }
    )
  }

  // Validate userId format (basic check to prevent injection-like patterns)
  if (userId.length > 100) {
    return NextResponse.json(
      { error: 'Invalid userId: parameter too long' },
      { status: 400 }
    )
  }

  // In production:
  // - Verify user exists before deletion
  // - Implement soft delete instead of permanent deletion
  // - Add confirmation step for destructive actions
  // - Log audit trail with full details
  // - Verify user has permission to delete the target user
  
  return NextResponse.json({
    success: true,
    message: `User ${userId} deleted permanently`,
    deletedAt: new Date().toISOString(),
    executedBy: principal.id
  })
}
