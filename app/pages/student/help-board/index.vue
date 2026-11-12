<script setup>
import { helpBoard as copy } from "@app/constants/student.json";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Papan bantuan",
});
const { data: skillOptions } = await useSkillOptions();
const skill = ref("all");
const { query, debounced, page } = useSearchPage([skill]);
const skillFilter = computed(() => [
    { value: "all", label: copy.allSkills },
    ...skillOptions.value.map((item) => ({ value: item.id, label: item.name })),
]);
const { data, pending } = await useApiData(
    "help-board",
    "/student/study-match/help-signs",
    {
        query: () => ({
            scope: "board",
            q: debounced.value || undefined,
            skillId: skill.value === "all" ? undefined : skill.value,
            page: page.value,
            limit: 8,
        }),
        default: () => ({ signs: [], pagination: { totalPages: 1 } }),
        watch: [debounced, skill, page],
    },
);
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text">
        <UiButton size="sm" variant="secondary" to="/student/help-board/mine">{{
            copy.mine
        }}</UiButton>
        <UiButton size="sm" icon="plus" to="/student/help-board/new">{{
            copy.post
        }}</UiButton>
    </PageHeading>
    <div class=":uno: flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar v-model="query" :placeholder="copy.search" />
        <FilterSelect v-model="skill" :options="skillFilter" icon="filter" />
    </div>
    <AutoSkeleton :loading="pending" id="help-board-list">
        <div class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <HelpSignCard
                v-for="item in data.signs"
                :key="item.id"
                :item="item"
            />
        </div>
        <UiEmpty
            v-if="!data.signs.length"
            :title="copy.emptyTitle"
            :text="copy.emptyText"
            icon="flag"
        />
    </AutoSkeleton>
    <UiPagination
        v-if="data.pagination.totalPages > 1"
        v-model="page"
        :pages="data.pagination.totalPages"
    />
</template>
