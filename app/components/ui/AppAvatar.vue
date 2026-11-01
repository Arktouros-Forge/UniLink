<script setup>
import { initials } from "@app/utils/format";

defineProps({
  name: { type: String, default: "" },
  size: { type: String, default: "md" },
});

const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-16 text-xl" };
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-blue font-display font-bold text-onbrand" :class="sizes[size]">
    {{ initials(name) }}
  </span>
</template>
