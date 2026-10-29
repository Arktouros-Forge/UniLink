import { fontEmitPlugin } from "./font-processor";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: ["@nuxt/image", "@unocss/nuxt", "@pinia/nuxt", "nuxt-zod"],

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  hooks: {
    "vite:extendConfig"(config, { isClient }) {
      if (isClient) {
        config.plugins?.push(fontEmitPlugin);
      }
    },
  },
  nuxtZod: {
    zodVersion: "v4",
  },
  alias: {
    "@server": fileURLToPath(new URL("./server", import.meta.url)),
    "@database": fileURLToPath(new URL("./server/database", import.meta.url)),
    "@app": fileURLToPath(new URL("./app", import.meta.url)),
  },
});
