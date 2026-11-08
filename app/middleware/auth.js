import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  if (auth.blocked) return navigateTo("/auth/blocked");
  if (!auth.isAuthed) return navigateTo({ path: "/auth/login", query: { redirect: to.fullPath } });

  if (!auth.isVerified) return to.path === "/auth/verify-email" ? undefined : navigateTo("/auth/verify-email");
  if (to.meta.allowIncomplete) return;

  if (!auth.isOnboarded) return navigateTo("/onboarding/1");

  const area = to.path.split("/")[1];
  if (area === "admin" && !auth.isAdmin) return navigateTo(auth.home);
  if (area === "student" && auth.isAdmin) return navigateTo(auth.home);
});
