<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  icon: { type: String, default: "i-keyline-search" },
});
</script>

<template>
  <div class="card grid place-items-center gap-2 p-10 text-center">
    <span class="text-3xl text-mute" :class="icon" />
    <p class="type-h3">{{ title }}</p>
    <p v-if="text" class="type-body max-w-sm text-mute">{{ text }}</p>
    <div class="mt-2"><slot /></div>
  </div>
</template>
