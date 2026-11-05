<script setup>
import { helpers, skillOptions } from "@app/constants/mock/people.json";
import { sortOptions } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Study Match" });
const { pending } = useMock("study-match", { helpers });

const query = ref("");
const cohort = ref("all");
const sort = ref("newest");
const active = ref(["Python", "Algoritma"]);
const target = ref(null);
const sent = ref(false);

const cohortOptions = [
    { value: "all", label: "Semua angkatan" },
    ...[2022, 2023, 2024].map((year) => ({
        value: String(year),
        label: `Angkatan ${year}`,
    })),
];
const list = computed(() => {
    const found = helpers.filter(
        (item) =>
            (item.name + item.skills.join(" "))
                .toLowerCase()
                .includes(query.value.toLowerCase()) &&
            (cohort.value === "all" || String(item.cohort) === cohort.value),
    );
    return sort.value === "newest" ? found : [...found].reverse();
});
const onSent = () => {
    target.value = null;
    sent.value = true;
};
</script>

<template>
    <PageHeading
        title="Study Match"
        text="Temukan rekan yang cocok dengan hal yang ingin kamu pelajari."
    />
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar
            v-model="query"
            placeholder="Cari Python, algoritma, desain UI..."
        />
        <FilterSelect v-model="cohort" :options="cohortOptions" icon="filter" />
        <FilterSelect v-model="sort" :options="sortOptions" variant="text" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
        <UiChip
            v-for="skill in active"
            :key="skill"
            removable
            @remove="active = active.filter((item) => item !== skill)"
            >{{ skill }}</UiChip
        >
        <span class="t-body-s text-ink-2">{{ list.length }} teman cocok</span>
    </div>
    <UiCallout v-if="sent" title="Permintaan terkirim." tone="info"
        >Kamu akan diberi tahu saat ada tanggapan.</UiCallout
    >
    <AutoSkeleton :loading="pending" id="study-match-results">
        <div class="grid gap-6 md:grid-cols-2">
            <HelperCard
                v-for="(item, index) in list.slice(0, 2)"
                :key="item.id"
                :item="item"
                @request="target = $event"
            />
        </div>

        <UiEmpty
            v-if="!list.length"
            title="Belum ada yang cocok"
            text="Coba kata kunci lain atau pasang tanda bantuan."
            icon="search"
        />
    </AutoSkeleton>
    <RequestHelpModal
        :open="!!target"
        :helper="target"
        @close="target = null"
        @sent="onSent"
    />
</template>
