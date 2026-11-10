<script setup>
const props = defineProps({
  rows: { type: Array, required: true },
  height: { type: Number, default: 120 },
});
const tones = ["bg-blue", "bg-red", "bg-yellow"];
const peak = computed(() => Math.max(...props.rows.map((row) => row.value)));
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-end gap-2 md:gap-4 border-b border-hairline" :style="{ height: `${height}px` }">
      <span v-for="(row, index) in rows" :key="row.label" class="flex-1 rounded-t-[2px]" :class="tones[index % 3]" :style="{ height: `${(row.value / peak) * 100}%` }" />
    </div>
    <div class="flex gap-2 md:gap-4">
      <span v-for="row in rows" :key="row.label" class="flex-1 min-w-0 truncate text-center t-mono-s text-ink">{{ row.label }}</span>
    </div>
  </div>
</template>
