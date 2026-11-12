<script setup>
import { admin as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "admin", access: "admin", title: "Keahlian" });
const fields = [
  { key: "name", label: "Nama keahlian", required: true },
  { key: "description", label: "Deskripsi", multiline: true },
];
const columns = [
  { key: "name", label: "Nama keahlian", width: "1.2fr" },
  { key: "description", label: "Deskripsi", width: "1.6fr" },
  { key: "usage", label: "Penggunaan" },
  { key: "createdAt", label: "Tanggal dibuat" },
];
const crud = useAdminCrud("admin-skills", "/admin/skills", { toPayload: ({ name, description }) => ({ name, description: description || null }) });
await crud.request;
</script>

<template>
  <AdminList
    id="admin-skills-table" title="Keahlian" text="Kelola keahlian untuk profil, tanda bantuan, dan tim kampus."
    add-label="Tambah keahlian" noun="keahlian" :columns="columns"
    v-model:search="crud.search.value" v-model:page="crud.page.value" :total="crud.total.value" :rows="crud.rows.value" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-createdAt="{ value }"><span class=":uno: t-mono-s">{{ formatDate(value) }}</span></template>
    <template #footer><UiCallout :title="copy.skillsFooterTitle">{{ copy.skillsFooterText }}</UiCallout></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah keahlian' : 'Tambah keahlian'" :fields="fields" :initial="crud.editing.value || {}" :pending="crud.saving.value" :errors="crud.errors.value" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus keahlian?" text="Keahlian yang masih digunakan tidak dapat dihapus." @close="crud.removing.value = null" @confirm="crud.confirmRemove()" />
</template>
