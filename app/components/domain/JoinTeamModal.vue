<script setup>
import { joinModal as copy, modals } from "@app/constants/student.json";

const props = defineProps({ open: { type: Boolean, default: false }, team: { type: Object, default: null } });
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const text = modals.join;
const capacity = computed(() => props.team?.maxMembers ?? props.team?.members?.length ?? 0);
const left = computed(() => capacity.value - (props.team?.members?.filter((member) => member.status === "accepted").length ?? 0));
const { run, pending } = useAction(async () => {
  await api.post(`/student/teams/${props.team.id}/join`);
  emit("sent");
});
</script>

<template>
  <UiModal :open="open" :eyebrow="text.eyebrow" :title="copy.title" :text="text.text" :submit="copy.submit" :pending="pending" @close="emit('close')" @submit="run()">
    <div v-if="team" class="flex flex-col gap-3 p-3 rounded-md border border-hairline bg-paper/60">
      <div class="flex items-start justify-between gap-3">
        <p class="t-label text-ink m-0 line-clamp-2">{{ team.name }}</p>
        <span class="t-mono-s text-ink-2 shrink-0">{{ left > 0 ? text.spots.replace("{count}", left) : text.full }}</span>
      </div>
      <RosterSlots :members="team.members" :capacity="capacity" :size="32" />
    </div>
    <ol class="m-0 p-0 list-none flex flex-col gap-2">
      <li v-for="(step, index) in text.steps" :key="step" class="flex items-center gap-3 t-body-s text-ink">
        <span class="size-6 inline-flex items-center justify-center border border-outline t-mono-s shrink-0">{{ index + 1 }}</span>{{ step }}
      </li>
    </ol>
  </UiModal>
</template>
