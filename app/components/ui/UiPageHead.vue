<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  meta: { type: String, default: "" },
});
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
    <div class="flex flex-col gap-1.5">
      <p v-if="meta" class="type-meta">{{ meta }}</p>
      <h1 class="type-h1">{{ title }}</h1>
      <p v-if="text" class="type-body">{{ text }}</p>
    </div>
    <div class="flex gap-3 flex-wrap"><slot /></div>
  </div>
</template>
