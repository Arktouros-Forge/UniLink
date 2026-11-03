<script setup>
import { users, totals } from "@app/constants/mock/admin.json";
import { years } from "@app/constants/options.json";
import { useAdminCrud } from "@app/composables/useAdminCrud";

definePageMeta({ layout: "admin", middleware: "auth", title: "Pengguna" });
const fields = [
  { key: "name", label: "Nama", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "cohort", label: "Angkatan", options: years },
];
const columns = [
  { key: "name", label: "Nama", width: "1.2fr" },
  { key: "email", label: "Email", width: "1.4fr" },
  { key: "cohort", label: "Angkatan" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Bergabung" },
];
const crud = useAdminCrud("admin-users", users, fields);
</script>

<template>
  <AdminList
    id="admin-users-table" v-model:search="crud.search.value" title="Pengguna" text="Kelola akun mahasiswa dan blokir bila perlu."
    add-label="Tambah pengguna" noun="pengguna" :columns="columns" :rows="crud.shown.value" :total="totals.users" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="navigateTo(`/admin/users/${$event.id}`)" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-status="{ value }"><UiChip :tone="value === 'Aktif' ? 'success' : 'danger'" size="md">{{ value }}</UiChip></template>
    <template #cell-joined="{ value }"><span class="t-mono-s">{{ value }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" title="Tambah pengguna" :fields="fields" :initial="{}" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Blokir pengguna?" text="Pengguna tidak dapat masuk sampai blokir dibuka." action="Blokir" @close="crud.removing.value = null" @confirm="crud.confirmRemove" />
</template>
