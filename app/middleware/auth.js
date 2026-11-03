import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (!auth.isAuthed) return navigateTo("/auth/login");
});
