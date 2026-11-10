<script setup>
const props = defineProps({ min: { type: Number, default: 1 }, max: { type: Number, default: 10 }, unit: { type: String, default: "" } });
const model = defineModel({ type: Number, default: 1 });
const step = (delta) => (model.value = Math.min(props.max, Math.max(props.min, model.value + delta)));
</script>

<template>
  <div class="inline-flex items-center gap-1 self-start">
    <button type="button" aria-label="Kurangi" class="size-10 rounded-md border border-hairline bg-card text-ink cursor-pointer disabled:opacity-40 focus-ring inline-flex items-center justify-center" :disabled="model <= min" @click="step(-1)"><UiIcon name="minus" /></button>
    <span class="t-mono-m text-ink min-w-20 text-center">{{ model }} {{ unit }}</span>
    <button type="button" aria-label="Tambah" class="size-10 rounded-md border border-hairline bg-card text-ink cursor-pointer disabled:opacity-40 focus-ring inline-flex items-center justify-center" :disabled="model >= max" @click="step(1)"><UiIcon name="plus" /></button>
  </div>
</template>
