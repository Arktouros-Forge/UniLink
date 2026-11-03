<script setup>
import { categories, totals } from "@app/constants/mock/admin.json";
import { useAdminCrud } from "@app/composables/useAdminCrud";

definePageMeta({ layout: "admin", middleware: "auth", title: "Kategori" });
const fields = [{ key: "name", label: "Nama kategori", required: true }];
const columns = [
  { key: "name", label: "Nama kategori", width: "1.4fr" },
  { key: "skills", label: "Keahlian" },
  { key: "competitions", label: "Kompetisi" },
  { key: "created", label: "Tanggal dibuat" },
];
const crud = useAdminCrud("admin-categories", categories, fields);
</script>

<template>
  <AdminList
    id="admin-categories-table" v-model:search="crud.search.value" title="Kategori" text="Kelompokkan keahlian dan kompetisi agar mudah ditemukan."
    add-label="Tambah kategori" noun="kategori" :columns="columns" :rows="crud.shown.value" :total="totals.categories" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-created="{ value }"><span class="t-mono-s">{{ value }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah kategori' : 'Tambah kategori'" :fields="fields" :initial="crud.editing.value || {}" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus kategori?" text="Kompetisi dan keahlian pada kategori ini akan kehilangan kategorinya." @close="crud.removing.value = null" @confirm="crud.confirmRemove" />
</template>
