<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
onMounted(ui.initTheme);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
