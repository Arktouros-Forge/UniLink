<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  owner: { type: Boolean, default: false },
});
defineEmits(["accept", "decline"]);
const tones = { pending: "yellow", accepted: "success", declined: "neutral" };
const labels = { pending: "Menunggu", accepted: "Diterima", declined: "Ditolak", expired: "Kedaluwarsa", cancelled: "Dibatalkan" };
</script>

<template>
  <div class=":uno: flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between">
    <div class=":uno: flex gap-3 min-w-0">
      <UiAvatar :name="item.helper.fullName" :size="40" />
      <div class=":uno: flex flex-col gap-1 min-w-0">
        <p class=":uno: t-label text-ink m-0">{{ item.helper.fullName }}</p>
        <p class=":uno: t-body-xs text-ink-2 m-0">{{ item.helper.major }} · Angkatan {{ item.helper.year }}</p>
        <p class=":uno: t-body-s text-ink m-0">{{ item.description }}</p>
      </div>
    </div>
    <div class=":uno: flex items-center gap-2 shrink-0">
      <UiButton v-if="item.status === 'accepted' && item.contact?.whatsappUrl" variant="secondary" size="sm" icon="external" :href="item.contact.whatsappUrl">WhatsApp</UiButton>
      <UiChip v-if="!owner || item.status !== 'pending'" :tone="tones[item.status]">{{ labels[item.status] }}</UiChip>
      <template v-else>
        <UiButton variant="secondary" size="sm" @click="$emit('decline', item)">Tolak</UiButton>
        <UiButton size="sm" icon="check" @click="$emit('accept', item)">Terima</UiButton>
      </template>
    </div>
  </div>
</template>
