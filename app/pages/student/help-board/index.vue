<script setup>
import { signs } from "@app/constants/mock/study.json";
import { skillOptions } from "@app/constants/mock/people.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({
    layout: "student",
    middleware: "auth",
    title: "Papan bantuan",
});
const { pending } = useMock("help-board", { signs });
const query = ref("");
const skill = ref("all");
const skillFilter = [
    { value: "all", label: "Semua keahlian" },
    ...skillOptions.map((item) => ({ value: item, label: item })),
];
const list = computed(() =>
    signs.filter(
        (item) =>
            item.title.toLowerCase().includes(query.value.toLowerCase()) &&
            (skill.value === "all" || item.skill === skill.value),
    ),
);
</script>

<template>
    <PageHeading
        title="Papan bantuan"
        text="Tanda bantuan dari teman kampus. Tanggapi yang bisa kamu bantu."
    >
        <UiButton variant="secondary" to="/student/help-board/mine"
            >Tanda saya</UiButton
        >
        <UiButton icon="plus" to="/student/help-board/new"
            >Pasang tanda</UiButton
        >
    </PageHeading>
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar v-model="query" placeholder="Cari tanda bantuan..." />
        <FilterSelect v-model="skill" :options="skillFilter" icon="filter" />
    </div>
    <AutoSkeleton :loading="pending" id="help-board-list">
        <div class="grid gap-6 md:grid-cols-2">
            <HelpSignCard v-for="item in list" :key="item.id" :item="item" />
        </div>
        <UiEmpty
            v-if="!list.length"
            title="Belum ada tanda bantuan"
            text="Pasang tandamu sendiri agar teman bisa menemukanmu."
            icon="flag"
        />
    </AutoSkeleton>
</template>
