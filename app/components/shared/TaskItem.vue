<script setup>
import { priorities } from "@app/constants/options.json";

const props = defineProps({ item: { type: Object, required: true } });
defineEmits(["toggle", "remove"]);
const priority = computed(() => priorities.find((entry) => entry.value === props.item.priority));
</script>

<template>
  <div class="card !p-4 flex items-center gap-3">
    <button
      class="size-6 shrink-0 rounded-md border border-rule inline-flex items-center justify-center cursor-pointer"
      :class="item.done ? 'bg-brand-blue text-onbrand' : 'bg-card'"
      @click="$emit('toggle', item)"
    >
      <span v-if="item.done" class="i-keyline-icons-check" />
    </button>
    <div class="flex-1 min-w-0">
      <p class="type-label truncate" :class="item.done && 'line-through opacity-60'">{{ item.title }}</p>
      <p class="type-meta">{{ item.course }} · {{ item.due }}</p>
    </div>
    <UiChip :tone="priority.tone">{{ priority.label }}</UiChip>
    <button class="size-9 inline-flex items-center justify-center bg-transparent border-0 text-mute cursor-pointer rounded-lg hover:bg-soft" @click="$emit('remove', item)">
      <span class="i-keyline-icons-bin text-lg" />
    </button>
  </div>
</template>
