<script setup>
defineProps({ item: { type: Object, required: true } });
</script>

<template>
  <div class="flex gap-4">
    <UiAvatar :name="item.name" :size="40" />
    <div class="flex flex-col gap-0.5">
      <p class="t-body-s text-ink m-0">{{ item.name }}</p>
      <p class="t-body-s text-ink-2 m-0">{{ item.role }} · Angkatan {{ item.cohort }}<template v-if="item.you"> · Kamu</template></p>
      <p class="t-body-s text-ink m-0">{{ item.skills.join(" · ") }}</p>
    </div>
  </div>
</template>
