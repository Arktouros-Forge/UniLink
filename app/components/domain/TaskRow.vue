<script setup>
import { tasks as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

const props = defineProps({ item: { type: Object, required: true } });
defineEmits(["toggle", "edit", "remove"]);
const today = new Date().toISOString().slice(0, 10);
const overdue = computed(() => !props.item.completed && props.item.dueDate && props.item.dueDate < today);
const label = computed(() => (props.item.dueDate ? formatDate(props.item.dueDate, { day: "2-digit", month: "short" }) : copy.noDue));
</script>

<template>
  <UiCard as="article" padding="p-4" class="flex items-center gap-4">
    <UiCheckbox :model-value="item.completed" @update:model-value="$emit('toggle', item)" />
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="t-body-s m-0 truncate" :class="item.completed ? 'text-ink-2 line-through' : 'text-ink'">{{ item.title }}</p>
      <p v-if="item.course" class="t-body-xs text-blue m-0 truncate">{{ item.course }}</p>
    </div>
    <UiChip :tone="overdue ? 'danger' : item.priority === 'high' ? 'yellow' : 'neutral'" :filled="item.priority === 'high' && !item.completed" size="md">{{ label }}</UiChip>
    <UiButton variant="link" size="sm" @click="$emit('edit', item)">Edit</UiButton>
    <UiButton variant="link" size="sm" @click="$emit('remove', item)">Hapus</UiButton>
  </UiCard>
</template>
