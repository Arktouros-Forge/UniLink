<script setup>
import { eventColors } from "@app/constants/options.json";

defineProps({ item: { type: Object, required: true } });
defineEmits(["remove"]);
</script>

<template>
  <div class="card !p-4 flex gap-3">
    <span class="w-1.5 rounded-full shrink-0" :class="eventColors[item.color]" />
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="type-label">{{ item.title }}</p>
      <p class="type-meta">{{ item.start }} – {{ item.end }} · {{ item.room }}</p>
      <p class="type-small truncate">{{ item.lecturer }}</p>
    </div>
    <button class="size-9 inline-flex items-center justify-center bg-transparent border-0 text-mute cursor-pointer rounded-lg hover:bg-soft" @click="$emit('remove', item)">
      <span class="i-keyline-icons-bin text-lg" />
    </button>
  </div>
</template>
