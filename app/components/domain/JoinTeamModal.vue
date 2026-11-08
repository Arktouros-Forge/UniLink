<script setup>
import { joinModal as copy } from "@app/constants/student.json";

const props = defineProps({ open: { type: Boolean, default: false }, team: { type: Object, default: null } });
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const { run, pending } = useAction(async () => {
  await api.post(`/student/teams/${props.team.id}/join`);
  emit("sent");
});
</script>

<template>
  <UiModal :open="open" :title="copy.title" @close="emit('close')">
    <UiCard v-if="team" padding="p-4" class="flex flex-col gap-3 shadow-none">
      <p class="t-label text-ink m-0">{{ team.name }}</p>
      <RosterSlots :members="team.members" :capacity="team.maxMembers ?? team.members.length" :size="32" />
    </UiCard>
    <UiCallout :title="copy.noteTitle" tone="info">{{ copy.note }}</UiCallout>
    <template #footer>
      <UiButton icon="check" :loading="pending" @click="run()">{{ copy.submit }}</UiButton>
      <UiButton variant="link" @click="emit('close')">{{ copy.cancel }}</UiButton>
    </template>
  </UiModal>
</template>
