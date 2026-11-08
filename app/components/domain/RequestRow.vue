<script setup>
defineProps({
  item: { type: Object, required: true },
  actions: { type: Boolean, default: false },
});
defineEmits(["accept", "decline", "cancel"]);
</script>

<template>
  <UiCard padding="p-5 md:p-6" class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div class="flex gap-4 min-w-0">
      <UiAvatar :name="item.counterpart.fullName" :size="40" />
      <div class="flex flex-col gap-1 min-w-0">
        <p class="t-label text-ink m-0">{{ item.counterpart.fullName }}</p>
        <p class="t-body-s text-ink-2 m-0">{{ item.direction === "incoming" ? "Masuk" : "Keluar" }} · {{ item.subject }} · Angkatan {{ item.counterpart.year }}</p>
        <p class="t-body-s text-ink m-0">{{ item.description }}</p>
      </div>
    </div>
    <div class="flex flex-col items-start gap-3 md:items-end shrink-0">
      <UiChip v-if="item.status === 'pending'" tone="yellow" filled>Menunggu tanggapan</UiChip>
      <UiChip v-else-if="item.status === 'accepted'">Diterima</UiChip>
      <UiChip v-else-if="item.status === 'declined'" tone="danger">Ditolak</UiChip>
      <UiChip v-else tone="neutral">{{ item.status === "expired" ? "Kedaluwarsa" : "Dibatalkan" }}</UiChip>
      <div v-if="item.status === 'pending' && actions && item.direction === 'incoming'" class="flex gap-3">
        <UiButton variant="secondary" @click="$emit('decline', item)">Tolak</UiButton>
        <UiButton @click="$emit('accept', item)">Terima</UiButton>
      </div>
      <UiButton v-else-if="item.status === 'pending' && actions" variant="secondary" @click="$emit('cancel', item)">Batalkan</UiButton>
      <UiButton v-else-if="item.status === 'accepted' && item.contact?.whatsappUrl" variant="secondary" icon="external" :href="item.contact.whatsappUrl">Lanjut ke WhatsApp</UiButton>
    </div>
  </UiCard>
</template>
