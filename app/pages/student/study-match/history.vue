<script setup>
import { history as copy } from "@app/constants/student.json";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Riwayat belajar",
});
const { data, pending } = await useApiData(
    "study-history",
    "/student/study-match/history",
    {
        query: { limit: 50 },
        default: () => ({ history: [] }),
    },
);
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text">
        <UiButton
            size="sm"
            variant="secondary"
            to="/student/study-match/requests"
            >{{ copy.back }}</UiButton
        >
    </PageHeading>
    <AutoSkeleton :loading="pending" id="history-list">
        <div class=":uno: flex flex-col gap-4">
            <RequestRow
                v-for="item in data.history"
                :key="item.id"
                :item="item"
            />
            <UiEmpty
                v-if="!data.history.length"
                :title="copy.emptyTitle"
                icon="clock"
            />
        </div>
    </AutoSkeleton>
</template>
