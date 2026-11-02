<script setup>
import { useAuthStore } from "@app/stores/auth";
import { siteName, campusLabel } from "@app/constants/site.json";

defineProps({ admin: { type: Boolean, default: false } });
const auth = useAuthStore();
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-paper border-b border-edge flex items-center justify-between px-5 md:px-10">
    <NuxtLink :to="admin ? '/admin' : '/student/dashboard'" class="md:hidden"><UiLogo /></NuxtLink>
    <p class="hidden md:block type-meta">{{ siteName }} · {{ campusLabel }}</p>
    <div class="flex items-center gap-2">
      <UiThemeToggle />
      <NuxtLink v-if="!admin" to="/student/settings" class="md:hidden"><UiAvatar :name="auth.user.name" /></NuxtLink>
    </div>
  </header>
</template>
