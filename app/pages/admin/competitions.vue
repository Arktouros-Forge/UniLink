<script setup>
import { competitions } from "@app/constants/mock/competitions.json";
import { competition as schema } from "@app/constants/forms.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("admin-competitions", { rows: competitions });
const rows = ref(competitions.map((item) => ({ ...item })));
const columns = [
  { key: "title", label: "Nama" },
  { key: "host", label: "Penyelenggara" },
  { key: "categories", label: "Kategori" },
  { key: "deadline", label: "Batas" },
  { key: "status", label: "Status", chip: true },
];
const save = (row) => {
  rows.value = row.id ? rows.value.map((item) => (item.id === row.id ? row : item)) : [{ status: "open", teams: 0, ...row, id: Date.now() }, ...rows.value];
};
const remove = (row) => (rows.value = rows.value.filter((item) => item.id !== row.id));
</script>

<template>
  <AdminCrud id="admin-competitions-table" title="Kompetisi" :columns="columns" :rows="rows" :schema="schema" add-label="Tambah kompetisi" :loading="pending" @save="save" @remove="remove" />
</template>
