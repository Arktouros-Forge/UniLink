<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: "" },
  to: { type: String, default: "" },
});
</script>

<template>
  <AppCard :to="to">
    <div class="flex items-center justify-between">
      <span class="type-meta text-mute">{{ label }}</span>
      <span v-if="icon" class="text-mute" :class="icon" />
    </div>
    <p class="type-numeral mt-2">{{ value }}</p>
  </AppCard>
</template>
