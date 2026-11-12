import { useAuthStore } from "@app/stores/auth";

export const useSkillOptions = () => {
  const auth = useAuthStore();
  const path = auth.isAdmin ? "/admin/skills" : "/student/skills";

  return useApiData("skill-options", path, {
    query: auth.isAdmin ? { limit: 100 } : undefined,
    transform: (data) =>
      (data.items ?? data).map(({ id, name }) => ({ id, name })),
    default: () => [],
  });
};
