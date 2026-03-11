// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// Limits requests per IP address using a sliding window approach.
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 60 seconds)
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
  }, 60_000);
  // Allow the process to exit even if this interval is running
  if (typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether the given identifier (typically an IP address) is within the
 * rate limit.
 *
 * @param identifier  Unique key (e.g. IP address)
 * @param limit       Maximum number of requests in the window (default 60)
 * @param windowMs    Window duration in milliseconds (default 60 000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit = 60,
  windowMs = 60_000,
): RateLimitResult {
  ensureCleanup();

  const now = Date.now();
  const entry = store.get(identifier);

  // If there is no entry or the window has expired, start a new window.
  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Window is still active. Increment and check.
  entry.count += 1;

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract the client IP from a Next.js request.
 * Falls back to 'unknown' when the IP cannot be determined.
 */
export function getClientIp(request: Request): string {
  // Next.js sometimes exposes the IP via headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}
