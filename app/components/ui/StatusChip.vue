<script setup>
const props = defineProps({
  group: { type: String, required: true },
  value: { type: String, required: true },
});

const status = computed(() => useStatus(props.group, props.value));
</script>

<template>
  <AppChip :tone="status.tone">{{ status.label }}</AppChip>
</template>
