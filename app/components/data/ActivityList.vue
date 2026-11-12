<script setup>
defineProps({ items: { type: Array, required: true }, empty: { type: String, default: "Belum ada aktivitas." } });
const tones = { blue: "bg-blue-soft text-blue", yellow: "bg-yellow-soft text-ink", red: "bg-red-soft text-danger", success: "bg-success-soft text-ink" };
</script>

<template>
  <ul v-if="items.length" class=":uno: m-0 p-0 list-none flex flex-col divide-y divide-hairline">
    <li v-for="item in items" :key="item.title" class=":uno: flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span class=":uno: size-9 shrink-0 inline-flex items-center justify-center rounded-md" :class="tones[item.tone || ':uno: blue']"><UiIcon :name="item.icon" size="text-xl" /></span>
      <div class=":uno: min-w-0 flex-1">
        <p class=":uno: t-body-s text-ink m-0 truncate">{{ item.title }}</p>
        <p v-if="item.meta" class=":uno: t-body-xs text-ink-2 m-0">{{ item.meta }}</p>
      </div>
      <UiChip v-if="item.status" :tone="item.statusTone || 'neutral'">{{ item.status }}</UiChip>
    </li>
  </ul>
  <p v-else class=":uno: t-body-s text-ink-2 m-0">{{ empty }}</p>
</template>
