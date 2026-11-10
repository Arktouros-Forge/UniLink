<script setup>
import { competitionSort } from "@app/constants/options.json";
import { competitions as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Kompetisi" });
const { data: categories } = await useCategoryOptions();
const category = ref("all");
const sort = ref("deadline");
const { query, debounced, page } = useSearchPage([category, sort]);
const categoryFilter = computed(() => [{ value: "all", label: copy.allCategories }, ...categories.value.map((item) => ({ value: item.id, label: item.name }))]);
const { data, pending } = await useApiData("competitions", "/student/competitions", {
  query: () => ({ q: debounced.value || undefined, categoryId: category.value === "all" ? undefined : category.value, sort: sort.value, state: "open", page: page.value, limit: 6 }),
  default: () => ({ competitions: [], pagination: { totalPages: 1 } }),
  watch: [debounced, category, sort, page],
});
</script>

<template>
  <PageHeading :title="copy.title" :text="copy.text">
    <UiButton icon="plus" to="/student/competitions/new">{{ copy.create }}</UiButton>
  </PageHeading>
  <div class="flex flex-col gap-3 md:flex-row md:items-center">
    <SearchBar v-model="query" :placeholder="copy.search" />
    <FilterSelect v-model="category" :options="categoryFilter" icon="filter" />
    <FilterSelect v-model="sort" :options="competitionSort" variant="text" />
  </div>
  <AutoSkeleton :loading="pending" id="competition-list">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
      <CompetitionCard v-for="item in data.competitions" :key="item.id" :item="item" />
    </div>
    <UiEmpty v-if="!data.competitions.length" :title="copy.emptyTitle" :text="copy.emptyText" icon="trophy" />
  </AutoSkeleton>
  <UiPagination v-if="data.pagination.totalPages > 1" v-model="page" :pages="data.pagination.totalPages" />
</template>
