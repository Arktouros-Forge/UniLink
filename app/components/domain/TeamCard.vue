<script setup>
import { teams as copy } from "@app/constants/student.json";

defineProps({ team: { type: Object, required: true } });
</script>

<template>
  <UiCard padding="p-4" hover class="flex flex-col gap-3">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="t-label text-ink m-0 truncate">{{ team.name }}</p>
        <p class="t-body-xs text-ink-2 m-0">{{ team.members.length }} {{ copy.ofWord }} {{ team.maxMembers ?? "∞" }} {{ copy.members }}</p>
      </div>
      <UiChip v-if="team.isFull" tone="neutral">Penuh</UiChip>
    </div>
    <RosterSlots :members="team.members" :capacity="team.maxMembers ?? team.members.length" :size="32" />
    <p v-if="team.description" class="t-body-xs text-ink-2 m-0">{{ team.description }}</p>
    <div class="flex flex-wrap gap-2"><slot /></div>
  </UiCard>
</template>
