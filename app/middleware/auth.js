import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (!auth.isLoggedIn) return navigateTo({ path: "/auth/login", query: { redirect: to.fullPath } });
});
