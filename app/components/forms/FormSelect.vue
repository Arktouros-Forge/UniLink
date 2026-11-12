<script setup>
defineProps({
  id: { type: String, default: undefined },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "" },
});
const model = defineModel({ type: [String, Number], default: "" });
</script>

<template>
  <div class=":uno: relative">
    <select :id="id" v-model="model" class=":uno: w-full h-11 appearance-none rounded-md border border-hairline bg-card text-ink t-body-s pl-3 pr-10 outline-none focus:border-blue">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value ?? option" :value="option.value ?? option">{{ option.label ?? option }}</option>
    </select>
    <UiIcon name="chevronDown" class=":uno: absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none" />
  </div>
</template>
