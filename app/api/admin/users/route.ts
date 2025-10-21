import { NextRequest, NextResponse } from 'next/server'

// SECURITY ISSUE: Admin endpoint with no authentication or authorization
export async function GET(request: NextRequest) {
  // SECURITY ISSUE: No admin role verification
  // SECURITY ISSUE: No authentication token validation
  
  // SECURITY ISSUE: Exposing all users' sensitive data
  const allUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      password: 'SuperSecret123!', // SECURITY ISSUE: Plain text password
      role: 'admin',
      ssn: '123-45-6789',
      salary: 150000,
      personalNotes: 'CEO of the company',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'john.doe',
      email: 'john@company.com',
      password: 'Password123', // SECURITY ISSUE: Plain text password
      role: 'user',
      ssn: '987-65-4321',
      salary: 75000,
      personalNotes: 'Regular employee, good performance',
      lastLogin: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      username: 'jane.smith',
      email: 'jane@company.com',
      password: 'MyPassword456', // SECURITY ISSUE: Plain text password
      role: 'manager',
      ssn: '456-78-9012',
      salary: 95000,
      personalNotes: 'Team manager, handles sensitive projects',
      lastLogin: '2024-01-15T09:15:00Z'
    }
  ]

  // SECURITY ISSUE: No pagination or data filtering
  // SECURITY ISSUE: Exposing internal system information
  return NextResponse.json({
    success: true,
    message: 'Admin data retrieved successfully',
    users: allUsers,
    totalUsers: allUsers.length,
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
    timestamp: new Date().toISOString()
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
