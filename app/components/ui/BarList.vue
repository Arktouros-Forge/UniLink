<script setup>
const props = defineProps({
  items: { type: Array, required: true },
});

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)));
</script>

<template>
  <ul class="grid gap-3">
    <li v-for="item in items" :key="item.label" class="grid gap-1">
      <div class="type-small flex justify-between">
        <span>{{ item.label }}</span>
        <span class="font-medium">{{ item.value }}</span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-soft">
        <div class="h-full rounded-full bg-brand-blue" :style="{ width: `${(item.value / max) * 100}%` }" />
      </div>
    </li>
  </ul>
</template>
