<script setup>
import { competitions, teams } from "@app/constants/mock/competitions.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Detail kompetisi" });
const route = useRoute();
const item = computed(() => competitions.find((entry) => entry.id === Number(route.params.id)) || competitions[0]);
const { pending } = useMock(`competition-${route.params.id}`, { item: item.value });
const list = computed(() => teams.filter((team) => team.competition === item.value.title));
</script>

<template>
  <UiButton to="/student/competitions" variant="link" icon="arrowLeft" class="self-start">Kompetisi</UiButton>
  <AutoSkeleton :loading="pending" id="competition-detail">
    <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
      <UiCard padding="p-0" class="overflow-hidden">
        <div class="relative h-[200px] md:h-[256px] p-6 flex flex-col gap-2 overflow-hidden" :class="item.tint === 'yellow' ? 'bg-yellow-soft' : 'bg-blue-soft'">
          <NuxtImg v-if="item.image" :src="item.image" :alt="item.title" class="absolute inset-0 size-full object-cover" />
          <template v-else>
            <p class="t-mono-s text-ink m-0">{{ item.label }}</p>
            <h1 class="t-d2 text-ink m-0 max-w-[60%] !text-[28px] md:!text-[36px]">{{ item.title }}</h1>
            <span class="absolute right-0 top-0 w-[26%] h-[40%] border-2 border-outline" :class="item.tint === 'yellow' ? 'bg-yellow' : 'bg-blue'" />
            <span class="absolute right-[10%] top-[52%] w-[20%] h-[26%] bg-red border-2 border-outline" />
          </template>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex flex-wrap gap-2"><UiChip v-for="category in item.categories" :key="category" tone="blue">{{ category }}</UiChip></div>
          <p class="t-body-m text-ink m-0">{{ item.about }}</p>
          <p class="t-body-s text-ink-2 m-0">Diselenggarakan oleh {{ item.host }}</p>
          <p class="t-mono-s text-ink m-0">Tenggat · {{ item.deadline }}</p>
          <div class="flex flex-wrap gap-3">
            <UiButton icon="external" :href="item.source">Situs resmi</UiButton>
            <UiButton variant="secondary" icon="users" to="/student/teams">Buat tim</UiButton>
          </div>
        </div>
      </UiCard>
      <div class="flex flex-col gap-4">
        <h2 class="t-d4 text-ink m-0">Tim mencari anggota</h2>
        <UiCard v-for="team in list" :key="team.id" padding="p-4" class="flex flex-col gap-2" hover>
          <p class="t-label text-ink m-0">{{ team.name }}</p>
          <p class="t-body-s text-ink-2 m-0">{{ team.members.length }} dari {{ team.capacity }} anggota</p>
          <UiButton variant="link" size="sm" icon-end="arrowRight" :to="`/student/teams/${team.id}`" class="self-start">Lihat tim</UiButton>
        </UiCard>
        <UiEmpty v-if="!list.length" title="Belum ada tim" icon="users" />
      </div>
    </div>
  </AutoSkeleton>
</template>
