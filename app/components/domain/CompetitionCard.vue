<script setup>
import { competitions as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

defineProps({ item: { type: Object, required: true } });
</script>

<template>
    <UiCard
        as="article"
        padding="p-0"
        class=":uno: overflow-hidden flex flex-col"
        hover
    >
        <div
            class=":uno: relative h-[200px] md:h-[256px] p-5 flex flex-col gap-2 overflow-hidden bg-blue-soft"
        >
            <NuxtImg
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.title"
                class=":uno: absolute inset-0 size-full object-cover"
            />
            <template v-else>
                <p class=":uno: t-mono-s text-ink m-0">{{ item.host }}</p>
                <h3
                    class=":uno: t-d3 text-ink m-0 max-w-[55%] !text-2xl line-clamp-4"
                >
                    {{ item.title }}
                </h3>
                <span
                    class=":uno: absolute right-0 top-0 w-[26%] h-[40%] border-2 border-outline bg-blue"
                />
                <span
                    class=":uno: absolute right-[10%] top-[52%] w-[20%] h-[26%] bg-red border-2 border-outline"
                />
            </template>
        </div>
        <div class=":uno: p-5 flex flex-col gap-3">
            <div class=":uno: flex flex-wrap gap-2">
                <UiChip
                    v-for="category in item.categories"
                    :key="category.id"
                    tone="blue"
                    >{{ category.name }}</UiChip
                >
            </div>
            <h3 class=":uno: t-d4 text-ink m-0 line-clamp-2">
                {{ item.title }}
            </h3>
            <p class=":uno: t-body-s text-ink-2 m-0 truncate">
                {{ copy.host }} {{ item.host }}
            </p>
            <div class=":uno: flex flex-wrap items-center gap-2">
                <DeadlineBadge :days="item.daysLeft" />
                <span class=":uno: t-mono-s text-ink flex items-center gap-2"
                    ><UiIcon name="calendar" size="text-base" />{{
                        formatDate(item.deadline)
                    }}</span
                >
            </div>
            <div class=":uno: flex items-center justify-between gap-3">
                <span class=":uno: t-body-s text-ink"
                    >{{ item.teamCount }} {{ copy.teamsLooking }}</span
                >
                <UiButton
                    variant="secondary"
                    size="sm"
                    icon-end="arrowRight"
                    :to="`/student/competitions/${item.id}`"
                    >{{ copy.view }}</UiButton
                >
            </div>
        </div>
    </UiCard>
</template>
