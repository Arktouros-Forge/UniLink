<script setup>
defineProps({ label: { type: String, default: "" } });
const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <label class="inline-flex items-center gap-3 cursor-pointer t-body-s text-ink">
    <span class="relative w-10 h-6 rounded-full transition-colors" :class="model ? 'bg-blue' : 'bg-ink-off'">
      <span class="absolute top-0.5 size-5 rounded-full bg-card transition-all" :class="model ? 'left-[18px]' : 'left-0.5'" />
    </span>
    <input v-model="model" type="checkbox" class="sr-only" />
    <span v-if="label">{{ label }}</span>
  </label>
</template>
