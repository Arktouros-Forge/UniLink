<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  variant: { type: String, default: "ghost" },
});
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="size-10 inline-flex items-center justify-center rounded-md cursor-pointer transition-colors focus-ring"
    :class="variant === 'outline' ? 'bg-card border border-hairline text-ink hover:shadow-hover' : 'bg-transparent text-ink hover:bg-hairline'"
  >
    <UiIcon :name="icon" />
  </button>
</template>
