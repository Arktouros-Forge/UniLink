<script setup>
import { competitions } from "@app/constants/mock/competitions.json";
import { categories } from "@app/constants/mock/people.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const { pending } = useMock("competitions", { competitions });
const category = ref("");
const query = ref("");
const list = computed(() =>
  competitions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.value.toLowerCase()) &&
      (!category.value || item.categories.includes(category.value)),
  ),
);
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Kompetisi" text="Temukan lomba, bentuk tim, dan laporkan hasilnya." meta="Competition Match" />
    <div class="flex flex-col gap-3 md:flex-row">
      <div class="relative flex-1">
        <span class="i-keyline-icons-search absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input v-model="query" class="field pl-10" placeholder="Cari kompetisi" />
      </div>
      <select v-model="category" class="field md:max-w-[240px]">
        <option value="">Semua kategori</option>
        <option v-for="item in categories" :key="item.id" :value="item.name">{{ item.name }}</option>
      </select>
    </div>
    <AutoSkeleton :loading="pending" id="competition-list">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CompetitionCard v-for="item in list" :key="item.id" :item="item" />
      </div>
      <UiEmpty v-if="!list.length" title="Belum ada kompetisi" text="Coba kategori lain." icon="i-keyline-icons-trophy" />
    </AutoSkeleton>
  </div>
</template>
