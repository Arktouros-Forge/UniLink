<script setup>
const props = defineProps({
  options: { type: Array, required: true },
  cols: { type: String, default: "" },
  stacked: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
});
const model = defineModel({ type: [String, Number], default: "" });
const value = (option) => option.value ?? option;
const label = (option) => option.label ?? option;
</script>

<template>
  <div role="radiogroup" class="gap-2" :class="[cols ? `:uno: grid ${cols}` : ':uno: flex flex-wrap', stacked && ':uno: !grid grid-cols-1']">
    <button
      v-for="option in options"
      :key="value(option)"
      type="button"
      role="radio"
      :aria-checked="model === value(option)"
      class=":uno: min-h-10 px-3 py-1.5 rounded-md border t-label cursor-pointer transition-colors focus-ring flex flex-col justify-center"
      :class="[center ? ':uno: text-center items-center' : ':uno: text-left', model === value(option) ? ':uno: border-blue bg-blue-soft text-blue' : ':uno: border-hairline bg-card text-ink hover:border-ink-3']"
      @click="model = value(option)"
    >
      <span class=":uno: truncate">{{ label(option) }}</span>
      <span v-if="option.hint" class=":uno: t-body-xs text-ink-2 font-normal">{{ option.hint }}</span>
    </button>
  </div>
</template>
