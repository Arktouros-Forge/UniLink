import { fontEmitPlugin } from "./font-processor";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-zod",
    // "nuxt-charts",
    "auto-skeleton-vue/nuxt",
  ],

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // css: ["~/assets/styles/tokens.css", "~/assets/styles/base.css"],

  //   components: [{ path: "~/components", pathPrefix: false }],
  //
  //   routeRules: {
  //     "/onboarding": { redirect: "/onboarding/1" },
  //     "/student": { redirect: "/student/dashboard" },
  //   },

  // app: {
  //   head: {
  //     htmlAttrs: { lang: "id" },
  //     meta: [
  //       { name: "viewport", content: "width=device-width, initial-scale=1" },
  //     ],
  //   },
  // },

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

  autoSkeleton: {
    persist: true,
  },
});
