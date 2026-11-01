<script setup>
import { useCompetitionsStore } from "@app/stores/competitions";

defineProps({
  team: { type: Object, required: true },
});

const competitions = useCompetitionsStore();
</script>

<template>
  <AppCard :to="`/student/competitions/teams/${team.id}`">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="type-h3">{{ team.name }}</h3>
        <p class="type-small mt-1 text-mute">{{ team.description }}</p>
      </div>
      <AppChip tone="brand">{{ competitions.acceptedCount(team) }} / {{ team.maxMembers }}</AppChip>
    </div>
  </AppCard>
</template>
