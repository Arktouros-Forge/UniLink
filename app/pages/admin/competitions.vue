<script setup>
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "admin", middleware: "auth", title: "Kompetisi" });
const { data: categories } = await useCategoryOptions();
const statusOptions = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
  { value: "closed", label: "Ditutup" },
];
const fields = computed(() => [
  { key: "title", label: "Nama kompetisi", required: true },
  { key: "host", label: "Penyelenggara", required: true },
  { key: "description", label: "Deskripsi", multiline: true, required: true },
  { key: "categoryId", payloadKey: "categoryIds", label: "Kategori", options: categories.value.map((item) => ({ value: item.id, label: item.name })), required: true },
  { key: "sourceUrl", label: "Tautan sumber", type: "url" },
  { key: "deadline", label: "Batas pendaftaran", type: "date", required: true },
  { key: "status", label: "Status", options: statusOptions, required: true },
]);
const columns = [
  { key: "title", label: "Nama kompetisi", width: "1.4fr" },
  { key: "host", label: "Penyelenggara" },
  { key: "categoryName", label: "Kategori" },
  { key: "deadlineLabel", label: "Batas" },
  { key: "status", label: "Status" },
];
const normalize = (row) => ({
  ...row,
  categoryId: row.categories[0]?.id ?? "",
  categoryName: row.categories.map((item) => item.name).join(", "),
  deadlineLabel: formatDate(row.deadline),
  deadline: row.deadline.slice(0, 10),
});
const api = useApi();
const crud = useAdminCrud("admin-competitions", "/admin/competitions", {
  listKey: "competitions",
  toRow: normalize,
  toPayload: (values) => ({
    title: values.title,
    host: values.host,
    description: values.description,
    sourceUrl: values.sourceUrl || null,
    deadline: new Date(`${values.deadline}T23:59:00`).toISOString(),
    categoryIds: [values.categoryId],
    status: values.status,
  }),
});
await crud.request;
const openEdit = async (row) => crud.edit(normalize(await api.get(`/admin/competitions/${row.id}`)));
const tones = { published: "success", draft: "yellow", closed: "neutral" };
const labels = Object.fromEntries(statusOptions.map((item) => [item.value, item.label]));
</script>

<template>
  <AdminList
    id="admin-competitions-table" title="Kompetisi" text="Tinjau dan kelola kompetisi dari admin dan mahasiswa."
    add-label="Tambah kompetisi" noun="kompetisi" :columns="columns"
    v-model:search="crud.search.value" v-model:page="crud.page.value" :total="crud.total.value" :rows="crud.rows.value" :loading="crud.pending.value"
    :failed="crud.status.value === 'error'" @add="crud.add" @edit="openEdit" @remove="crud.removing.value = $event" @retry="crud.refresh"
  >
    <template #cell-status="{ value }"><UiChip :tone="tones[value]" size="md">{{ labels[value] }}</UiChip></template>
    <template #cell-deadlineLabel="{ value }"><span class="t-mono-s">{{ value }}</span></template>
  </AdminList>
  <EntityModal :open="crud.modalOpen.value" :title="crud.editing.value?.id ? 'Ubah kompetisi' : 'Tambah kompetisi'" :fields="fields" :initial="crud.editing.value || { status: 'published' }" :pending="crud.saving.value" :errors="crud.errors.value" @close="crud.modalOpen.value = false" @save="crud.save" />
  <ConfirmModal :open="!!crud.removing.value" title="Hapus kompetisi?" text="Tim yang terkait akan ikut terhapus." @close="crud.removing.value = null" @confirm="crud.confirmRemove()" />
</template>
