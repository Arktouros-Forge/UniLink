import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { useUsersStore } from "@app/stores/users";

const emptyDraft = () => ({ fullName: "", nim: "", phone: "", year: "", skillIds: [], website: "" });

export const useAuthStore = defineStore("auth", () => {
  const users = useUsersStore();
  const currentId = ref("u1");
  const draft = reactive(emptyDraft());

  const user = computed(() => users.byId[currentId.value] ?? null);
  const role = computed(() => user.value?.role ?? "guest");
  const isLoggedIn = computed(() => Boolean(user.value));
  const isAdmin = computed(() => role.value === "admin");
  const homePath = computed(() => (isAdmin.value ? "/admin" : "/student/dashboard"));

  const login = (email) => {
    const found = users.users.find((item) => item.email === email) ?? users.users.find((item) => item.id === "u1");
    currentId.value = found.id;
    return found;
  };
  const logout = () => {
    currentId.value = "";
  };
  const resetDraft = () => Object.assign(draft, emptyDraft());

  return { currentId, draft, user, role, isLoggedIn, isAdmin, homePath, login, logout, resetDraft };
});
