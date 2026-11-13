<script setup>
import { studyMatch as copy } from "@app/constants/student.json";
import { years } from "@app/constants/options.json";

definePageMeta({ layout: "student", access: "student", title: "Study Match" });
const { data: skillOptions } = await useSkillOptions();

const year = ref("all");
const skillId = ref("all");
const { query, debounced, page } = useSearchPage([year, skillId]);
const target = ref(null);

const yearOptions = [
    { value: "all", label: copy.allCohorts },
    ...years.map((item) => ({
        value: String(item),
        label: `${copy.cohort} ${item}`,
    })),
];
const skillFilterOptions = computed(() => [
    { value: "all", label: copy.skillFilter },
    ...skillOptions.value.map((item) => ({ value: item.id, label: item.name })),
]);

const { data, pending } = await useApiData(
    "study-match-search",
    "/student/study-match/search",
    {
        query: () => ({
            q: debounced.value || undefined,
            year: year.value === "all" ? undefined : year.value,
            skillIds: skillId.value === "all" ? undefined : skillId.value,
            page: page.value,
            limit: 8,
        }),
        default: () => ({ items: [], pagination: { total: 0, totalPages: 1 } }),
        watch: [debounced, year, skillId, page],
    },
);

const onSent = () => {
    target.value = null;
};
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text" />
    <div class=":uno: flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar v-model="query" :placeholder="copy.search" />
        <FilterSelect v-model="year" :options="yearOptions" icon="filter" />
        <FilterSelect
            v-model="skillId"
            :options="skillFilterOptions"
            variant="text"
        />
    </div>
    <p class=":uno: t-body-s text-ink-2 m-0">
        {{ data.pagination.total }} {{ copy.matches }}
    </p>
    <AutoSkeleton :loading="pending" id="study-match-results">
        <div class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <HelperCard
                v-for="item in data.items"
                :key="item.id"
                :item="item"
                @request="target = $event"
            />
        </div>
        <UiEmpty
            v-if="!data.items.length"
            :title="copy.emptyTitle"
            :text="copy.emptyText"
            icon="search"
        />
    </AutoSkeleton>
    <UiPagination
        v-if="data.pagination.totalPages > 1"
        v-model="page"
        :pages="data.pagination.totalPages"
    />
    <RequestHelpModal
        :open="!!target"
        :helper="target"
        @close="target = null"
        @sent="onSent"
    />
</template>
