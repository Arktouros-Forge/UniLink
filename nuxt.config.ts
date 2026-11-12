import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "nuxt-seo-utils",
    "@nuxt/image",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-zod",
    "@vueuse/nuxt",
    "auto-skeleton-vue/nuxt",
  ],

  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      },
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  css: [
    "vue-sonner/style.css",
    "~/assets/css/tokens.css",
    "~/assets/css/base.css",
  ],

  components: [{ path: "~/components", pathPrefix: false }],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || undefined,
    name: "UniLink",
    description:
      "Platform mahasiswa Universitas Udayana untuk mencari teman belajar, membentuk tim kompetisi, dan merapikan jadwal kuliah.",
    defaultLocale: "id",
  },

  robots: {
    disallow: [
      "/student",
      "/admin",
      "/onboarding",
      "/auth/verify-email",
      "/auth/reset",
      "/auth/blocked",
      "/auth/forgot",
    ],
    blockAiBots: false,
  },

  sitemap: {
    exclude: [
      "/student/**",
      "/admin/**",
      "/onboarding/**",
      "/auth/verify-email",
      "/auth/reset",
      "/auth/blocked",
      "/auth/forgot",
      "/maintenance",
      "/offline",
    ],
    defaults: { changefreq: "monthly" },
  },

  schemaOrg: {
    identity: {
      type: "Organization",
      name: "UniLink",
      logo: "/logo.png",
      description: "Platform kolaborasi mahasiswa Universitas Udayana.",
    },
  },

  seo: {},

  routeRules: {
    "/student/**": { robots: false },
    "/admin/**": { robots: false },
    "/onboarding/**": { robots: false },
    "/auth/verify-email": { robots: false },
    "/auth/reset": { robots: false },
    "/auth/blocked": { robots: false },
    "/auth/forgot": { robots: false },
    "/": { sitemap: { priority: 1 } },
    "/onboarding": { redirect: "/onboarding/1" },
    "/student": { redirect: "/student/dashboard" },
  },

  app: {
    head: {
      htmlAttrs: { lang: "id" },
      meta: [
        { name: "theme-color", content: "#f5f1e8" },
        { name: "application-name", content: "UniLink" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
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

  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      },
    },
  },
});
