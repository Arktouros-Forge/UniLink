<script setup>
import { publicNav } from "@app/constants/navigation.json";
import { login } from "@app/constants/auth.json";

const open = ref(false);
const route = useRoute();
watch(() => route.path, () => (open.value = false));
</script>

<template>
  <header class="sticky top-0 z-40 bg-paper border-b border-rule">
    <div class="wrap flex items-center justify-between h-16">
      <NuxtLink to="/"><UiLogo /></NuxtLink>
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink v-for="item in publicNav" :key="item.to" :to="item.to" class="type-label hover:text-brand-blue">{{ item.label }}</NuxtLink>
      </nav>
      <div class="flex items-center gap-2">
        <UiThemeToggle />
        <NuxtLink to="/auth/login" class="btn-primary hidden md:inline-flex">{{ login.headerAction }}</NuxtLink>
        <button class="md:hidden size-10 inline-flex items-center justify-center bg-transparent border border-edge rounded-lg text-ink" @click="open = !open">
          <span :class="open ? 'i-keyline-icons-x' : 'i-keyline-icons-menu'" class="text-xl" />
        </button>
      </div>
    </div>
    <nav v-if="open" class="md:hidden wrap flex flex-col gap-1 pb-4">
      <NuxtLink v-for="item in publicNav" :key="item.to" :to="item.to" class="type-label h-11 flex items-center">{{ item.label }}</NuxtLink>
      <NuxtLink to="/auth/login" class="btn-primary">{{ login.headerAction }}</NuxtLink>
    </nav>
  </header>
</template>
