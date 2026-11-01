import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const required = to.meta.role;
  if (required && auth.role !== required) return navigateTo(auth.homePath);
  if (auth.user?.status === "blocked") return navigateTo("/auth/blocked");
});
