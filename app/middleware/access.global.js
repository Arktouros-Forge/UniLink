import { useAuthStore } from "@app/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const access = to.meta.access;
  if (!access) return;

  const auth = useAuthStore();
  await auth.fetchMe();

  const toLogin = () =>
    navigateTo({ path: "/auth/login", query: { redirect: to.fullPath } });
  const gate = () => {
    if (auth.blocked) return navigateTo("/auth/blocked");
    if (!auth.isAuthed) return toLogin();
    if (!auth.isVerified) return navigateTo("/auth/verify-email");
  };

  if (access === "guest")
    return auth.isAuthed ? navigateTo(auth.destination) : undefined;

  if (access === "blocked")
    return auth.blocked
      ? undefined
      : navigateTo(auth.isAuthed ? auth.destination : "/auth/login");

  if (access === "verify") {
    if (auth.isAuthed && auth.isVerified) return navigateTo(auth.destination);
    if (!auth.isAuthed && !to.query.token) return toLogin();
    return;
  }

  const stopped = gate();
  if (stopped) return stopped;

  if (access === "onboarding")
    return auth.isOnboarded ? navigateTo(auth.home) : undefined;

  if (!auth.isOnboarded) return navigateTo("/onboarding/1");
  if ((access === "admin") !== auth.isAdmin) return navigateTo(auth.home);
});
