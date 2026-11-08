import { useAuthStore } from "@app/stores/auth";

export default defineNuxtPlugin({
  name: "auth-session",
  dependsOn: ["pinia"],
  async setup() {
    await useAuthStore().fetchMe();
  },
});
