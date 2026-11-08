<script setup>
const props = defineProps({ days: { type: Number, required: true }, size: { type: String, default: "sm" } });
const tone = computed(() => (props.days <= 0 ? "neutral" : props.days <= 3 ? "danger" : props.days <= 10 ? "warning" : "success"));
const label = computed(() => (props.days <= 0 ? "Ditutup" : props.days === 1 ? "Berakhir besok" : `${props.days} hari lagi`));
</script>

<template>
  <UiChip :tone="tone" :size="size" icon="clock">{{ label }}</UiChip>
</template>
