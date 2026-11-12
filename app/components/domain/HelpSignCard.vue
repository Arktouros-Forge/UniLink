<script setup>
import { helpBoard as copy } from "@app/constants/student.json";
import { formatDeadline } from "@app/utils/format";

defineProps({
    item: { type: Object, required: true },
    mine: { type: Boolean, default: false },
});
</script>

<template>
    <UiCard as="article" class=":uno: flex flex-col gap-3" hover>
        <div class=":uno: flex items-center justify-between gap-2">
            <UiChip size="sm" tone="blue">{{ item.skill.name }}</UiChip>
            <UiChip
                size="sm"
                :tone="item.status === 'open' ? 'success' : 'neutral'"
                >{{ copy[item.status] }}</UiChip
            >
        </div>
        <h3 class=":uno: t-d4 text-ink m-0 line-clamp-2">{{ item.title }}</h3>
        <p class=":uno: t-body-s text-ink-2 m-0 line-clamp-3">
            {{ item.description }}
        </p>
        <div class=":uno: flex items-center justify-between gap-3">
            <span class=":uno: t-mono-s text-ink-2"
                >{{ formatDeadline(item.expiresAt) }} · {{ item.offerCount }}
                {{ copy.responses }}</span
            >
            <UiButton
                variant="secondary"
                size="sm"
                icon-end="arrowRight"
                :to="`/student/help-board/${item.id}`"
                >{{ mine ? copy.manage : copy.view }}</UiButton
            >
        </div>
    </UiCard>
</template>
