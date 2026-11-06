export function createTtlCache({ ttl = 30_000, max = 500 } = {}) {
  const store = new Map();

  return {
    get(key) {
      const hit = store.get(key);
      if (!hit) return undefined;
      if (hit.expires < Date.now()) {
        store.delete(key);
        return undefined;
      }
      return hit.value;
    },
    set(key, value) {
      if (store.size >= max) store.delete(store.keys().next().value);
      store.set(key, { value, expires: Date.now() + ttl });
      return value;
    },
    delete(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    async remember(key, loader) {
      const cached = this.get(key);
      if (cached !== undefined) return cached;
      return this.set(key, await loader());
    },
  };
}
