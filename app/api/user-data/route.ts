import { NextRequest, NextResponse } from 'next/server'

// SECURITY ISSUE: No authentication or authorization checks
export async function GET(request: NextRequest) {
  // SECURITY ISSUE: No input validation
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || '1'
  
  // SECURITY ISSUE: Simulated database query without proper sanitization
  // In a real app, this would be vulnerable to SQL injection
  const userQuery = `SELECT * FROM users WHERE id = ${userId}`
  
  // SECURITY ISSUE: Returning sensitive user data without proper access controls
  const userData = {
    id: userId,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123!', // SECURITY ISSUE: Password in response
    role: 'admin',
    ssn: '123-45-6789', // SECURITY ISSUE: SSN exposed
    creditCard: '4111-1111-1111-1111', // SECURITY ISSUE: Credit card exposed
    apiKey: 'sk-1234567890abcdef1234567890abcdef12345678', // SECURITY ISSUE: API key exposed
    internalNotes: 'This user has access to all systems and should be monitored',
    lastLogin: new Date().toISOString(),
    ipAddress: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  }

  // SECURITY ISSUE: No rate limiting or request validation
  return NextResponse.json({
    success: true,
    data: userData,
    query: userQuery, // SECURITY ISSUE: Exposing internal query structure
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  })
}

// SECURITY ISSUE: No authentication required for POST requests
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // SECURITY ISSUE: No input validation or sanitization
  const { username, password, email } = body
  
  // SECURITY ISSUE: No password hashing or validation
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    password, // SECURITY ISSUE: Storing plain text password
    email,
    role: 'user',
    createdAt: new Date().toISOString()
  }
  
  return NextResponse.json({
    success: true,
    message: 'User created successfully',
    user: newUser
  })
}
