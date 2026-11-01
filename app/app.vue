<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();

useHead({
  htmlAttrs: { class: computed(() => ui.theme) },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppToasts />
</template>
