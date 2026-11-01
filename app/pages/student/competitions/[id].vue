<script setup>
import { useCompetitionsStore } from "@app/stores/competitions";
import { useReferenceStore } from "@app/stores/reference";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";
import { formatDeadline } from "@app/utils/format";

definePageMeta({ layout: "student" });

const route = useRoute();
const competitions = useCompetitionsStore();
const reference = useReferenceStore();
const auth = useAuthStore();
const ui = useUiStore();

const competition = computed(() => competitions.competitions.find((item) => item.id === route.params.id));
if (!competition.value) throw createError({ statusCode: 404, statusMessage: "Kompetisi tidak ditemukan" });

const teams = computed(() => competitions.teamsFor(competition.value.id));
const myTeam = computed(() => competitions.teamOf(competition.value.id, auth.currentId));
const closed = computed(() => competitions.isClosed(competition.value));
const modal = ref(false);
const form = reactive({ name: "", description: "" });

const create = async () => {
  const team = competitions.createTeam({ competitionId: competition.value.id, name: form.name, description: form.description, maxMembers: competition.value.maxTeamSize || 10 }, auth.currentId);
  modal.value = false;
  ui.notify("Tim dibuat", "good");
  await navigateTo(`/student/competitions/teams/${team.id}`);
};
</script>

<template>
  <div class="grid gap-6">
    <NuxtLink to="/student/competitions" class="type-small flex items-center gap-1 text-mute"><span class="i-keyline-arrow-left" />Kembali</NuxtLink>
    <NuxtImg v-if="competition.imageUrl" :src="competition.imageUrl" :alt="competition.title" class="h-56 w-full rounded-[8px] object-cover" />
    <header class="grid gap-3">
      <div class="flex flex-wrap gap-1.5">
        <AppChip v-for="id in competition.categoryIds" :key="id">{{ reference.categoriesById[id]?.name }}</AppChip>
        <AppChip tone="outline">{{ competition.level }}</AppChip>
        <AppChip v-if="closed" tone="red">Ditutup</AppChip>
      </div>
      <h1 class="type-h1">{{ competition.title }}</h1>
      <p class="type-body text-mute">{{ competition.host }} · {{ formatDeadline(competition.deadline) }}</p>
      <p class="type-body">{{ competition.description }}</p>
      <div class="flex flex-wrap gap-2">
        <AppButton v-if="myTeam" :to="`/student/competitions/teams/${myTeam.id}`">Lihat timku</AppButton>
        <AppButton v-else-if="!closed" @click="modal = true"><span class="i-keyline-plus" />Buat tim</AppButton>
        <AppButton v-if="competition.sourceUrl" :href="competition.sourceUrl" variant="secondary"><span class="i-keyline-arrow-up-right" />Sumber resmi</AppButton>
      </div>
    </header>

    <section>
      <SectionTitle title="Tim terdaftar" />
      <div class="grid gap-4 md:grid-cols-2">
        <TeamCard v-for="team in teams" :key="team.id" :team="team" />
      </div>
      <AppEmpty v-if="!teams.length" title="Belum ada tim" text="Jadilah yang pertama membuat tim." icon="i-keyline-users" />
    </section>

    <AppModal v-model="modal" title="Buat tim">
      <form class="grid gap-4" @submit.prevent="create">
        <AppInput v-model="form.name" label="Nama tim" required />
        <AppInput v-model="form.description" label="Deskripsi" as="textarea" :rows="3" />
        <AppButton type="submit" block>Buat tim</AppButton>
      </form>
    </AppModal>
  </div>
</template>
