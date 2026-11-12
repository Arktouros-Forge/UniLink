<script setup>
defineProps({
  name: { type: String, required: true },
  meta: { type: String, default: "" },
  size: { type: Number, default: 72 },
});
</script>

<template>
  <div class=":uno: flex flex-col gap-4 md:flex-row md:items-center">
    <UiAvatar :name="name" :size="size" />
    <div class=":uno: flex-1 min-w-0 flex flex-col gap-1">
      <h1 class=":uno: t-d3 text-ink m-0">{{ name }}</h1>
      <p v-if="meta" class=":uno: t-body-s text-ink-2 m-0">{{ meta }}</p>
      <div v-if="$slots.default" class=":uno: flex flex-wrap gap-2 pt-1"><slot /></div>
    </div>
    <div v-if="$slots.actions" class=":uno: flex flex-wrap gap-3"><slot name="actions" /></div>
  </div>
</template>
