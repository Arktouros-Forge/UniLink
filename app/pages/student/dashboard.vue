<script setup>
import { useAuthStore } from "@app/stores/auth";
import { dayLabels } from "@app/constants/options.json";
import { dashboard as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Dasbor" });
const auth = useAuthStore();
const { data, pending } = await useApiData("student-dashboard", "/student/dashboard", {
    default: () => ({ counts: {}, pendingRequests: [], teams: [], tasks: [], today: [], activity: [] }),
});
const firstName = computed(() => auth.user.name.split(" ")[0]);
const pad = (value) => String(value ?? 0).padStart(2, "0");
const stats = computed(() => [
    { label: copy.stats.requests, value: pad(data.value.counts.pendingRequests), trend: `${data.value.counts.helped ?? 0} ${copy.stats.helped}` },
    { label: copy.stats.teams, value: pad(data.value.counts.activeTeams), trend: data.value.teams.map((team) => team.name).join(" · ") || copy.stats.noTeams },
    { label: copy.stats.tasks, value: pad(data.value.counts.openTasks), trend: `${data.value.counts.doneThisWeek ?? 0} ${copy.stats.done}` },
]);
const todayIndex = (new Date().getDay() + 6) % 7;
const nextTask = computed(() => data.value.tasks[0]);
const nextEvent = computed(() => data.value.today[0]);
const extraRequests = computed(() => data.value.pendingRequests.slice(1).map((item) => item.sender.fullName));
</script>

<template>
    <PageHeading :title="`${copy.greeting}, ${firstName}.`" :text="copy.text">
        <UiButton icon="plus" to="/student/help-board/new">{{ copy.post }}</UiButton>
    </PageHeading>
    <AutoSkeleton :loading="pending" id="dashboard-stats">
        <div class="grid gap-4 md:grid-cols-3 md:gap-6">
            <StatCard v-for="item in stats" :key="item.label" :label="item.label" :value="item.value" :trend="item.trend" />
        </div>
    </AutoSkeleton>
    <div class="grid gap-6 md:grid-cols-2 md:items-stretch">
        <div class="flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-requests">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">{{ copy.requestsTitle }}</h2>
                    <UiEmpty v-if="!data.pendingRequests.length" :title="copy.requestsEmpty" />
                    <template v-else>
                        <div class="flex items-center gap-4">
                            <UiAvatar :name="data.pendingRequests[0].sender.fullName" :size="40" />
                            <div class="flex-1 min-w-0">
                                <p class="t-d4 text-ink m-0 !text-lg">{{ data.pendingRequests[0].sender.fullName }}</p>
                                <p class="t-body-s text-ink-2 m-0">{{ data.pendingRequests[0].subject }}</p>
                            </div>
                            <UiButton variant="secondary" size="sm" icon-end="arrowRight" to="/student/study-match/requests">{{ copy.review }}</UiButton>
                        </div>
                        <p v-if="extraRequests.length" class="t-body-s text-ink-2 m-0">{{ extraRequests.join(", ") }} {{ copy.alsoWaiting }}</p>
                    </template>
                </UiCard>
            </AutoSkeleton>
            <AutoSkeleton :loading="pending" id="dashboard-team">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">{{ copy.teamTitle }}</h2>
                    <NuxtLink v-for="team in data.teams" :key="team.id" :to="`/student/teams/${team.id}`" class="t-body-s text-ink no-underline">
                        {{ team.name }} · {{ team.competitionTitle }} · {{ team.memberCount }}/{{ team.capacity }} {{ copy.members }}
                    </NuxtLink>
                    <p v-if="!data.teams.length" class="t-body-s text-ink-2 m-0">{{ copy.noTeams }}</p>
                    <div class="flex flex-wrap gap-3">
                        <UiButton variant="secondary" size="sm" icon="search" to="/student/study-match">{{ copy.findFriend }}</UiButton>
                        <UiButton variant="link" size="sm" icon="calendar" to="/student/timetable">{{ copy.addSchedule }}</UiButton>
                    </div>
                </UiCard>
            </AutoSkeleton>
        </div>
        <div class="flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-week">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">{{ copy.weekTitle }}</h2>
                    <div class="grid grid-cols-7 gap-1">
                        <div v-for="(day, index) in dayLabels" :key="day" class="flex flex-col gap-2">
                            <span class="t-mono-s text-ink">{{ day }}</span>
                            <span class="h-1.5" :class="index === todayIndex ? 'bg-blue' : 'bg-hairline'" />
                        </div>
                    </div>
                    <template v-if="nextEvent">
                        <p class="t-mono-s text-ink m-0">{{ copy.today }} · {{ nextEvent.startTime }}-{{ nextEvent.endTime }}{{ nextEvent.courseCode ? ` · ${nextEvent.courseCode}` : "" }}</p>
                        <p class="t-body-s text-ink m-0">{{ nextEvent.title }}</p>
                    </template>
                    <p v-else class="t-body-s text-ink-2 m-0">{{ copy.noEvents }}</p>
                    <p v-if="nextTask" class="t-body-s text-ink m-0">{{ copy.task }}: {{ nextTask.title }} · {{ nextTask.dueDate }}</p>
                </UiCard>
            </AutoSkeleton>
        </div>
    </div>
</template>
