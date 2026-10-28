import { fontEmitPlugin } from "./font-processor";

export default defineNuxtConfig({
  modules: ["@nuxt/image", "@unocss/nuxt"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks: {
    "vite:extendConfig"(config, { isClient }) {
      if (isClient) {
        config.plugins?.push(fontEmitPlugin);
      }
    },
  },
});
