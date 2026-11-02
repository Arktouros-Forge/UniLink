<script setup>
import { siteName } from "@app/constants/site.json";

defineProps({ inverted: { type: Boolean, default: false } });
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <span class="relative inline-block size-7">
      <span class="absolute left-0 top-0 size-4 bg-brand-blue" :class="inverted && '!bg-brand-yellow'" />
      <span class="absolute right-0 bottom-0 size-4 bg-brand-red" />
      <span class="absolute right-0 top-0 size-2.5 bg-brand-yellow" :class="inverted && '!bg-white'" />
    </span>
    <span class="font-display font-bold text-[22px] tracking-[-0.02em]" :class="inverted ? 'text-onbrand' : 'text-ink'">{{ siteName }}</span>
  </span>
</template>
