/**
 * In-memory sliding-window rate limiter.
 *
 * This is process-local: it works correctly for a single long-running Node
 * server (e.g. a Docker container, VM, or `next start` process), but does
 * NOT coordinate across multiple instances or serverless invocations — each
 * instance keeps its own counters, so a determined attacker distributed
 * across instances could exceed the intended limit. For a horizontally
 * scaled or serverless deployment, swap this for a shared store (e.g.
 * Upstash Redis or Vercel KV) behind the same `rateLimit()` call signature.
 */

interface RateLimitRecord {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodically sweep expired entries so the map doesn't grow unbounded under
// sustained traffic from many distinct identifiers (IPs / user IDs). Guarded
// so it only runs once even if this module is imported multiple times.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_ENTRY_AGE_MS = 60 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __zkrRateLimitSweepStarted: boolean | undefined;
}

if (typeof globalThis !== "undefined" && !globalThis.__zkrRateLimitSweepStarted) {
  globalThis.__zkrRateLimitSweepStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.lastReset > MAX_ENTRY_AGE_MS) {
        rateLimitMap.delete(key);
      }
    }
  }, SWEEP_INTERVAL_MS).unref?.();
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(options: RateLimitOptions) {
  const { maxRequests, windowMs } = options;

  return function checkLimit(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now - record.lastReset > windowMs) {
      rateLimitMap.set(identifier, { count: 1, lastReset: now });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      return { success: false, remaining: 0 };
    }

    record.count += 1;
    return { success: true, remaining: maxRequests - record.count };
  };
}
