<script setup>
import { competitions } from "@app/constants/mock/competitions.json";
import { categoryOptions } from "@app/constants/mock/people.json";
import { sortOptions } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Kompetisi" });
const { pending } = useMock("competitions", { competitions });
const query = ref("");
const category = ref("all");
const sort = ref("newest");
const categoryFilter = [{ value: "all", label: "Semua kategori" }, ...categoryOptions.map((item) => ({ value: item, label: item }))];
const list = computed(() => {
  const found = competitions.filter((item) => (item.title + item.host).toLowerCase().includes(query.value.toLowerCase()) && (category.value === "all" || item.categories.includes(category.value)));
  return sort.value === "newest" ? found : [...found].reverse();
});
</script>

<template>
  <PageHeading title="Kompetisi" text="Informasi kompetisi dari admin dan mahasiswa. Periksa selalu tautan resmi.">
    <UiButton icon="plus" to="/student/competitions/new">Buat kompetisi</UiButton>
  </PageHeading>
  <div class="flex flex-col gap-3 md:flex-row md:items-center">
    <SearchBar v-model="query" placeholder="Cari kompetisi atau penyelenggara..." />
    <FilterSelect v-model="category" :options="categoryFilter" icon="filter" />
    <FilterSelect v-model="sort" :options="sortOptions" variant="text" />
  </div>
  <AutoSkeleton :loading="pending" id="competition-list">
    <div class="grid gap-6 md:grid-cols-2">
      <CompetitionCard v-for="item in list" :key="item.id" :item="item" />
    </div>
    <UiEmpty v-if="!list.length" title="Belum ada kompetisi" text="Coba kategori lain." icon="trophy" />
  </AutoSkeleton>
</template>
