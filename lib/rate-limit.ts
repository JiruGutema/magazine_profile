/**
 * High-performance in-memory sliding-window rate limiter.
 * Supports multiple namespaces (IP burst, IP daily, fingerprint, user ID).
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
  lastRequestAt: number;
}

class RateLimiter {
  private stores: Map<string, Map<string, RateLimitRecord>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every 2 minutes
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 2 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  private getStore(namespace: string): Map<string, RateLimitRecord> {
    let store = this.stores.get(namespace);
    if (!store) {
      store = new Map();
      this.stores.set(namespace, store);
    }
    return store;
  }

  /**
   * Checks and consumes a token for a given key in a namespace.
   * @param namespace The rule namespace (e.g. 'ip_burst', 'user_burst')
   * @param key The identifier (IP, userId, fingerprint, etc.)
   * @param limit Maximum number of requests in the window
   * @param windowMs Window size in milliseconds
   * @param minIntervalMs Optional minimum cooldown between requests
   */
  public check(
    namespace: string,
    key: string,
    limit: number,
    windowMs: number,
    minIntervalMs = 0,
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfterSeconds: number;
    reason?: string;
  } {
    const store = this.getStore(namespace);
    const now = Date.now();
    const existing = store.get(key);

    if (existing) {
      // Check cooldown between consecutive requests
      if (minIntervalMs > 0 && now - existing.lastRequestAt < minIntervalMs) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((minIntervalMs - (now - existing.lastRequestAt)) / 1000),
        );
        return {
          allowed: false,
          limit,
          remaining: 0,
          resetTime: existing.resetAt,
          retryAfterSeconds,
          reason: "Too frequent. Please wait a moment between reactions.",
        };
      }

      // Check if window expired
      if (now > existing.resetAt) {
        // Reset window
        existing.count = 1;
        existing.resetAt = now + windowMs;
        existing.lastRequestAt = now;
        return {
          allowed: true,
          limit,
          remaining: limit - 1,
          resetTime: existing.resetAt,
          retryAfterSeconds: 0,
        };
      }

      // Still within window
      if (existing.count >= limit) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((existing.resetAt - now) / 1000),
        );
        return {
          allowed: false,
          limit,
          remaining: 0,
          resetTime: existing.resetAt,
          retryAfterSeconds,
          reason: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
        };
      }

      // Increment count
      existing.count += 1;
      existing.lastRequestAt = now;
      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - existing.count),
        resetTime: existing.resetAt,
        retryAfterSeconds: 0,
      };
    }

    // New entry
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
      lastRequestAt: now,
    });

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime: now + windowMs,
      retryAfterSeconds: 0,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const store of this.stores.values()) {
      for (const [key, record] of store.entries()) {
        if (now > record.resetAt + 60000) {
          store.delete(key);
        }
      }
    }
  }
}

// Global singleton to persist across requests in development/production
const globalForRateLimiter = global as unknown as {
  blogRateLimiter: RateLimiter | undefined;
};

export const rateLimiter =
  globalForRateLimiter.blogRateLimiter || new RateLimiter();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimiter.blogRateLimiter = rateLimiter;
}
