<script setup>
import { admin } from "@app/constants/student.json";

const copy = admin.dash;
definePageMeta({ layout: "admin", access: "admin", title: "Dasbor admin" });
const { data, pending } = await useApiData(
    "admin-dashboard",
    "/admin/dashboard",
    {
        default: () => ({ totals: {}, signups: [], requestStatus: [] }),
    },
);

const pad = (value) => String(value ?? 0).padStart(2, "0");
const stats = computed(() => [
    {
        label: copy.students,
        value: pad(data.value.totals.students),
        trend: `${data.value.totals.activeWeek ?? 0} ${copy.activeWeek}`,
    },
    {
        label: copy.competitions,
        value: pad(data.value.totals.openCompetitions),
        trend: `${data.value.totals.competitions ?? 0} total`,
    },
    {
        label: copy.requests,
        value: pad(data.value.totals.requests),
        trend: `${data.value.totals.teams ?? 0} ${copy.teams}`,
    },
]);
const monthLabel = (month) =>
    new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
        new Date(`${month}-01`),
    );
const signups = computed(() =>
    data.value.signups.map((row) => ({
        label: monthLabel(row.month),
        value: row.count,
    })),
);
const statuses = computed(() =>
    data.value.requestStatus.map((row) => ({
        label: copy.statusLabels[row.status] ?? row.status,
        value: row.count,
    })),
);
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text" />
    <AutoSkeleton :loading="pending" id="admin-stats">
        <div
            class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3 md:gap-6"
        >
            <StatCard v-for="item in stats" :key="item.label" v-bind="item" />
        </div>
    </AutoSkeleton>
    <AutoSkeleton :loading="pending" id="admin-charts">
        <div class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <UiCard class=":uno: flex flex-col gap-6">
                <h2 class=":uno: t-d4 text-ink m-0">{{ copy.signups }}</h2>
                <ChartBars v-if="signups.length" :rows="signups" />
            </UiCard>
            <UiCard class=":uno: flex flex-col gap-6">
                <h2 class=":uno: t-d4 text-ink m-0">{{ copy.status }}</h2>
                <ChartBars v-if="statuses.length" :rows="statuses" />
            </UiCard>
        </div>
    </AutoSkeleton>
    <UiCard class=":uno: flex flex-col gap-4">
        <h2 class=":uno: t-d4 text-ink m-0">{{ copy.reviewTitle }}</h2>
        <p class=":uno: t-body-s text-ink m-0">{{ copy.reviewText }}</p>
        <UiButton
            size="sm"
            icon-end="arrowRight"
            to="/admin/competitions"
            class=":uno: self-start"
            >{{ copy.reviewAction }}</UiButton
        >
    </UiCard>
</template>
