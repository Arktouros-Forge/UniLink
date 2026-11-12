const FRESH_MS = 8000;
const TTL_MS = 60000;
const REFERENCE_TTL_MS = 600000;
const REFERENCE = /^\/(student|admin)\/(skills|categories)(\/|$)/;

const store = new Map();
const inflight = new Map();

const stable = (value) => (value && typeof value === "object" ? JSON.stringify(Object.entries(value).filter(([, v]) => v !== undefined && v !== "").sort(([a], [b]) => (a < b ? -1 : 1))) : "");

export const cacheKey = (id, path, query) => `${id}|${path}?${stable(query)}`;
export const ttlFor = (path) => (REFERENCE.test(path) ? REFERENCE_TTL_MS : TTL_MS);

export const readCache = (key) => {
  if (!import.meta.client) return null;
  const hit = store.get(key);
  if (!hit) return null;
  const age = Date.now() - hit.at;
  if (age > hit.ttl) {
    store.delete(key);
    return null;
  }
  return { data: hit.data, stale: age > FRESH_MS };
};

export const writeCache = (key, data, ttl) => {
  if (import.meta.client) store.set(key, { data, at: Date.now(), ttl });
};

export const clearCache = ({ reference = false } = {}) => {
  for (const [key, hit] of store) if (reference || hit.ttl !== REFERENCE_TTL_MS) store.delete(key);
};

export const invalidateFor = (path) => {
  if (/^\/(auth|me)(\/|$)/.test(path)) return clearCache({ reference: true });
  clearCache({ reference: REFERENCE.test(path) });
};

export const shareRequest = (key, run) => {
  if (!import.meta.client) return run();
  if (!inflight.has(key)) inflight.set(key, run().finally(() => inflight.delete(key)));
  return inflight.get(key);
};
