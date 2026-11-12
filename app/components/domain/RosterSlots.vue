<script setup>
const props = defineProps({
    members: { type: Array, required: true },
    capacity: { type: Number, required: true },
    size: { type: Number, default: 36 },
});
const empty = computed(() =>
    Math.max(0, props.capacity - props.members.length),
);
</script>

<template>
    <div
        class=":uno: flex items-center gap-1.5"
        :aria-label="`${members.length} dari ${capacity} anggota`"
    >
        <UiAvatar
            v-for="member in members"
            :key="member.id"
            :name="member.fullName"
            :size="size"
        />
        <span
            v-for="slot in empty"
            :key="slot"
            class=":uno: inline-flex items-center justify-center rounded-full border border-dashed border-outline text-ink-3"
            :style="{ width: `${size}px`, height: `${size}px` }"
            ><UiIcon name="plus" size="text-sm"
        /></span>
    </div>
</template>
