<script setup>
defineProps({
  label: { type: String, required: true },
  hint: { type: String, default: "" },
  error: { type: String, default: "" },
  optional: { type: Boolean, default: false },
});
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="t-label text-ink">{{ label }}<span v-if="optional" class="text-ink-3 font-normal"> (opsional)</span></label>
    <slot :id="id" :invalid="!!error" />
    <p v-if="error" class="t-body-xs text-danger m-0">{{ error }}</p>
    <p v-else-if="hint" class="t-body-xs text-ink-2 m-0">{{ hint }}</p>
  </div>
</template>
