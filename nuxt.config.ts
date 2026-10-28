import { fontEmitPlugin } from "./font-processor";
import { fileURLToPath } from "node:url";

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
  alias: {
    // "@assets": fileURLToPath(new URL("./public/assets", import.meta.url)), // example usege (m)
  },
});
