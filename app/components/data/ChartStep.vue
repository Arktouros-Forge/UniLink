<script setup>
const props = defineProps({
  rows: { type: Array, required: true },
  height: { type: Number, default: 120 },
});
const width = 400;
const peak = computed(() => Math.max(...props.rows.map((row) => row.value)));
const path = computed(() => {
  const step = width / props.rows.length;
  return props.rows
    .map((row, index) => {
      const y = props.height - (row.value / peak.value) * (props.height - 8);
      return `${index === 0 ? "M" : "H"}${index * step} ${index === 0 ? y : ""}${index === 0 ? "" : `V${y}`}`;
    })
    .join(" ")
    .concat(` H${width}`);
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none" class="w-full" :style="{ height: `${height}px` }">
      <line :x1="0" :x2="width" :y1="height" :y2="height" stroke="var(--hairline)" stroke-width="1" />
      <path :d="path" fill="none" stroke="var(--brand-blue)" stroke-width="2" vector-effect="non-scaling-stroke" />
    </svg>
    <div class="flex">
      <span v-for="row in rows" :key="row.label" class="flex-1 text-center t-mono-s text-ink">{{ row.label }}</span>
    </div>
  </div>
</template>
