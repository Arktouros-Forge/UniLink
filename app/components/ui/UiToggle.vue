<script setup>
defineProps({ label: { type: String, default: "" } });
const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <label class=":uno: inline-flex items-center gap-3 cursor-pointer t-body-s text-ink">
    <span class=":uno: relative w-10 h-6 rounded-full transition-colors" :class="model ? ':uno: bg-blue' : ':uno: bg-ink-off'">
      <span class=":uno: absolute top-0.5 size-5 rounded-full bg-card transition-all" :class="model ? ':uno: left-[18px]' : ':uno: left-0.5'" />
    </span>
    <input v-model="model" type="checkbox" class=":uno: sr-only" />
    <span v-if="label">{{ label }}</span>
  </label>
</template>
