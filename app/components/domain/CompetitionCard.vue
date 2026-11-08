<script setup>
import { competitions as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

defineProps({ item: { type: Object, required: true } });
</script>

<template>
  <UiCard as="article" padding="p-0" class="overflow-hidden flex flex-col" hover>
    <div class="relative h-[200px] md:h-[256px] p-5 flex flex-col gap-2 overflow-hidden bg-blue-soft">
      <NuxtImg v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="absolute inset-0 size-full object-cover" />
      <template v-else>
        <p class="t-mono-s text-ink m-0">{{ item.host }}</p>
        <h3 class="t-d3 text-ink m-0 max-w-[55%] !text-2xl line-clamp-4">{{ item.title }}</h3>
        <span class="absolute right-0 top-0 w-[26%] h-[40%] border-2 border-outline bg-blue" />
        <span class="absolute right-[10%] top-[52%] w-[20%] h-[26%] bg-red border-2 border-outline" />
      </template>
    </div>
    <div class="p-5 flex flex-col gap-3">
      <div class="flex flex-wrap gap-2"><UiChip v-for="category in item.categories" :key="category.id" tone="blue">{{ category.name }}</UiChip></div>
      <h3 class="t-d4 text-ink m-0 line-clamp-2">{{ item.title }}</h3>
      <p class="t-body-s text-ink-2 m-0 truncate">{{ copy.host }} {{ item.host }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <DeadlineBadge :days="item.daysLeft" />
        <span class="t-mono-s text-ink flex items-center gap-2"><UiIcon name="calendar" size="text-base" />{{ formatDate(item.deadline) }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="t-body-s text-ink">{{ item.teamCount }} {{ copy.teamsLooking }}</span>
        <UiButton variant="secondary" size="sm" icon-end="arrowRight" :to="`/student/competitions/${item.id}`">{{ copy.view }}</UiButton>
      </div>
    </div>
  </UiCard>
</template>
