<script setup>
definePageMeta({ layout: "admin", middleware: "auth", title: "Dosen" });
const fields = [
  { key: "name", label: "Nama", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Nomor telepon" },
  { key: "nidn", label: "NIDN" },
  { key: "bio", label: "Profil", multiline: true },
];
const columns = [
  { key: "name", label: "Nama", width: "1.4fr" },
  { key: "email", label: "Email", width: "1.4fr" },
  { key: "phone", label: "Telepon" },
  { key: "usage", label: "Jadwal" },
];
const crud = useAdminCrud("admin-lecturers", "/admin/lecturers", {
  toPayload: ({ name, email, phone, nidn, bio }) => ({ name, email, phone: phone || null, nidn: nidn || null, bio: bio || null }),
});
await crud.request;
</script>

<template>
  <AdminList
    id="admin-lecturers-table" title="Dosen" text="Kontak dosen tertaut ke jadwal kuliah mahasiswa."
    add-label="Tambah dosen" noun="dosen" :columns="columns"
    v-model:search="crud.search.value" v-model:page="crud.page.value" :total="crud.total.value" :rows="crud.rows.value" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="crud.edit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-phone="{ value }"><span class="t-mono-s">{{ value }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah dosen' : 'Tambah dosen'" :fields="fields" :initial="crud.editing.value || {}" :pending="crud.saving.value" :errors="crud.errors.value" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus dosen?" text="Jadwal yang tertaut akan kehilangan nama dosen." @close="crud.removing.value = null" @confirm="crud.confirmRemove()" />
</template>
