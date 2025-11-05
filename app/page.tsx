'use client'

import { useState } from 'react'

export default function Home() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // SECURITY ISSUE: No authentication required for this API call
      const response = await fetch('/api/user-data')
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      // SECURITY ISSUE: Admin endpoint without proper authorization
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Security Test Application</h1>
        <p>This app contains intentional security vulnerabilities for testing purposes</p>
      </div>

      <div className="warning">
        <strong>⚠️ WARNING:</strong> This application contains intentional security vulnerabilities. 
        Do not use in production!
      </div>

      <div className="card">
        <h2>Security Fix Applied</h2>
        <p>✅ Hardcoded secrets have been removed from client-side code.</p>
        <p>✅ JWT secrets are now loaded server-side from environment variables only.</p>
      </div>

      <div className="card">
        <h2>Unprotected API Endpoints</h2>
        <p>These endpoints can be accessed without authentication:</p>
        
        <button 
          className="button" 
          onClick={fetchUserData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch User Data (No Auth Required)'}
        </button>
        
        <button 
          className="button" 
          onClick={fetchAdminData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Admin Data (No Auth Required)'}
        </button>
      </div>

      {userData && (
        <div className="card">
          <h3>API Response:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}

      <div className="card">
        <h2>Security Issues in This App:</h2>
        <ul style={{ paddingLeft: '2rem', lineHeight: '1.6' }}>
          <li><strong>Hardcoded Secrets:</strong> API keys and passwords exposed in client-side code</li>
          <li><strong>No Authentication:</strong> API endpoints accessible without login</li>
          <li><strong>No Authorization:</strong> Admin endpoints accessible to all users</li>
          <li><strong>No Input Validation:</strong> API endpoints don't validate input</li>
          <li><strong>Information Disclosure:</strong> Sensitive data returned in API responses</li>
        </ul>
      </div>
    </div>
  )
}
