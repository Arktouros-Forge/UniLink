<script setup>
import { competition as extras } from "@app/constants/guidance.json";
import { competitionDetail as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Detail kompetisi",
});

const route = useRoute();
const api = useApi();
const {
    data: item,
    pending,
    refresh,
} = await useApiData(
    `competition-${route.params.id}`,
    `/student/competitions/${route.params.id}`,
    {
        default: () => ({ title: "", categories: [], teams: [], daysLeft: 0 }),
    },
);

const list = computed(() =>
    item.value.teams.filter((team) => !team.isFull || team.myStatus),
);
const timeline = computed(() =>
    extras.timeline.map((step) => ({
        ...step,
        text: step.text.replace("{deadline}", formatDate(item.value.deadline)),
    })),
);
const meta = computed(() => [
    { icon: "building", label: copy.host, value: item.value.host },
    {
        icon: "calendar",
        label: copy.deadline,
        value: formatDate(item.value.deadline),
        mono: true,
    },
    {
        icon: "users",
        label: copy.size,
        value: item.value.maxTeamSize
            ? `1 – ${item.value.maxTeamSize} ${copy.people}`
            : copy.noLimit,
    },
    ...(item.value.prize
        ? [{ icon: "trophy", label: copy.prize, value: item.value.prize }]
        : []),
    ...(item.value.sourceUrl
        ? [
              {
                  icon: "globe",
                  label: copy.site,
                  value: item.value.sourceUrl.replace(/^https?:\/\//, ""),
                  href: item.value.sourceUrl,
              },
          ]
        : []),
]);

const createOpen = ref(false);
const joinTarget = ref(null);

const create = useAction(
    async (payload) => {
        const team = await api.post("/student/teams", {
            ...payload,
            competitionId: route.params.id,
        });
        createOpen.value = false;
        await navigateTo(`/student/teams/${team.id}`);
    },
    { success: copy.teamCreated },
);
const sendJoin = async () => {
    joinTarget.value = null;
    await refresh();
};
</script>

<template>
    <PageBack to="/student/competitions">{{ copy.back }}</PageBack>
    <AutoSkeleton :loading="pending" id="competition-detail">
        <DetailLayout>
            <UiCard padding="p-0" class=":uno: overflow-hidden">
                <div
                    class=":uno: relative h-[200px] md:h-[256px] p-6 flex flex-col gap-2 overflow-hidden bg-blue-soft"
                >
                    <NuxtImg
                        v-if="item.imageUrl"
                        :src="item.imageUrl"
                        :alt="item.title"
                        class=":uno: absolute inset-0 size-full object-cover"
                    />
                    <template v-else>
                        <p class=":uno: t-mono-s text-ink m-0">{{ item.host }}</p>
                        <h1 class=":uno: t-d2 text-ink m-0 max-w-[60%]">
                            {{ item.title }}
                        </h1>
                        <span
                            class=":uno: absolute right-0 top-0 w-[26%] h-[40%] border-2 border-outline bg-blue"
                        />
                        <span
                            class=":uno: absolute right-[10%] top-[52%] w-[20%] h-[26%] bg-red border-2 border-outline"
                        />
                    </template>
                </div>
                <div class=":uno: p-6 flex flex-col gap-4">
                    <div class=":uno: flex flex-wrap items-center gap-2">
                        <DeadlineBadge :days="item.daysLeft" size="md" />
                        <UiChip
                            v-for="category in item.categories"
                            :key="category.id"
                            tone="blue"
                            >{{ category.name }}</UiChip
                        >
                    </div>
                    <p class=":uno: t-body-m text-ink m-0">{{ item.description }}</p>
                    <div class=":uno: flex flex-wrap gap-3">
                        <UiButton
                            v-if="item.sourceUrl"
                            icon="external"
                            :href="item.sourceUrl"
                            >{{ copy.official }}</UiButton
                        >
                        <UiButton
                            v-if="item.isOpen"
                            variant="secondary"
                            icon="users"
                            @click="createOpen = true"
                            >{{ copy.createTeam }}</UiButton
                        >
                    </div>
                </div>
            </UiCard>

            <UiCard class=":uno: flex flex-col gap-4">
                <div class=":uno: flex items-center justify-between gap-3">
                    <h2 class=":uno: t-d4 text-ink m-0">{{ copy.teamsTitle }}</h2>
                    <UiChip tone="yellow" filled
                        >{{ list.length }} {{ copy.teamsCount }}</UiChip
                    >
                </div>
                <div
                    v-if="list.length"
                    class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2"
                >
                    <TeamCard v-for="team in list" :key="team.id" :team="team">
                        <UiButton
                            v-if="!team.myStatus && !team.isFull && item.isOpen"
                            size="sm"
                            icon="userPlus"
                            @click="joinTarget = team"
                            >{{ copy.join }}</UiButton
                        >
                        <UiChip
                            v-else-if="team.myStatus === 'pending'"
                            tone="yellow"
                            >{{ copy.pending }}</UiChip
                        >
                        <UiButton
                            v-if="team.myStatus === 'accepted'"
                            size="sm"
                            variant="link"
                            icon-end="arrowRight"
                            :to="`/student/teams/${team.id}`"
                            >{{ copy.viewTeam }}</UiButton
                        >
                    </TeamCard>
                </div>
                <UiEmpty
                    v-else
                    :title="copy.emptyTeams"
                    :text="copy.emptyTeamsText"
                    icon="users"
                >
                    <UiButton
                        v-if="item.isOpen"
                        icon="plus"
                        @click="createOpen = true"
                        >{{ copy.createTeam }}</UiButton
                    >
                </UiEmpty>
            </UiCard>

            <UiCard class=":uno: flex flex-col gap-3">
                <h2 class=":uno: t-d4 text-ink m-0">{{ copy.before }}</h2>
                <ul class=":uno: m-0 pl-5 flex flex-col gap-2">
                    <li
                        v-for="tip in extras.tips"
                        :key="tip"
                        class=":uno: t-body-s text-ink-2"
                    >
                        {{ tip }}
                    </li>
                </ul>
            </UiCard>

            <template #aside>
                <UiCard class=":uno: flex flex-col gap-4"
                    ><h2 class=":uno: t-d4 text-ink m-0">{{ copy.summary }}</h2>
                    <MetaList :items="meta"
                /></UiCard>
                <UiCard class=":uno: flex flex-col gap-2"
                    ><h2 class=":uno: t-d4 text-ink m-0">{{ copy.flow }}</h2>
                    <UiTimeline :items="timeline"
                /></UiCard>
            </template>
        </DetailLayout>
    </AutoSkeleton>
    <TeamFormModal
        :open="createOpen"
        title="Buat tim"
        :max-size="item.maxTeamSize ?? 5"
        :min-size="1"
        :pending="create.pending.value"
        :errors="create.fieldErrors.value"
        @close="createOpen = false"
        @save="create.run($event)"
    />
    <JoinTeamModal
        :open="!!joinTarget"
        :team="joinTarget"
        @close="joinTarget = null"
        @sent="sendJoin"
    />
</template>
