import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

/**
 * Lightweight in-memory rate limiter for authentication routes.
 * Mitigates brute-force credential stuffing and password spraying attacks.
 */
export const createRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests. Please try again later.' } = options;
  const hits = new Map<string, RateLimitRecord>();

  // Periodically clean up expired entries every 5 minutes to prevent memory leaks
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  // Unref interval so it does not prevent process exit during tests
  if (interval.unref) {
    interval.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    // Bypass in test environment to prevent flakiness in automated test suites
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now > record.resetTime) {
      hits.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, max - record.count);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      throw new ApiError(429, message);
    }

    next();
  };
};

/**
 * Authentication rate limiter: 60 attempts per 15-minute window per IP.
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.'
});
