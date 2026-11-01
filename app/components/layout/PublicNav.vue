<script setup>
import navigation from "@app/constants/navigation.json";
</script>

<template>
  <header class="border-b border-rule bg-paper">
    <div class="page flex items-center justify-between gap-4 py-3">
      <AppBrand />
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink v-for="item in navigation.public" :key="item.to" :to="item.to" class="type-body text-mute hover:text-ink">{{ item.label }}</NuxtLink>
      </nav>
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <AppButton to="/auth/login" variant="ghost" size="sm">Masuk</AppButton>
        <AppButton to="/auth/register" size="sm">Daftar</AppButton>
      </div>
    </div>
  </header>
</template>
