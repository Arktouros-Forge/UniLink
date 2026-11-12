<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, default: "" },
  note: { type: String, default: "" },
});
</script>

<template>
  <UiCard class=":uno: flex flex-col gap-3">
    <p class=":uno: t-body-s text-ink m-0">{{ label }}</p>
    <p class=":uno: t-serif-stat text-ink m-0">{{ value }}</p>
    <p v-if="trend" class=":uno: t-body-s text-ink m-0 flex items-center gap-2"><UiIcon name="external" size="text-sm" class=":uno: text-success" />{{ trend }}</p>
    <p v-if="note" class=":uno: t-mono-s text-ink-2 m-0">{{ note }}</p>
  </UiCard>
</template>
