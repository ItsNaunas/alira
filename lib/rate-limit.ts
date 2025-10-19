/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for protecting expensive API endpoints.
 * For production with multiple instances, consider using Redis-based rate limiting
 * like @upstash/ratelimit.
 */

import { errors } from './server/errors'

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store for rate limit tracking
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis (e.g., @upstash/ratelimit)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  rateLimitStore.forEach((record, key) => {
    if (now > record.resetAt) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => rateLimitStore.delete(key))
}, 5 * 60 * 1000)

/**
 * Check if a request should be rate limited
 * 
 * @param userId - User identifier
 * @param endpoint - Endpoint identifier (e.g., 'ai-generate', 'plan-refine')
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60 seconds)
 * @throws AppError with 429 status if rate limit exceeded
 * 
 * @example
 * ```typescript
 * // Allow 10 requests per minute
 * await checkRateLimit(user.id, 'ai-generate', 10, 60000)
 * ```
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<void> {
  const key = `${userId}:${endpoint}`
  const now = Date.now()
  const record = rateLimitStore.get(key)

  // If no record exists or window has expired, create new record
  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
    return
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    const secondsUntilReset = Math.ceil((record.resetAt - now) / 1000)
    throw errors.tooManyRequests(
      `Rate limit exceeded. You can make ${limit} requests per ${windowMs / 1000} seconds. Try again in ${secondsUntilReset} seconds.`
    )
  }

  // Increment counter
  record.count++
}

/**
 * Get current rate limit status for a user/endpoint
 * Useful for adding rate limit headers to responses
 */
export function getRateLimitStatus(
  userId: string,
  endpoint: string
): { remaining: number; resetAt: number; limit: number } | null {
  const key = `${userId}:${endpoint}`
  const record = rateLimitStore.get(key)
  
  if (!record) {
    return null
  }

  return {
    remaining: Math.max(0, 10 - record.count), // Assuming default limit of 10
    resetAt: record.resetAt,
    limit: 10
  }
}

/**
 * Reset rate limit for a user/endpoint
 * Useful for admin operations or testing
 */
export function resetRateLimit(userId: string, endpoint: string): void {
  const key = `${userId}:${endpoint}`
  rateLimitStore.delete(key)
}

