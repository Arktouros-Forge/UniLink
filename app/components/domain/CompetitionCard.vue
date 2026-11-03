<script setup>
defineProps({ item: { type: Object, required: true } });
</script>

<template>
  <UiCard as="article" padding="p-0" class="overflow-hidden flex flex-col" hover>
    <div class="relative h-[200px] md:h-[256px] p-5 flex flex-col gap-2 overflow-hidden" :class="item.tint === 'yellow' ? 'bg-yellow-soft' : 'bg-blue-soft'">
      <NuxtImg v-if="item.image" :src="item.image" :alt="item.title" class="absolute inset-0 size-full object-cover" />
      <template v-else>
        <p class="t-mono-s text-ink m-0">{{ item.label }}</p>
        <h3 class="t-d3 text-ink m-0 max-w-[55%] !text-2xl">{{ item.title }}</h3>
        <p class="t-body-s text-ink-2 m-0">Contoh informasi kompetisi</p>
        <span class="absolute right-0 top-0 w-[26%] h-[40%] border-2 border-outline" :class="item.tint === 'yellow' ? 'bg-yellow' : 'bg-blue'" />
        <span class="absolute right-[10%] top-[52%] w-[20%] h-[26%] bg-red border-2 border-outline" />
      </template>
    </div>
    <div class="p-5 flex flex-col gap-3">
      <div class="flex flex-wrap gap-2"><UiChip v-for="category in item.categories" :key="category" tone="blue">{{ category }}</UiChip></div>
      <h3 class="t-d4 text-ink m-0">{{ item.title }}</h3>
      <p class="t-body-s text-ink-2 m-0">Diselenggarakan oleh {{ item.host }}</p>
      <p class="t-mono-s text-ink m-0 flex items-center gap-2"><UiIcon name="calendar" size="text-base" />{{ item.deadline }} · tenggat contoh</p>
      <div class="flex items-center justify-between gap-3">
        <span class="t-body-s text-ink">{{ item.teams }} tim contoh mencari anggota</span>
        <UiButton variant="secondary" size="sm" icon-end="arrowRight" :to="`/student/competitions/${item.id}`">Lihat detail</UiButton>
      </div>
    </div>
  </UiCard>
</template>
