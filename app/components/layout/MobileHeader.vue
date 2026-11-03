<script setup>
import { useAuthStore } from "@app/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <header class="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-paper border-b border-hairline">
    <NuxtLink to="/student/dashboard"><UiLogo /></NuxtLink>
    <div class="flex items-center gap-2">
      <NuxtLink to="/student/settings"><UiAvatar :name="auth.user.name" :size="32" tone="neutral" /></NuxtLink>
    </div>
  </header>
</template>
