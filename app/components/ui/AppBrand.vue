<script setup>
import { siteName } from "@app/constants/site.json";
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2">
    <span class="inline-flex size-8 items-center justify-center rounded-[8px] bg-brand-blue font-display font-bold text-onbrand">U</span>
    <span class="type-h3">{{ siteName }}</span>
  </NuxtLink>
</template>
