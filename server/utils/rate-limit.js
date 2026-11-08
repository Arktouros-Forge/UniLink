import { fail } from "./errors.js";
import { createTtlCache } from "./ttl-cache.js";

const buckets = new Map();

export function rateLimit(name, key, { max, windowMs }) {
  if (!buckets.has(name)) buckets.set(name, createTtlCache({ ttl: windowMs, max: 5000 }));
  const cache = buckets.get(name);

  const hits = (cache.get(key) ?? 0) + 1;
  cache.set(key, hits);

  if (hits > max) fail("RATE_LIMITED");
}

export const resetRateLimit = (name, key) => buckets.get(name)?.delete(key);
