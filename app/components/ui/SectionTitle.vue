<script setup>
defineProps({
  title: { type: String, required: true },
  to: { type: String, default: "" },
  action: { type: String, default: "Lihat semua" },
});
</script>

<template>
  <div class="mb-3 flex items-center justify-between gap-4">
    <h2 class="type-h3">{{ title }}</h2>
    <NuxtLink v-if="to" :to="to" class="type-small font-medium text-brand-blue">{{ action }}</NuxtLink>
  </div>
</template>
