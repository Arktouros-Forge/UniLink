import { defineStore } from "pinia";
import { useOnboardingStore } from "@app/stores/onboarding";
import toast from "@app/constants/toast.json";
import { notifySuccess } from "@app/utils/notify";

const HOME = { student: "/student/dashboard", admin: "/admin" };

const shape = (data) => ({
  ...data,
  skillIds: (data.skills ?? []).map((skill) => skill.id),
  name: data.fullName,
  cohort: data.year,
  website: data.personalWebsite,
});

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loaded = ref(false);
  const blocked = ref(null);
  const api = useApi();
  const firebase = useFirebaseAuth();

  const isAuthed = computed(() => Boolean(user.value));
  const isAdmin = computed(() => user.value?.role === "admin");
  const isVerified = computed(() => Boolean(user.value?.emailVerifiedAt));
  const isOnboarded = computed(
    () => isAdmin.value || Boolean(user.value?.onboardedAt),
  );
  const home = computed(() => HOME[user.value?.role] ?? "/student/dashboard");
  const destination = computed(() => {
    if (blocked.value) return "/auth/blocked";
    if (!isAuthed.value) return "/auth/login";
    if (!isVerified.value) return "/auth/verify-email";
    if (!isOnboarded.value) return "/onboarding/1";
    return home.value;
  });

  const landing = (redirect) => {
    const target = String(redirect ?? "");
    const safe =
      target.startsWith("/") &&
      !target.startsWith("//") &&
      !target.startsWith("/auth/");
    return safe && destination.value === home.value
      ? target
      : destination.value;
  };

  const fetchMe = async ({ force = false } = {}) => {
    if (loaded.value && !force) return user.value;
    try {
      user.value = shape(await api.get("/me"));
      blocked.value = null;
    } catch (error) {
      user.value = null;
      if (error.statusCode === 403 && /blocked/i.test(error.message))
        blocked.value = error.errors?.[0]?.message ?? true;
    }
    loaded.value = true;
    return user.value;
  };

  const exchange = async (firebaseUser, extra = {}) => {
    await api.post("/auth/firebase", {
      idToken: await firebaseUser.getIdToken(),
      ...extra,
    });
    return fetchMe({ force: true });
  };

  const localLogin = async (payload) => {
    await api.post("/auth/login", payload);
    return fetchMe({ force: true });
  };

  const login = async (payload) => {
    if (!firebase.enabled) return localLogin(payload);
    let firebaseUser;
    try {
      firebaseUser = await firebase.signInWithPassword(
        payload.email,
        payload.password,
      );
    } catch (firebaseError) {
      try {
        return await localLogin(payload);
      } catch (localError) {
        throw firebase.isCredentialError(firebaseError)
          ? localError
          : firebaseError.code
            ? firebaseError
            : localError;
      }
    }
    return exchange(firebaseUser, { remember: payload.remember });
  };

  const loginWithGoogle = async () =>
    exchange(await firebase.signInWithGoogle());

  const localRegister = async (payload) => {
    await api.post("/auth/register", payload);
    return fetchMe({ force: true });
  };

  const register = async (payload) => {
    if (!firebase.enabled) return localRegister(payload);
    let firebaseUser;
    try {
      firebaseUser = await firebase.signUp(payload);
    } catch {
      return localRegister(payload);
    }
    return exchange(firebaseUser, { name: payload.name });
  };

  const syncVerification = async () => {
    const token = await firebase.freshToken();
    if (!token) return false;
    await api.post("/auth/firebase", { idToken: token });
    await fetchMe({ force: true });
    return isVerified.value;
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    await firebase.signOut();
    user.value = null;
    blocked.value = null;
    loaded.value = true;
    useOnboardingStore().reset();
    notifySuccess(toast.messages.loggedOut);
  };

  const setBlocked = (reason) => {
    blocked.value = reason || true;
  };

  const update = (payload) => {
    user.value = shape({ ...user.value, ...payload });
  };

  return {
    user,
    loaded,
    blocked,
    isAuthed,
    isAdmin,
    isVerified,
    isOnboarded,
    home,
    destination,
    landing,
    fetchMe,
    setBlocked,
    login,
    loginWithGoogle,
    register,
    syncVerification,
    logout,
    update,
  };
});
