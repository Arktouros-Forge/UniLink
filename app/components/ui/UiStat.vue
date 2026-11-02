<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  note: { type: String, default: "" },
});
</script>

<template>
  <div class="card flex flex-col gap-2">
    <p class="type-meta">{{ label }}</p>
    <p class="font-display font-bold text-4xl leading-none text-ink">{{ value }}</p>
    <p v-if="note" class="type-small !text-good">{{ note }}</p>
  </div>
</template>
