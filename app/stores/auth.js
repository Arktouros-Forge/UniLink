import { defineStore } from "pinia";
import { me } from "@app/constants/mock/people.json";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({ ...me });
  const isAuthed = ref(true);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = (payload = {}) => {
    user.value = { ...me, ...payload };
    isAuthed.value = true;
  };

  const logout = () => {
    isAuthed.value = false;
  };

  const updateProfile = (payload) => {
    user.value = { ...user.value, ...payload };
  };

  return { user, isAuthed, isAdmin, login, logout, updateProfile };
});
