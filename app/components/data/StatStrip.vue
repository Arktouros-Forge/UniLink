<script setup>
defineProps({ items: { type: Array, required: true } });
</script>

<template>
  <div class=":uno: grid grid-cols-2 gap-px bg-hairline border border-hairline rounded-md overflow-hidden md:grid-flow-col md:auto-cols-fr">
    <div v-for="item in items" :key="item.label" class=":uno: bg-card px-4 py-3 flex flex-col gap-1">
      <p class=":uno: font-serif text-[40px] leading-10 text-ink m-0">{{ item.value }}</p>
      <p class=":uno: t-body-xs text-ink-2 m-0">{{ item.label }}</p>
    </div>
  </div>
</template>
