<script setup>
import { useAuthStore } from "@app/stores/auth";
import { dashboard as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "student", access: "student", title: "Dasbor" });
const auth = useAuthStore();
const { data, pending } = await useApiData(
    "student-dashboard",
    "/student/dashboard",
    {
        default: () => ({
            counts: {},
            pendingRequests: [],
            teams: [],
            tasks: [],
            activity: [],
        }),
    },
);
const firstName = computed(() => (auth.user?.name ?? "").split(" ")[0]);
const pad = (value) => String(value ?? 0).padStart(2, "0");
const stats = computed(() => [
    {
        label: copy.stats.requests,
        value: pad(data.value.counts.pendingRequests),
        trend: `${data.value.counts.helped ?? 0} ${copy.stats.helped}`,
    },
    {
        label: copy.stats.teams,
        value: pad(data.value.counts.activeTeams),
        trend:
            data.value.teams.map((team) => team.name).join(" · ") ||
            copy.stats.noTeams,
    },
    {
        label: copy.stats.tasks,
        value: pad(data.value.counts.openTasks),
        trend: `${data.value.counts.doneThisWeek ?? 0} ${copy.stats.done}`,
    },
]);
const extraRequests = computed(() =>
    data.value.pendingRequests.slice(1).map((item) => item.sender.fullName),
);
</script>

<template>
    <PageHeading :title="`${copy.greeting}, ${firstName}.`" :text="copy.text">
        <UiButton size="sm" icon="plus" to="/student/help-board/new">{{
            copy.post
        }}</UiButton>
    </PageHeading>
    <AutoSkeleton :loading="pending" id="dashboard-stats">
        <div
            class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3 md:gap-6"
        >
            <StatCard
                v-for="item in stats"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :trend="item.trend"
            />
        </div>
    </AutoSkeleton>
    <div
        class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 md:items-stretch"
    >
        <div class=":uno: flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-requests">
                <UiCard class=":uno: flex flex-col gap-4">
                    <h2 class=":uno: t-d4 text-ink m-0">
                        {{ copy.requestsTitle }}
                    </h2>
                    <UiEmpty
                        v-if="!data.pendingRequests.length"
                        :title="copy.requestsEmpty"
                    />
                    <template v-else>
                        <div class=":uno: flex items-center gap-4">
                            <UiAvatar
                                :name="data.pendingRequests[0].sender.fullName"
                                :size="40"
                            />
                            <div class=":uno: flex-1 min-w-0">
                                <p class=":uno: t-d4 text-ink m-0 !text-lg">
                                    {{
                                        data.pendingRequests[0].sender.fullName
                                    }}
                                </p>
                                <p class=":uno: t-body-s text-ink-2 m-0">
                                    {{ data.pendingRequests[0].subject }}
                                </p>
                            </div>
                            <UiButton
                                variant="secondary"
                                size="sm"
                                icon-end="arrowRight"
                                to="/student/study-match/requests"
                                >{{ copy.review }}</UiButton
                            >
                        </div>
                        <p
                            v-if="extraRequests.length"
                            class=":uno: t-body-s text-ink-2 m-0"
                        >
                            {{ extraRequests.join(", ") }}
                            {{ copy.alsoWaiting }}
                        </p>
                    </template>
                </UiCard>
            </AutoSkeleton>
            <AutoSkeleton :loading="pending" id="dashboard-team">
                <UiCard class=":uno: flex flex-col gap-4">
                    <h2 class=":uno: t-d4 text-ink m-0">
                        {{ copy.teamTitle }}
                    </h2>
                    <NuxtLink
                        v-for="team in data.teams"
                        :key="team.id"
                        :to="`/student/teams/${team.id}`"
                        class=":uno: t-body-s text-ink no-underline"
                    >
                        {{ team.name }} · {{ team.competitionTitle }} ·
                        {{ team.memberCount }}/{{ team.capacity }}
                        {{ copy.members }}
                    </NuxtLink>
                    <p
                        v-if="!data.teams.length"
                        class=":uno: t-body-s text-ink-2 m-0"
                    >
                        {{ copy.noTeams }}
                    </p>
                    <div class=":uno: flex flex-wrap gap-3">
                        <UiButton
                            variant="secondary"
                            size="sm"
                            icon="search"
                            to="/student/study-match"
                            >{{ copy.findFriend }}</UiButton
                        >
                        <UiButton
                            variant="link"
                            size="sm"
                            icon="checkCircle"
                            to="/student/tasks"
                            >{{ copy.allTasks }}</UiButton
                        >
                    </div>
                </UiCard>
            </AutoSkeleton>
        </div>
        <div class=":uno: flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-week">
                <UiCard class=":uno: flex flex-col gap-4">
                    <h2 class=":uno: t-d4 text-ink m-0">
                        {{ copy.weekTitle }}
                    </h2>
                    <p
                        v-if="!data.tasks.length"
                        class=":uno: t-body-s text-ink-2 m-0"
                    >
                        {{ copy.noTasks }}
                    </p>
                    <NuxtLink
                        v-for="task in data.tasks"
                        :key="task.id"
                        to="/student/tasks"
                        class=":uno: flex items-baseline justify-between gap-4 no-underline"
                    >
                        <span class=":uno: t-body-s text-ink truncate">{{
                            task.title
                        }}</span>
                        <span class=":uno: t-mono-s text-ink-2 shrink-0">{{
                            task.dueDate
                                ? formatDate(task.dueDate, {
                                      day: "2-digit",
                                      month: "short",
                                  })
                                : ""
                        }}</span>
                    </NuxtLink>
                </UiCard>
            </AutoSkeleton>
        </div>
    </div>
</template>
