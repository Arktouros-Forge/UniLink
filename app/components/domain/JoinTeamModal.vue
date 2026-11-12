<script setup>
import { joinModal as copy, modals } from "@app/constants/student.json";

const props = defineProps({
    open: { type: Boolean, default: false },
    team: { type: Object, default: null },
});
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const text = modals.join;
const capacity = computed(
    () => props.team?.maxMembers ?? props.team?.members?.length ?? 0,
);
const left = computed(
    () =>
        capacity.value -
        (props.team?.members?.filter((member) => member.status === "accepted")
            .length ?? 0),
);
const { run, pending } = useAction(async () => {
    await api.post(`/student/teams/${props.team.id}/join`);
    emit("sent");
});
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="text.eyebrow"
        :title="copy.title"
        :text="text.text"
        :submit="copy.submit"
        :pending="pending"
        @close="emit('close')"
        @submit="run()"
    >
        <div
            v-if="team"
            class=":uno: flex flex-col gap-3 p-3 rounded-md border border-hairline bg-paper/60"
        >
            <div class=":uno: flex items-start justify-between gap-3">
                <p class=":uno: t-label text-ink m-0 line-clamp-2">
                    {{ team.name }}
                </p>
                <span class=":uno: t-mono-s text-ink-2 shrink-0">{{
                    left > 0 ? text.spots.replace("{count}", left) : text.full
                }}</span>
            </div>
            <RosterSlots
                :members="team.members"
                :capacity="capacity"
                :size="32"
            />
        </div>
    </UiModal>
</template>
