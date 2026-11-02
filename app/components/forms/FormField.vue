<script setup>
defineProps({
  label: { type: String, required: true },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
});
</script>

<template>
  <label class="flex flex-col gap-1.5">
    <span class="type-label">{{ label }}</span>
    <slot />
    <span v-if="error" class="type-small !text-brand-red">{{ error }}</span>
    <span v-else-if="hint" class="type-small">{{ hint }}</span>
  </label>
</template>
