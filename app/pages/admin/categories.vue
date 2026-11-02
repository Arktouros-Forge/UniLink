<script setup>
import { categories } from "@app/constants/mock/people.json";
import { category as schema } from "@app/constants/forms.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("admin-categories", { rows: categories });
const rows = ref(categories.map((item) => ({ ...item })));
const columns = [{ key: "name", label: "Nama" }, { key: "count", label: "Kompetisi" }];
const save = (row) => {
  rows.value = row.id ? rows.value.map((item) => (item.id === row.id ? row : item)) : [{ ...row, id: Date.now() }, ...rows.value];
};
const remove = (row) => (rows.value = rows.value.filter((item) => item.id !== row.id));
</script>

<template>
  <AdminCrud id="admin-categories-table" title="Kategori" :columns="columns" :rows="rows" :schema="schema" add-label="Tambah kategori" :loading="pending" @save="save" @remove="remove" />
</template>
