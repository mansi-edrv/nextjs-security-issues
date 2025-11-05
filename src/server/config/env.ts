import 'server-only'

/**
 * Server-only environment configuration module.
 * This module ensures secrets are never exposed to client-side code.
 */

const COMPROMISED_SECRET = 'my-super-secret-jwt-key-2024'
const MIN_SECRET_LENGTH = 32 // Minimum 32 bytes (256 bits) for strong security

/**
 * Gets and validates the JWT secret from environment variables.
 * 
 * @returns The JWT secret as a string
 * @throws Error if the secret is missing, too short, or matches the compromised value
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required but not set. ' +
      'Please set JWT_SECRET in your .env.local file. ' +
      'Generate a strong secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64url\'))"'
    )
  }

  // Check if the secret matches the known compromised value
  if (secret === COMPROMISED_SECRET) {
    throw new Error(
      'JWT_SECRET matches the known compromised secret. ' +
      'Please generate a new secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64url\'))"'
    )
  }

  // Validate minimum length (32 bytes = 256 bits for strong security)
  // For base64url encoding, 32 bytes = 43 characters
  // For hex encoding, 32 bytes = 64 characters
  // We'll accept at least 32 characters to be flexible with encoding
  const secretLength = Buffer.from(secret, 'utf8').length
  if (secretLength < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET is too short (${secretLength} bytes). ` +
      `Minimum length is ${MIN_SECRET_LENGTH} bytes (256 bits) for strong security. ` +
      'Generate a strong secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64url\'))"'
    )
  }

  return secret
}

