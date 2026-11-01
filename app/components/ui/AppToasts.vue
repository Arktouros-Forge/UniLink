<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
const tones = { default: "bg-ink text-paper", good: "bg-good text-onbrand", error: "bg-brand-red text-onbrand" };
</script>

<template>
  <div class="pointer-events-none fixed bottom-20 right-4 z-[60] grid gap-2 md:bottom-4">
    <div v-for="toast in ui.toasts" :key="toast.id" class="type-small rounded-[8px] px-4 py-3 shadow-lg" :class="tones[toast.tone]">
      {{ toast.message }}
    </div>
  </div>
</template>
