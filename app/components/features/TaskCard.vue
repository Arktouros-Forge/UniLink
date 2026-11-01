<script setup>
import { formatDate } from "@app/utils/format";
import { priorityTone } from "@app/constants/options.json";

defineProps({
  task: { type: Object, required: true },
});

defineEmits(["toggle", "edit", "remove"]);

const priorityLabel = { low: "Rendah", medium: "Sedang", high: "Tinggi" };
</script>

<template>
  <AppCard class="flex items-start gap-3">
    <input type="checkbox" class="mt-1 size-5 accent-[var(--blue)]" :checked="task.completed" @change="$emit('toggle', task.id)" />
    <div class="min-w-0 flex-1">
      <p class="type-body font-medium" :class="task.completed && 'text-mute line-through'">{{ task.title }}</p>
      <p v-if="task.notes" class="type-small text-mute">{{ task.notes }}</p>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <AppChip :tone="priorityTone[task.priority]">{{ priorityLabel[task.priority] }}</AppChip>
        <span v-if="task.dueDate" class="type-meta text-mute">{{ formatDate(task.dueDate) }}</span>
      </div>
    </div>
    <div class="flex gap-1">
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Ubah" @click="$emit('edit', task)"><span class="i-keyline-pen" /></button>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Hapus" @click="$emit('remove', task.id)"><span class="i-keyline-bin" /></button>
    </div>
  </AppCard>
</template>
