import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
  const theme = ref("light");
  const sidebarOpen = ref(false);

  const applyTheme = () => {
    if (import.meta.client) document.documentElement.classList.toggle("dark", theme.value === "dark");
  };

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
    applyTheme();
  };

  const initTheme = () => {
    if (!import.meta.client) return;
    theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme();
  };

  return { theme, sidebarOpen, toggleTheme, initTheme };
});
