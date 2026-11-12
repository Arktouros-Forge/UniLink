<script setup>
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "admin", access: "admin", title: "Kategori" });
const fields = [
  { key: "name", label: "Nama kategori", required: true },
  { key: "description", label: "Deskripsi", multiline: true },
  { key: "color", label: "Warna (hex)", required: true },
];
const columns = [
  { key: "name", label: "Nama kategori", width: "1.4fr" },
  { key: "color", label: "Warna" },
  { key: "usage", label: "Kompetisi" },
  { key: "createdAt", label: "Tanggal dibuat" },
];
const crud = useAdminCrud("admin-categories", "/admin/categories", { toPayload: ({ name, description, color }) => ({ name, description: description || null, color }) });
await crud.request;
</script>

<template>
  <AdminList
    id="admin-categories-table" title="Kategori" text="Kelompokkan kompetisi agar mudah ditemukan."
    add-label="Tambah kategori" noun="kategori" :columns="columns"
    v-model:search="crud.search.value" v-model:page="crud.page.value" :total="crud.total.value" :rows="crud.rows.value" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-color="{ value }"><span class=":uno: inline-flex items-center gap-2 t-mono-s"><span class=":uno: size-3 border border-outline" :style="{ background: value }" />{{ value }}</span></template>
    <template #cell-createdAt="{ value }"><span class=":uno: t-mono-s">{{ formatDate(value) }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah kategori' : 'Tambah kategori'" :fields="fields" :initial="crud.editing.value || {}" :pending="crud.saving.value" :errors="crud.errors.value" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus kategori?" text="Kategori yang masih dipakai kompetisi tidak dapat dihapus." @close="crud.removing.value = null" @confirm="crud.confirmRemove()" />
</template>
