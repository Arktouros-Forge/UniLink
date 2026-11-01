<script setup>
import { useReferenceStore } from "@app/stores/reference";

defineProps({
  event: { type: Object, required: true },
});

defineEmits(["edit", "remove"]);

const reference = useReferenceStore();
const accents = { blue: "border-l-brand-blue", red: "border-l-brand-red", yellow: "border-l-brand-yellow" };
</script>

<template>
  <div class="card flex items-start justify-between gap-3 border-l-4 p-4" :class="accents[event.color]">
    <div class="min-w-0">
      <p class="type-meta text-mute">{{ event.start }} – {{ event.end }} · {{ event.courseCode }}</p>
      <p class="type-body font-medium">{{ event.title }}</p>
      <p class="type-small text-mute">{{ event.room }} · {{ reference.lecturersById[event.lecturerId]?.name }}</p>
    </div>
    <div class="flex gap-1">
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Ubah" @click="$emit('edit', event)"><span class="i-keyline-pen" /></button>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Hapus" @click="$emit('remove', event.id)"><span class="i-keyline-bin" /></button>
    </div>
  </div>
</template>
