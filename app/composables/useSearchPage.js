export const useSearchPage = (resetOn = []) => {
  const query = ref("");
  const debounced = refDebounced(query, 300);
  const page = ref(1);
  watch([debounced, ...resetOn], () => (page.value = 1));
  return { query, debounced, page };
};
