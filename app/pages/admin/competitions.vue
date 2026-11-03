<script setup>
import { competitions, totals } from "@app/constants/mock/admin.json";
import { categoryOptions } from "@app/constants/mock/people.json";
import { useAdminCrud } from "@app/composables/useAdminCrud";

definePageMeta({ layout: "admin", middleware: "auth", title: "Kompetisi" });
const fields = [
  { key: "title", label: "Nama kompetisi", required: true },
  { key: "host", label: "Penyelenggara", required: true },
  { key: "category", label: "Kategori", options: categoryOptions },
  { key: "source", label: "Tautan sumber", type: "url" },
  { key: "deadline", label: "Batas pendaftaran" },
];
const columns = [
  { key: "title", label: "Nama kompetisi", width: "1.4fr" },
  { key: "host", label: "Penyelenggara" },
  { key: "category", label: "Kategori" },
  { key: "deadline", label: "Batas" },
  { key: "status", label: "Status" },
];
const crud = useAdminCrud("admin-competitions", competitions, fields);
</script>

<template>
  <AdminList
    id="admin-competitions-table" v-model:search="crud.search.value" title="Kompetisi" text="Tinjau dan kelola kompetisi dari admin dan mahasiswa."
    add-label="Tambah kompetisi" noun="kompetisi" :columns="columns" :rows="crud.shown.value" :total="totals.competitions" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-status="{ value }"><UiChip :tone="value === 'Terbuka' ? 'success' : 'yellow'" size="md">{{ value }}</UiChip></template>
    <template #cell-deadline="{ value }"><span class="t-mono-s">{{ value }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah kompetisi' : 'Tambah kompetisi'" :fields="fields" :initial="crud.editing.value || {}" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus kompetisi?" text="Tim yang terkait akan kehilangan kompetisinya." @close="crud.removing.value = null" @confirm="crud.confirmRemove" />
</template>
