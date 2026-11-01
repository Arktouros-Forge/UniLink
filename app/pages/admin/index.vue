<script setup>
import { requestStatus } from "@app/constants/options.json";
import { useUsersStore } from "@app/stores/users";
import { useCompetitionsStore } from "@app/stores/competitions";
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { useReferenceStore } from "@app/stores/reference";

definePageMeta({ layout: "admin" });

const users = useUsersStore();
const competitions = useCompetitionsStore();
const studyMatch = useStudyMatchStore();
const reference = useReferenceStore();

const statusBars = computed(() =>
  Object.entries(requestStatus).map(([key, item]) => ({ label: item.label, value: studyMatch.requests.filter((request) => request.status === key).length })),
);
const skillBars = computed(() =>
  reference.skills
    .map((skill) => ({ label: skill.name, value: users.students.filter((user) => user.skillIds.includes(skill.id)).length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6),
);
const categoryBars = computed(() =>
  reference.categories.map((category) => ({ label: category.name, value: competitions.competitions.filter((item) => item.categoryIds.includes(category.id)).length })),
);
</script>

<template>
  <div>
    <PageHeading title="Analitik" text="Ringkasan aktivitas UniLink." />
    <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <AppStat label="Mahasiswa" :value="users.students.length" icon="i-keyline-users" to="/admin/users" />
      <AppStat label="Kompetisi" :value="competitions.competitions.length" icon="i-keyline-trophy" to="/admin/competitions" />
      <AppStat label="Help Sign terbuka" :value="studyMatch.openSigns.length" icon="i-keyline-flag" />
      <AppStat label="Permintaan" :value="studyMatch.requests.length" icon="i-keyline-inbox" />
    </div>
    <div class="grid gap-6 lg:grid-cols-3">
      <AppCard><SectionTitle title="Status permintaan" /><BarList :items="statusBars" /></AppCard>
      <AppCard><SectionTitle title="Keahlian terbanyak" /><BarList :items="skillBars" /></AppCard>
      <AppCard><SectionTitle title="Kompetisi per kategori" /><BarList :items="categoryBars" /></AppCard>
    </div>
  </div>
</template>
