<script setup>
import { toneClass } from "@app/utils/tone";

defineProps({
  tone: { type: String, default: "neutral" },
  icon: { type: String, default: "" },
});
</script>

<template>
  <span class="chip" :class="toneClass[tone]">
    <span v-if="icon" :class="icon" class="text-base" />
    <slot />
  </span>
</template>
