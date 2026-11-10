import { notifyError } from "@app/utils/notify";

export const useApiData = (id, path, { query, transform, default: fallback, watch: sources = [] } = {}) => {
  const api = useApi();
  const toValue = (value) => (typeof value === "function" ? value() : value);

  const result = useLazyAsyncData(
    id,
    async () => {
      const data = await api.get(toValue(path), toValue(query));
      return transform ? transform(data) : data;
    },
    { default: fallback, watch: sources },
  );

  if (import.meta.client) {
    watch(result.error, (failure) => failure && failure.statusCode !== 401 && notifyError(failure));
  }

  return result;
};
