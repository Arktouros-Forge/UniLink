import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", () => {
  const items = ref([]);

  const dismiss = (id) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  const push = (message, tone = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    items.value = [...items.value, { id, message, tone }];
    setTimeout(() => dismiss(id), 3600);
  };

  return { items, push, dismiss };
});
