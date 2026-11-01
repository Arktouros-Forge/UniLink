import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const themeCookie = useCookie("unilink-theme", { default: () => "" });
  const theme = ref(themeCookie.value);
  const toasts = ref([]);

  const setTheme = (value) => {
    theme.value = value;
    themeCookie.value = value;
  };
  const toggleTheme = () => setTheme(theme.value === "dark" ? "light" : "dark");

  const notify = (message, tone = "default") => {
    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, tone });
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, 3200);
  };

  return { theme, toasts, setTheme, toggleTheme, notify };
});
