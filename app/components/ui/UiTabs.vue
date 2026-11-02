<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex gap-6 border-b border-edge overflow-x-auto">
    <button
      v-for="item in items"
      :key="item.value"
      class="relative h-11 shrink-0 font-sans text-[15px] font-medium cursor-pointer bg-transparent border-0"
      :class="modelValue === item.value ? 'text-brand-blue' : 'text-mute'"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
      <span v-if="modelValue === item.value" class="absolute inset-x-0 -bottom-px h-0.5 bg-brand-blue" />
    </button>
  </div>
</template>
