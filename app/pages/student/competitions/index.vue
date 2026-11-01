<script setup>
import { useCompetitionsStore } from "@app/stores/competitions";
import { useReferenceStore } from "@app/stores/reference";

definePageMeta({ layout: "student" });

const competitions = useCompetitionsStore();
const reference = useReferenceStore();
const categoryId = ref("");
const query = ref("");

const list = computed(() =>
  competitions
    .published()
    .filter((item) => !categoryId.value || item.categoryIds.includes(categoryId.value))
    .filter((item) => item.title.toLowerCase().includes(query.value.toLowerCase())),
);
</script>

<template>
  <div>
    <PageHeading title="Kompetisi" text="Temukan lomba dan bentuk timmu." />
    <div class="mb-6 grid gap-3 sm:grid-cols-2">
      <AppInput v-model="query" placeholder="Cari kompetisi" />
      <AppInput v-model="categoryId" as="select" :options="[{ value: '', label: 'Semua kategori' }, ...reference.categories.map((item) => ({ value: item.id, label: item.name }))]" />
    </div>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <CompetitionCard v-for="item in list" :key="item.id" :competition="item" />
    </div>
    <AppEmpty v-if="!list.length" title="Tidak ada kompetisi" icon="i-keyline-trophy" />
  </div>
</template>
