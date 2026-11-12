<script setup>
import { tasks as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

const props = defineProps({ item: { type: Object, required: true } });
defineEmits(["toggle", "edit", "remove"]);

const today = new Date().toISOString().slice(0, 10);
const state = computed(() => {
  if (props.item.completed || !props.item.dueDate) return "none";
  if (props.item.dueDate < today) return "overdue";
  return props.item.dueDate === today ? "today" : "later";
});
const due = computed(() => (props.item.dueDate ? formatDate(props.item.dueDate, { day: "2-digit", month: "short" }) : copy.noDue));
const bar = { high: ":uno: bg-red", medium: ":uno: bg-yellow", low: ":uno: bg-hairline" };
</script>

<template>
  <li class=":uno: group relative flex items-center gap-3 px-4 py-3 pl-5">
    <span class=":uno: absolute left-0 inset-y-0 w-1" :class="item.completed ? ':uno: bg-transparent' : bar[item.priority]" />
    <UiCheckbox :model-value="item.completed" @update:model-value="$emit('toggle', item)" />
    <div class=":uno: flex-1 min-w-0 flex flex-col">
      <p class=":uno: t-body-s m-0 truncate" :class="item.completed ? ':uno: text-ink-3 line-through' : ':uno: text-ink'">{{ item.title }}</p>
      <p class=":uno: t-mono-s m-0 truncate" :class="state === 'overdue' ? ':uno: text-danger' : ':uno: text-ink-2'">
        <template v-if="item.course">{{ item.course }} · </template>{{ state === "today" ? copy.today : due }}
      </p>
    </div>
    <div class=":uno: flex items-center shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
      <UiIconButton icon="edit" label="Edit" class=":uno: !size-8" @click="$emit('edit', item)" />
      <UiIconButton icon="trash" label="Hapus" class=":uno: !size-8" @click="$emit('remove', item)" />
    </div>
  </li>
</template>
