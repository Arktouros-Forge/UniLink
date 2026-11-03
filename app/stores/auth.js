import { defineStore } from "pinia";
import { me, admin } from "@app/constants/mock/people.json";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({ ...me });
  const isAuthed = ref(true);
  const isAdmin = computed(() => user.value.role === "admin");

  const login = (payload = {}) => {
    user.value = { ...me, ...payload };
    isAuthed.value = true;
  };
  const loginAsAdmin = () => {
    user.value = { ...admin };
    isAuthed.value = true;
  };
  const logout = () => {
    isAuthed.value = false;
  };
  const update = (payload) => {
    user.value = { ...user.value, ...payload };
  };

  return { user, isAuthed, isAdmin, login, loginAsAdmin, logout, update };
});
