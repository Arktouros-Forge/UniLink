<script setup>
import { teamResult } from "@app/constants/options.json";
import { useCompetitionsStore } from "@app/stores/competitions";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const route = useRoute();
const competitions = useCompetitionsStore();
const auth = useAuthStore();
const ui = useUiStore();

const team = computed(() => competitions.teams.find((item) => item.id === route.params.id));
if (!team.value) throw createError({ statusCode: 404, statusMessage: "Tim tidak ditemukan" });

const competition = computed(() => competitions.competitions.find((item) => item.id === team.value.competitionId));
const isOwner = computed(() => team.value.creatorId === auth.currentId);
const membership = computed(() => team.value.members.find((member) => member.userId === auth.currentId));
const full = computed(() => competitions.acceptedCount(team.value) >= team.value.maxMembers);
const resultOptions = Object.entries(teamResult).map(([value, item]) => ({ value, label: item.label }));

const join = () => {
  competitions.requestJoin(team.value.id, auth.currentId);
  ui.notify("Permintaan bergabung terkirim", "good");
};
</script>

<template>
  <div class="grid max-w-2xl gap-6">
    <NuxtLink :to="`/student/competitions/${competition.id}`" class="type-small flex items-center gap-1 text-mute">
      <span class="i-keyline-arrow-left" />{{ competition.title }}
    </NuxtLink>
    <header class="grid gap-2">
      <div class="flex items-center gap-3">
        <h1 class="type-h1">{{ team.name }}</h1>
        <StatusChip group="teamResult" :value="team.result" />
      </div>
      <p class="type-body text-mute">{{ team.description }}</p>
      <p class="type-meta text-mute">{{ competitions.acceptedCount(team) }} / {{ team.maxMembers }} anggota</p>
    </header>

    <AppButton v-if="!membership && !full" class="w-fit" @click="join">Minta bergabung</AppButton>
    <p v-else-if="membership?.status === 'pending'" class="type-small text-mute">Permintaanmu menunggu persetujuan.</p>

    <AppCard class="divide-y divide-rule">
      <MemberRow v-for="member in team.members" :key="member.userId" :member="member">
        <template v-if="isOwner && member.userId !== team.creatorId">
          <AppButton v-if="member.status === 'pending'" size="sm" @click="competitions.acceptMember(team.id, member.userId)">Terima</AppButton>
          <AppButton variant="ghost" size="sm" aria-label="Keluarkan" @click="competitions.removeMember(team.id, member.userId)"><span class="i-keyline-x" /></AppButton>
        </template>
      </MemberRow>
    </AppCard>

    <AppCard v-if="isOwner" class="grid gap-3">
      <h2 class="type-h3">Hasil kompetisi</h2>
      <AppInput :model-value="team.result" as="select" :options="resultOptions" @update:model-value="competitions.reportResult(team.id, $event)" />
    </AppCard>
  </div>
</template>
