<script setup>
defineProps({
  title: { type: String, default: "" },
  tone: { type: String, default: "neutral" },
});
</script>

<template>
  <aside class="border-l-2 px-4 py-3 flex flex-col gap-1" :class="{ info: 'border-blue bg-blue-soft', danger: 'border-danger bg-danger-soft' }[tone] ?? 'border-blue bg-hairline'">
    <p v-if="title" class="t-label text-ink m-0">{{ title }}</p>
    <div class="t-body-s text-ink-2"><slot /></div>
  </aside>
</template>
