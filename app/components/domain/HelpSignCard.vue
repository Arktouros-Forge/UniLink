<script setup>
import { helpBoard as copy } from "@app/constants/student.json";
import { formatDeadline } from "@app/utils/format";

defineProps({ item: { type: Object, required: true }, mine: { type: Boolean, default: false } });
</script>

<template>
  <UiCard as="article" class="flex flex-col gap-3" hover>
    <div class="flex items-center justify-between gap-2">
      <UiChip tone="blue">{{ item.skill.name }}</UiChip>
      <UiChip :tone="item.status === 'open' ? 'success' : 'neutral'">{{ copy[item.status] }}</UiChip>
    </div>
    <h3 class="t-d4 text-ink m-0">{{ item.title }}</h3>
    <p class="t-body-s text-ink-2 m-0">{{ item.description }}</p>
    <div class="flex items-center justify-between gap-3">
      <span class="t-mono-s text-ink-2">{{ formatDeadline(item.expiresAt) }} · {{ item.offerCount }} {{ copy.responses }}</span>
      <UiButton variant="secondary" size="sm" icon-end="arrowRight" :to="`/student/help-board/${item.id}`">{{ mine ? copy.manage : copy.view }}</UiButton>
    </div>
  </UiCard>
</template>
