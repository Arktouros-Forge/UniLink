<script setup>
import { studentTabs } from "@app/constants/navigation.json";

const route = useRoute();
const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`);
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 bg-card border-t border-rule safe-bottom">
    <NuxtLink
      v-for="item in studentTabs"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center justify-center gap-1 h-16 text-[11px] font-medium"
      :class="isActive(item.to) ? 'text-brand-blue' : 'text-mute'"
    >
      <span :class="item.icon" class="text-xl" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
