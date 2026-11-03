<script setup>
import { teams } from "@app/constants/mock/competitions.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Tim saya" });
const { pending } = useMock("teams", { teams });
</script>

<template>
  <PageHeading title="Tim saya" text="Tim kompetisi yang kamu ikuti atau kelola." />
  <AutoSkeleton :loading="pending" id="teams-list">
    <div class="grid gap-6 md:grid-cols-2">
      <UiCard v-for="team in teams" :key="team.id" class="flex flex-col gap-3" hover>
        <h2 class="t-d4 text-ink m-0">{{ team.name }}</h2>
        <p class="t-body-s text-ink-2 m-0">{{ team.competition }} / {{ team.track }}</p>
        <div class="flex gap-2"><UiChip tone="yellow" filled>{{ team.members.length }} dari {{ team.capacity }} anggota</UiChip><UiChip>Menerima permintaan</UiChip></div>
        <UiButton variant="secondary" size="sm" icon-end="arrowRight" :to="`/student/teams/${team.id}`" class="self-start">Lihat tim</UiButton>
      </UiCard>
    </div>
    <UiEmpty v-if="!teams.length" title="Belum bergabung dengan tim" icon="users"><UiButton to="/student/competitions">Jelajahi kompetisi</UiButton></UiEmpty>
  </AutoSkeleton>
</template>
