<script setup>
import { useReferenceStore } from "@app/stores/reference";
import { useCompetitionsStore } from "@app/stores/competitions";
import { formatDeadline } from "@app/utils/format";

const props = defineProps({
    competition: { type: Object, required: true },
});

const reference = useReferenceStore();
const competitions = useCompetitionsStore();
const closed = computed(() => competitions.isClosed(props.competition));
</script>

<template>
    <AppCard :to="`/student/competitions/${competition.id}`" class="grid gap-3">
        <NuxtImg
            v-if="competition.imageUrl"
            :src="competition.imageUrl"
            :alt="competition.title"
            class="h-36 w-full rounded-[8px] object-cover"
        />
        <div v-else class="h-36 rounded-[8px] bg-soft" />
        <div class="flex flex-wrap gap-1.5">
            <AppChip v-for="id in competition.categoryIds" :key="id">{{
                reference.categoriesById[id]?.name
            }}</AppChip>
            <AppChip tone="outline">{{ competition.level }}</AppChip>
        </div>
        <h3 class="type-h3">{{ competition.title }}</h3>
        <p class="type-small text-mute">{{ competition.host }}</p>
        <p class="type-meta" :class="closed ? 'text-brand-red' : 'text-mute'">
            {{ closed ? "Ditutup" : "Batas" }} ·
            {{ formatDeadline(competition.deadline) }}
        </p>
    </AppCard>
</template>
