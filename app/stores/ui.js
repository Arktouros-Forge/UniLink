import { defineStore } from "pinia";


export const THEME_MODES = ["light", "dark", "system"];
const COLORS = { light: "#f5f1e8", dark: "#16151a" };

export const useUiStore = defineStore("ui", () => {
  const saved = useCookie("unilink_theme", { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });
  const mode = ref(THEME_MODES.includes(saved.value) ? saved.value : "system");
  const systemDark = ref(false);
  const sidebarOpen = ref(false);

  const theme = computed(() => (mode.value === "system" ? (systemDark.value ? "dark" : "light") : mode.value));

  const apply = () => {
    if (!import.meta.client) return;
    document.documentElement.classList.toggle("dark", theme.value === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[theme.value]);
  };

  const setMode = (value) => {
    if (!THEME_MODES.includes(value)) return;
    mode.value = value;
    saved.value = value;
    apply();
  };
  const setTheme = setMode;
  const toggleTheme = () => setMode(theme.value === "dark" ? "light" : "dark");

  const initTheme = () => {
    if (!import.meta.client) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.value = query.matches;
    query.addEventListener("change", (event) => {
      systemDark.value = event.matches;
      apply();
    });
    apply();
  };

  return { mode, theme, sidebarOpen, setMode, setTheme, toggleTheme, initTheme };
});
