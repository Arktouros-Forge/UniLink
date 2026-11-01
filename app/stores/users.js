import { defineStore } from "pinia";
import { computed, ref } from "vue";
import usersData from "@app/constants/mock/users.json";
import { createCrud, indexById } from "@app/utils/crud";

export const useUsersStore = defineStore("users", () => {
  const users = ref([...usersData]);
  const crud = createCrud(users, "u");

  const byId = computed(() => indexById(users.value));
  const students = computed(() => users.value.filter((user) => user.role === "student"));

  const block = (id, reason = "") => crud.update(id, { status: "blocked", blockedReason: reason });
  const unblock = (id) => crud.update(id, { status: "active", blockedReason: "" });

  return { users, byId, students, ...crud, block, unblock };
});
