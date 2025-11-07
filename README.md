# Security Test Next.js Application

⚠️ **WARNING: This application contains intentional security vulnerabilities for testing purposes only. DO NOT use in production!**

## Overview

This is a small Next.js application designed to demonstrate common security vulnerabilities for educational and testing purposes. It includes:

- **Leaked secrets** in client-side code
- **Unprotected API routes** without authentication
- **Admin endpoints** accessible to all users
- **No input validation** on API endpoints
- **Sensitive data exposure** in API responses

## Security Issues Included

### 1. Hardcoded Secrets (Client-Side)
- API keys exposed in JavaScript
- Database passwords in client code
- JWT secrets visible in browser

### 2. Unprotected API Endpoints
- `/api/user-data` - Returns user data without authentication
- `/api/admin/users` - Admin endpoint accessible to all users

### 3. Data Exposure
- Passwords returned in plain text
- SSN and credit card numbers exposed
- Internal system information leaked

### 4. No Input Validation
- SQL injection vulnerabilities (simulated)
- No sanitization of user input
- No rate limiting

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory with the following:
   ```bash
   # JWT Secret for authentication
   # Generate a strong secret (32 bytes minimum):
   #   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   # Or using openssl:
   #   openssl rand -base64 32
   JWT_SECRET=your-generated-secret-here-minimum-32-characters-long
   ```
   
   **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

3. **Generate a JWT secret:**
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   
   # Or using openssl
   openssl rand -base64 32
   ```
   
   Copy the generated secret and add it to `.env.local` as `JWT_SECRET`.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication and Admin Access

The admin endpoints (`/api/admin/*`) now require authentication with an admin role.

### Generating Admin JWT Tokens

To test admin endpoints, you need to generate a JWT token with `role: 'admin'`. You can create a simple script:

```typescript
// scripts/generate-admin-token.ts
import { signToken } from './src/server/jwt'

const token = signToken({
  sub: 'admin-user-id',
  role: 'admin',
}, '1h') // Token expires in 1 hour

console.log('Admin Token:', token)
console.log('\nUse this in your requests:')
console.log('Authorization: Bearer', token)
```

Run it with:
```bash
npx tsx scripts/generate-admin-token.ts
```

### Testing Admin Endpoints

Once you have an admin token, test the endpoints:

```bash
# Get admin token first (replace TOKEN with actual token)
TOKEN="your-admin-jwt-token-here"

# Test GET endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/users

# Test DELETE endpoint
curl -X DELETE -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/admin/users?userId=2"

# Test POST endpoint
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"update_role","targetUserId":"2","newData":{"role":"manager"}}' \
  http://localhost:3000/api/admin/users
```

**Without authentication:**
```bash
# Should return 401 Unauthorized
curl http://localhost:3000/api/admin/users
```

## Testing the Vulnerabilities

### 1. View Leaked Secrets
- Open the browser developer tools
- Check the page source or console
- Secrets are visible in the client-side JavaScript

### 2. Test Unprotected API Endpoints
- Click "Fetch User Data" button to access `/api/user-data`
- Click "Fetch Admin Data" button to access `/api/admin/users`
- Both endpoints work without authentication

### 3. Test API Directly
You can test the API endpoints directly:

```bash
# Test user data endpoint
curl http://localhost:3000/api/user-data

# Test admin endpoint
curl http://localhost:3000/api/admin/users

# Test with parameters
curl "http://localhost:3000/api/user-data?userId=2"
```

## Security Best Practices (What NOT to do)

This application demonstrates what NOT to do:

- ❌ Never expose secrets in client-side code
- ❌ Never skip authentication on sensitive endpoints
- ❌ Never return passwords in API responses
- ❌ Never expose internal system information
- ❌ Never skip input validation
- ❌ Never store passwords in plain text

## Educational Use

This application is designed for:
- Security awareness training
- Penetration testing practice
- Learning about common vulnerabilities
- Understanding OWASP Top 10 issues

## Files Structure

```
├── app/
│   ├── api/
│   │   ├── user-data/
│   │   │   └── route.ts          # Unprotected user data API
│   │   └── admin/
│   │       └── users/
│   │           └── route.ts       # Unprotected admin API
│   ├── globals.css                # Basic styling
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page with leaked secrets
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Next Steps for Security Testing

1. **Static Analysis**: Use tools like ESLint security plugins
2. **Dynamic Testing**: Use tools like OWASP ZAP or Burp Suite
3. **Code Review**: Look for the security issues mentioned above
4. **Dependency Scanning**: Check for vulnerable packages
5. **Secrets Scanning**: Use tools like GitGuardian or TruffleHog

Remember: This is for educational purposes only!
# nextjs-security-issues
