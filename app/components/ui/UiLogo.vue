<script setup>
import { siteName } from "@app/constants/site.json";

defineProps({ size: { type: String, default: "md" } });
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <UiInterlock :size="size === 'lg' ? 28 : 24" />
    <span class="font-display font-bold tracking-[-0.02em] text-ink" :class="size === 'lg' ? 'text-[32px] leading-10' : 'text-[28px] leading-9'">{{ siteName }}</span>
  </span>
</template>
