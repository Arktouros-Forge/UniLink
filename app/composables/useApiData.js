export const useApiData = (id, path, { query, transform, default: fallback, watch: sources = [] } = {}) => {
  const api = useApi();
  const toValue = (value) => (typeof value === "function" ? value() : value);

  return useLazyAsyncData(
    id,
    async () => {
      const data = await api.get(toValue(path), toValue(query));
      return transform ? transform(data) : data;
    },
    { default: fallback, watch: sources },
  );
};
