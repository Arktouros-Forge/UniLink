<script setup>
import { skills, totals } from "@app/constants/mock/admin.json";
import { categoryOptions } from "@app/constants/mock/people.json";
import { useAdminCrud } from "@app/composables/useAdminCrud";

definePageMeta({ layout: "admin", middleware: "auth", title: "Keahlian" });
const fields = [
  { key: "name", label: "Nama keahlian", required: true },
  { key: "category", label: "Kategori", options: categoryOptions, required: true },
];
const columns = [
  { key: "name", label: "Nama keahlian", width: "1.2fr" },
  { key: "category", label: "Kategori" },
  { key: "usage", label: "Penggunaan" },
  { key: "created", label: "Tanggal dibuat" },
];
const crud = useAdminCrud("admin-skills", skills, fields);
const toneOf = { Pemrograman: "neutral", Desain: "yellow", Komunikasi: "red" };
</script>

<template>
  <AdminList
    id="admin-skills-table" v-model:search="crud.search.value" title="Keahlian" text="Kelola keahlian untuk profil, tanda bantuan, dan tim kampus."
    add-label="Tambah keahlian" noun="keahlian" :columns="columns" :rows="crud.shown.value" :total="totals.skills" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-category="{ value }"><UiChip :tone="toneOf[value] || 'neutral'" size="md">{{ value }}</UiChip></template>
    <template #cell-created="{ value }"><span class="t-mono-s">{{ value }}</span></template>
    <template #footer><UiCallout title="Keahlian yang digunakan tidak dapat dihapus.">Pindahkan referensi profil dan tim terlebih dahulu. Mengedit nama tidak menghapus hubungan yang sudah ada.</UiCallout></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah keahlian' : 'Tambah keahlian'" :fields="fields" :initial="crud.editing.value || {}" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus keahlian?" text="Keahlian yang masih digunakan tidak dapat dihapus." @close="crud.removing.value = null" @confirm="crud.confirmRemove" />
</template>
