<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
</script>

<template>
  <button type="button" class="btn btn-ghost btn-sm" aria-label="Ganti tema" @click="ui.toggleTheme">
    <span class="i-keyline-sun dark:i-keyline-moon" />
  </button>
</template>
