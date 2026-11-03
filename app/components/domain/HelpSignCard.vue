<script setup>
defineProps({ item: { type: Object, required: true }, mine: { type: Boolean, default: false } });
</script>

<template>
  <UiCard as="article" class="flex flex-col gap-3" hover>
    <div class="flex items-center justify-between gap-2">
      <UiChip tone="blue">{{ item.skill }}</UiChip>
      <UiChip :tone="item.status === 'open' ? 'success' : 'neutral'">{{ item.status === "open" ? "Dibuka" : "Ditutup" }}</UiChip>
    </div>
    <h3 class="t-d4 text-ink m-0">{{ item.title }}</h3>
    <p class="t-body-s text-ink-2 m-0">{{ item.detail }}</p>
    <div class="flex items-center justify-between gap-3">
      <span class="t-mono-s text-ink-2">{{ item.expires }} · {{ item.responses }} tanggapan</span>
      <UiButton variant="secondary" size="sm" icon-end="arrowRight" :to="`/student/help-board/${item.id}`">{{ mine ? "Kelola" : "Lihat" }}</UiButton>
    </div>
  </UiCard>
</template>
