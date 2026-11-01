import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (auth.isLoggedIn) return navigateTo(auth.homePath);
});
