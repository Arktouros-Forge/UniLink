<script setup>
defineProps({ item: { type: Object, required: true } });
defineEmits(["request"]);
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <UiAvatar :name="item.name" size="size-12" />
      <div class="flex-1 min-w-0">
        <NuxtLink :to="`/student/study-match/helpers/${item.id}`" class="type-h3 block truncate hover:text-brand-blue">{{ item.name }}</NuxtLink>
        <p class="type-small truncate">{{ item.major }} · {{ item.cohort }}</p>
      </div>
      <UiChip tone="yellow">{{ item.match }}%</UiChip>
    </div>
    <p class="type-small">{{ item.bio }}</p>
    <div class="flex flex-wrap gap-2"><UiChip v-for="skill in item.skills" :key="skill" tone="blue">{{ skill }}</UiChip></div>
    <button class="btn-primary btn-sm self-start" @click="$emit('request', item)">Ajak belajar</button>
  </div>
</template>
