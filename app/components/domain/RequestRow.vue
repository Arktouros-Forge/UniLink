<script setup>
import { whatsappBase } from "@app/constants/site.json";
import { whatsappUrl } from "@app/utils/format";

defineProps({
  item: { type: Object, required: true },
  actions: { type: Boolean, default: false },
});
defineEmits(["accept", "decline"]);
</script>

<template>
  <UiCard padding="p-5 md:p-6" class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div class="flex gap-4 min-w-0">
      <UiAvatar :name="item.name" :size="40" />
      <div class="flex flex-col gap-1 min-w-0">
        <p class="t-label text-ink m-0">{{ item.name }}</p>
        <p class="t-body-s text-ink-2 m-0">{{ item.meta }}</p>
        <p class="t-body-s text-ink m-0">{{ item.message }}</p>
      </div>
    </div>
    <div class="flex flex-col items-start gap-3 md:items-end shrink-0">
      <UiChip v-if="item.status === 'pending'" tone="yellow" filled>Menunggu tanggapan</UiChip>
      <UiChip v-else-if="item.status === 'accepted'">Diterima</UiChip>
      <UiChip v-else tone="danger">Ditolak</UiChip>
      <div v-if="item.status === 'pending' && actions" class="flex gap-3">
        <UiButton variant="secondary" @click="$emit('decline', item)">Tolak</UiButton>
        <UiButton @click="$emit('accept', item)">Terima</UiButton>
      </div>
      <UiButton v-else-if="item.status === 'accepted' && item.phone" variant="secondary" icon="external" :href="whatsappUrl(whatsappBase, item.phone)">Lanjut ke WhatsApp</UiButton>
    </div>
  </UiCard>
</template>
