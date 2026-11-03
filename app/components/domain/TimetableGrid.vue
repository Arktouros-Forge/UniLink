<script setup>
import { eventTypes } from "@app/constants/options.json";

defineProps({
  days: { type: Array, required: true },
  hours: { type: Array, required: true },
  events: { type: Array, required: true },
});
defineEmits(["select"]);

const rowHeight = 93;
const tone = (type) => eventTypes.find((entry) => entry.value === type)?.tone || "blue";
const palette = {
  blue: "bg-blue-soft border-blue",
  red: "bg-red-soft border-red",
  yellow: "bg-yellow-soft border-yellow",
  success: "bg-success-soft border-success",
};
</script>

<template>
  <UiCard padding="p-0" class="overflow-x-auto">
    <div class="min-w-[880px]">
      <div class="grid grid-cols-[52px_repeat(7,1fr)] border-b border-hairline">
        <span />
        <span v-for="day in days" :key="day.label" class="px-2 h-10 flex items-center t-mono-s text-ink border-l border-hairline" :class="day.today && 'bg-blue-soft'">{{ day.label }}</span>
      </div>
      <div class="grid grid-cols-[52px_repeat(7,1fr)]">
        <div class="flex flex-col">
          <span v-for="hour in hours" :key="hour" class="px-1 pt-2 t-mono-s text-ink" :style="{ height: `${rowHeight}px` }">{{ String(hour).padStart(2, "0") }}.00</span>
        </div>
        <div v-for="(day, dayIndex) in days" :key="day.label" class="relative border-l border-hairline">
          <span v-for="hour in hours" :key="hour" class="block border-b border-hairline last:border-0" :style="{ height: `${rowHeight}px` }" />
          <button
            v-for="event in events.filter((entry) => entry.day === dayIndex)"
            :key="event.id"
            type="button"
            class="absolute inset-x-[3px] p-2 text-left rounded-sm border-0 border-l-2 cursor-pointer overflow-hidden focus-ring"
            :class="palette[tone(event.type)]"
            :style="{ top: `${((event.start - hours[0]) / 2) * rowHeight + 3}px`, height: `${Math.max(((event.end - event.start) / 2) * rowHeight - 6, 44)}px` }"
            @click="$emit('select', event)"
          >
            <p class="t-body-xs text-ink m-0 leading-4">{{ event.title }}</p>
            <p class="t-mono-s text-ink m-0 mt-1">{{ event.label }}</p>
            <UiIcon name="graduation" size="text-sm" class="mt-1 text-ink" />
          </button>
        </div>
      </div>
    </div>
  </UiCard>
</template>
