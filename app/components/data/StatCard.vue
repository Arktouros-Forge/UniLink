<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, default: "" },
  note: { type: String, default: "" },
});
</script>

<template>
  <UiCard class="flex flex-col gap-3">
    <p class="t-body-s text-ink m-0">{{ label }}</p>
    <p class="t-serif-stat text-ink m-0">{{ value }}</p>
    <p v-if="trend" class="t-body-s text-ink m-0 flex items-center gap-2"><UiIcon name="external" size="text-sm" class="text-success" />{{ trend }}</p>
    <p v-if="note" class="t-mono-s text-ink-2 m-0">{{ note }}</p>
  </UiCard>
</template>
