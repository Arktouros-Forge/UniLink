export const useDebounced = (source, delay = 300) => {
  const value = ref(source.value);
  let timer;
  watch(source, (next) => {
    clearTimeout(timer);
    timer = setTimeout(() => (value.value = next), delay);
  });
  onBeforeUnmount(() => clearTimeout(timer));
  return value;
};
