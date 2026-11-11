<script setup>
import { semester } from "@app/constants/site.json";
import { formatToday } from "@app/utils/format";

defineProps({
  root: { type: String, required: true },
  page: { type: String, required: true },
});
</script>

<template>
  <header class=":uno: hidden lg:flex items-center justify-between h-[72px] px-10 border-b border-hairline">
    <p class=":uno: t-body-s text-ink-2 m-0">{{ root }} / {{ page }}</p>
    <div class=":uno: flex items-center gap-3">
      <span class=":uno: t-mono-s text-ink">{{ formatToday() }}</span>
      <UiChip tone="neutral" size="md">{{ semester }}</UiChip>
    </div>
  </header>
</template>
