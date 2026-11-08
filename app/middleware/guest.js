import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (auth.isAuthed && auth.isVerified) return navigateTo(auth.home);
});
