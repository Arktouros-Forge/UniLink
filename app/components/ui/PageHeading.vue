<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
});
</script>

<template>
  <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="type-h1">{{ title }}</h1>
      <p v-if="text" class="type-body mt-1 text-mute">{{ text }}</p>
    </div>
    <div class="flex flex-wrap gap-2"><slot /></div>
  </header>
</template>
