<script setup>
defineProps({
  options: { type: Array, required: true },
  icon: { type: String, default: "chevronDown" },
  variant: { type: String, default: "button" },
});
const model = defineModel({ type: String, default: "" });
</script>

<template>
  <label
    class="relative inline-flex items-center gap-2 h-11 px-4 rounded-md cursor-pointer t-button text-blue md:h-10"
    :class="variant === 'button' ? 'bg-card border border-hairline shadow-rest' : 'bg-transparent'"
  >
    <UiIcon v-if="variant === 'button'" :name="icon" />
    <span>{{ options.find((option) => option.value === model)?.label ?? options[0].label }}</span>
    <UiIcon v-if="variant !== 'button'" name="chevronDown" />
    <select v-model="model" class="absolute inset-0 opacity-0 cursor-pointer">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>
