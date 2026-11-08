import { useAuthStore } from "@app/stores/auth";

export const useCategoryOptions = () => {
  const auth = useAuthStore();
  const path = auth.isAdmin ? "/admin/categories" : "/student/categories";

  return useApiData("category-options", path, {
    query: auth.isAdmin ? { limit: 100 } : undefined,
    transform: (data) => (data.items ?? data).map(({ id, name }) => ({ id, name })),
    default: () => [],
  });
};
