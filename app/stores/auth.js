import { defineStore } from "pinia";

const HOME = { student: "/student/dashboard", admin: "/admin" };

const shape = (data) => ({ ...data, skillIds: (data.skills ?? []).map((skill) => skill.id), name: data.fullName, cohort: data.year, website: data.personalWebsite });

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loaded = ref(false);
  const blocked = ref(null);
  const api = useApi();

  const isAuthed = computed(() => Boolean(user.value));
  const isAdmin = computed(() => user.value?.role === "admin");
  const isVerified = computed(() => Boolean(user.value?.emailVerifiedAt));
  const isOnboarded = computed(() => isAdmin.value || Boolean(user.value?.onboardedAt));
  const home = computed(() => HOME[user.value?.role] ?? "/student/dashboard");

  const fetchMe = async ({ force = false } = {}) => {
    if (loaded.value && !force) return user.value;
    try {
      user.value = shape(await api.get("/me"));
      blocked.value = null;
    } catch (error) {
      user.value = null;
      if (error.statusCode === 403 && /blocked/i.test(error.message)) blocked.value = error.errors?.[0]?.message ?? true;
    }
    loaded.value = true;
    return user.value;
  };

  const login = async (payload) => {
    await api.post("/auth/login", payload);
    return fetchMe({ force: true });
  };

  const register = async (payload) => {
    await api.post("/auth/register", payload);
    return fetchMe({ force: true });
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    user.value = null;
    blocked.value = null;
    loaded.value = true;
  };

  const setBlocked = (reason) => {
    blocked.value = reason || true;
  };

  const update = (payload) => {
    user.value = shape({ ...user.value, ...payload });
  };

  return { user, loaded, blocked, isAuthed, isAdmin, isVerified, isOnboarded, home, fetchMe, setBlocked, login, register, logout, update };
});
