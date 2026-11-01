<script setup>
import { useReferenceStore } from "@app/stores/reference";

defineProps({
    user: { type: Object, required: true },
    matches: { type: Array, default: () => [] },
});

const reference = useReferenceStore();
</script>

<template>
    <AppCard :to="`/student/study-match/helpers/${user.id}`" class="grid gap-3">
        <div class="flex items-center gap-3">
            <AppAvatar :name="user.fullName" />
            <div>
                <p class="type-body font-medium">{{ user.fullName }}</p>
                <p class="type-meta text-mute">
                    @{{ user.username }} · Angkatan {{ user.year }}
                </p>
            </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
            <AppChip v-for="id in matches" :key="id" tone="brand">{{
                reference.skillsById[id]?.name
            }}</AppChip>
        </div>
    </AppCard>
</template>
