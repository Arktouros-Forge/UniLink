<script setup>
import { teams as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", access: "student", title: "Tim saya" });
const { data: teams, pending } = await useApiData("teams", "/student/teams", {
    default: () => [],
});
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text" />
    <AutoSkeleton :loading="pending" id="teams-list">
        <div class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <UiCard
                v-for="team in teams"
                :key="team.id"
                class=":uno: flex flex-col gap-3"
                hover
            >
                <h2 class=":uno: t-d4 text-ink m-0 line-clamp-2">
                    {{ team.name }}
                </h2>
                <p class=":uno: t-body-s text-ink-2 m-0 line-clamp-2">
                    {{ team.competition.title }}
                </p>
                <div class=":uno: flex flex-wrap gap-2">
                    <UiChip tone="yellow" filled
                        >{{ team.acceptedCount }} {{ copy.ofWord }}
                        {{ team.maxMembers ?? "∞" }} {{ copy.members }}</UiChip
                    >
                    <UiChip
                        v-if="team.isCreator && team.pendingCount"
                        tone="blue"
                        >{{ team.pendingCount }} {{ copy.pending }}</UiChip
                    >
                </div>
                <UiButton
                    variant="secondary"
                    size="sm"
                    icon-end="arrowRight"
                    :to="`/student/teams/${team.id}`"
                    class=":uno: self-start"
                    >{{ copy.view }}</UiButton
                >
            </UiCard>
        </div>
        <UiEmpty v-if="!teams.length" :title="copy.emptyTitle" icon="users"
            ><UiButton size="sm" to="/student/competitions">{{
                copy.explore
            }}</UiButton></UiEmpty
        >
    </AutoSkeleton>
</template>
