<script setup>
import { useUiStore } from "@app/stores/ui";
import { themeLabels } from "@app/constants/site.json";

const ui = useUiStore();
</script>

<template>
  <button
    class="size-10 inline-flex items-center justify-center rounded-lg bg-transparent border border-edge text-ink cursor-pointer hover:bg-soft"
    :aria-label="ui.theme === 'dark' ? themeLabels.light : themeLabels.dark"
    @click="ui.toggleTheme"
  >
    <span :class="ui.theme === 'dark' ? 'i-keyline-icons-sun' : 'i-keyline-icons-moon'" class="text-xl" />
  </button>
</template>
