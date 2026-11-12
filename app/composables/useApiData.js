import { notifyError } from "@app/utils/notify";
import { cacheKey, readCache, ttlFor, writeCache } from "@app/utils/apiCache";

export const useApiData = (
  id,
  path,
  { query, transform, default: fallback, watch: sources = [] } = {},
) => {
  const api = useApi();
  const toValue = (value) => (typeof value === "function" ? value() : value);
  const keyNow = () => cacheKey(id, toValue(path), toValue(query));
  let result;

  const load = async () => {
    const [url, params, key] = [toValue(path), toValue(query), keyNow()];
    const data = await api.get(url, params);
    const shaped = transform ? transform(data) : data;
    writeCache(key, shaped, ttlFor(url));
    return shaped;
  };

  const revalidate = async () => {
    try {
      result.data.value = await load();
    } catch {}
  };

  result = useLazyAsyncData(id, load, {
    default: fallback,
    watch: sources,
    getCachedData: (key, nuxtApp, ctx) => {
      if (nuxtApp.isHydrating) return nuxtApp.payload.data[key];
      if (ctx.cause === "refresh:manual" || ctx.cause === "refresh:hook")
        return undefined;
      const hit = readCache(keyNow());
      if (!hit) return undefined;
      if (hit.stale) queueMicrotask(revalidate);
      return hit.data;
    },
  });

  if (import.meta.client) {
    watch(
      result.error,
      (failure) =>
        failure && failure.statusCode !== 401 && notifyError(failure),
    );
  }

  return result;
};
