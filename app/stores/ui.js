import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
  const theme = ref("light");
  const sidebarOpen = ref(false);

  const apply = () => {
    if (import.meta.client)
      document.documentElement.classList.toggle("dark", theme.value === "dark");
  };
  const setTheme = (value) => {
    theme.value = value;
    apply();
  };
  const toggleTheme = () => setTheme(theme.value === "dark" ? "light" : "dark");
  const initTheme = () => {
    if (import.meta.client)
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
  };

  return { theme, sidebarOpen, setTheme, toggleTheme, initTheme };
});
