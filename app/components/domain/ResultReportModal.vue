<script setup>
import { teamResults } from "@app/constants/options.json";

defineProps({ open: { type: Boolean, default: false }, pending: { type: Boolean, default: false } });
const emit = defineEmits(["close", "save"]);
const result = ref("");
</script>

<template>
  <UiModal :open="open" title="Laporkan hasil" @close="emit('close')">
    <FormField label="Hasil kompetisi" v-slot="{ id }"><FormSelect :id="id" v-model="result" :options="teamResults" placeholder="Pilih hasil" /></FormField>
    <UiCallout title="Dapat diubah kembali" tone="info">Semua anggota tim yang diterima bisa memperbarui laporan ini.</UiCallout>
    <template #footer>
      <UiButton icon="check" :loading="pending" :disabled="!result" @click="emit('save', result)">Kirim laporan</UiButton>
      <UiButton variant="link" @click="emit('close')">Batal</UiButton>
    </template>
  </UiModal>
</template>
