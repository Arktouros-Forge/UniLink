<script setup>
import { competitions, teams } from "@app/constants/mock/competitions.json";
import { team as teamSchema } from "@app/constants/forms.json";
import { statusTone } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const route = useRoute();
const item = computed(() => competitions.find((entry) => entry.id === Number(route.params.id)) || competitions[0]);
const list = computed(() => teams.filter((entry) => entry.competition === item.value.id));
const { pending } = useMock(`competition-${route.params.id}`, { item: item.value });
const open = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6">
    <NuxtLink to="/student/competitions" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />Kompetisi</NuxtLink>
    <AutoSkeleton :loading="pending" id="competition-detail">
      <div class="card !p-0 overflow-hidden">
        <span class="block h-1.5 bg-brand-red" />
        <NuxtImg v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-56 object-cover" />
        <div class="p-6 flex flex-col gap-4">
          <div class="flex flex-wrap gap-2">
            <UiChip v-for="category in item.categories" :key="category" tone="blue">{{ category }}</UiChip>
            <UiChip :tone="statusTone[item.status].tone">{{ statusTone[item.status].label }}</UiChip>
          </div>
          <h1 class="type-h1">{{ item.title }}</h1>
          <p class="type-body">{{ item.about }}</p>
          <div class="flex flex-wrap gap-6 type-small">
            <span><span class="i-keyline-icons-building mr-1.5" />{{ item.host }}</span>
            <span><span class="i-keyline-icons-calendar mr-1.5" />{{ item.deadline }}</span>
          </div>
          <div class="flex flex-wrap gap-3">
            <button class="btn-primary" :disabled="item.status !== 'open'" @click="open = true"><span class="i-keyline-icons-plus" />Buat tim</button>
            <a :href="item.source" target="_blank" rel="noopener" class="btn-secondary"><span class="i-keyline-icons-arrow-up-right" />Situs resmi</a>
          </div>
        </div>
      </div>
    </AutoSkeleton>
    <h2 class="type-h2">Tim terbuka</h2>
    <AutoSkeleton :loading="pending" id="competition-teams">
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink v-for="team in list" :key="team.id" :to="`/student/competitions/teams/${team.id}`" class="card flex flex-col gap-2 hover:border-brand-blue">
          <h3 class="type-h3">{{ team.name }}</h3>
          <p class="type-small">{{ team.idea }}</p>
          <p class="type-meta">{{ team.members.length }}/{{ team.max }} anggota · Ketua {{ team.leader }}</p>
        </NuxtLink>
      </div>
      <UiEmpty v-if="!list.length" title="Belum ada tim" text="Jadilah yang pertama membuat tim." icon="i-keyline-icons-users" />
    </AutoSkeleton>
    <UiModal :open="open" title="Buat tim" @close="open = false">
      <FieldsForm :schema="teamSchema" submit-label="Buat tim" cancel-label="Batal" @submit="open = false" @cancel="open = false" />
    </UiModal>
  </div>
</template>
