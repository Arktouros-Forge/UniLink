<script setup>
defineProps({ item: { type: Object, required: true } });
</script>

<template>
  <div class="flex gap-4">
    <UiAvatar :name="item.fullName" :size="40" />
    <div class="flex flex-col gap-0.5">
      <p class="t-body-s text-ink m-0">{{ item.fullName }}</p>
      <p class="t-body-s text-ink-2 m-0">{{ item.role }} · Angkatan {{ item.year }}<template v-if="item.you"> · Kamu</template></p>
      <p v-if="item.skills?.length" class="t-body-s text-ink m-0">{{ item.skills.map((skill) => skill.name).join(" · ") }}</p>
    </div>
  </div>
</template>
