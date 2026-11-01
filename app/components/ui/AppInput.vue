<script setup>
defineProps({
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  as: { type: String, default: "input" },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  hint: { type: String, default: "" },
  error: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  autocomplete: { type: String, default: "off" },
});

const model = defineModel({ type: [String, Number], default: "" });
</script>

<template>
  <label class="grid gap-1.5">
    <span v-if="label" class="type-small font-medium">{{ label }}</span>
    <select v-if="as === 'select'" v-model="model" class="field" :required="required" :disabled="disabled">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <textarea v-else-if="as === 'textarea'" v-model="model" class="field" :rows="rows" :placeholder="placeholder" :required="required" :disabled="disabled" />
    <input v-else v-model="model" class="field" :type="type" :placeholder="placeholder" :required="required" :disabled="disabled" :autocomplete="autocomplete" />
    <span v-if="error" class="type-small text-brand-red">{{ error }}</span>
    <span v-else-if="hint" class="type-small text-mute">{{ hint }}</span>
  </label>
</template>
