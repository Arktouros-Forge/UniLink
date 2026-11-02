<script setup>
import { statusTone } from "@app/constants/options.json";

defineProps({ item: { type: Object, required: true } });
</script>

<template>
  <NuxtLink :to="`/student/competitions/${item.id}`" class="card !p-0 overflow-hidden flex flex-col hover:border-brand-blue transition-colors">
    <span class="h-1.5 bg-brand-red" />
    <NuxtImg v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-36 object-cover" />
    <div class="p-5 flex flex-col gap-3 flex-1">
      <div class="flex flex-wrap gap-2">
        <UiChip v-for="category in item.categories" :key="category" tone="blue">{{ category }}</UiChip>
        <UiChip :tone="statusTone[item.status].tone">{{ statusTone[item.status].label }}</UiChip>
      </div>
      <h3 class="type-h3">{{ item.title }}</h3>
      <p class="type-small flex-1">{{ item.host }}</p>
      <div class="flex items-center justify-between type-meta">
        <span><span class="i-keyline-icons-calendar mr-1.5" />{{ item.deadline }}</span>
        <span><span class="i-keyline-icons-users mr-1.5" />{{ item.teams }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
