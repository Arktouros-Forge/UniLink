export const useMock = (key, source, delay = 700) =>
  useLazyAsyncData(
    key,
    () => new Promise((resolve) => setTimeout(() => resolve(source), import.meta.client ? delay : 0)),
    { default: () => source },
  );
