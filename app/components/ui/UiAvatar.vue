<script setup>
import { initials } from "@app/utils/tone";

defineProps({
  name: { type: String, required: true },
  size: { type: String, default: "size-10" },
});
</script>

<template>
  <span
    class="inline-flex items-center justify-center shrink-0 rounded-full bg-brand-yellow text-[#16151a] font-display font-bold text-sm border border-rule"
    :class="size"
  >{{ initials(name) }}</span>
</template>
