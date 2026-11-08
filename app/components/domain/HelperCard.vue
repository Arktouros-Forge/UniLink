<script setup>
import { university } from "@app/constants/site.json";

defineProps({
  item: { type: Object, required: true },
  matched: { type: Array, default: () => [] },
  compact: { type: Boolean, default: false },
});
defineEmits(["request"]);
</script>

<template>
  <UiCard v-if="!compact" class="flex flex-col gap-4" hover>
    <div class="flex gap-4">
      <UiAvatar :name="item.fullName" :size="56" />
      <div class="min-w-0">
        <h3 class="t-d4 text-ink m-0">{{ item.fullName }}</h3>
        <p class="t-body-s text-ink-2 m-0 mt-1">{{ item.major }} · Angkatan {{ item.year }}</p>
        <p class="t-body-s text-ink-2 m-0">{{ university }}</p>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <UiChip v-for="skill in item.skills" :key="skill.id" :outline="matched.includes(skill.id)">{{ skill.name }}</UiChip>
    </div>
    <p class="t-body-s text-ink m-0">{{ item.bio }}</p>
    <div class="flex items-center gap-4">
      <UiButton icon="userPlus" @click="$emit('request', item)">Minta bantuan</UiButton>
      <UiButton variant="link" icon-end="external" :to="`/student/study-match/helpers/${item.id}`">Lihat profil</UiButton>
    </div>
  </UiCard>
  <UiCard v-else padding="p-4" class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-transparent shadow-none">
    <div class="flex gap-3 items-center">
      <UiAvatar :name="item.fullName" :size="40" tone="neutral" />
      <div>
        <h3 class="t-d4 text-ink m-0 !text-base">{{ item.fullName }}</h3>
        <p class="t-body-s text-ink-2 m-0">{{ item.major }} · Angkatan {{ item.year }}</p>
        <p class="t-body-s text-ink m-0">{{ item.skills.map((skill) => skill.name).join(" · ") }}</p>
      </div>
    </div>
    <UiButton variant="secondary" size="sm" icon-end="external" :to="`/student/study-match/helpers/${item.id}`">Lihat profil</UiButton>
  </UiCard>
</template>
