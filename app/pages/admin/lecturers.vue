<script setup>
import { lecturers } from "@app/constants/mock/people.json";
import { lecturer as schema } from "@app/constants/forms.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("admin-lecturers", { rows: lecturers });
const rows = ref(lecturers.map((item) => ({ ...item })));
const columns = [{ key: "name", label: "Nama" }, { key: "email", label: "Email" }, { key: "phone", label: "Telepon" }];
const save = (row) => {
  rows.value = row.id ? rows.value.map((item) => (item.id === row.id ? row : item)) : [{ ...row, id: Date.now() }, ...rows.value];
};
const remove = (row) => (rows.value = rows.value.filter((item) => item.id !== row.id));
</script>

<template>
  <AdminCrud id="admin-lecturers-table" title="Dosen" :columns="columns" :rows="rows" :schema="schema" add-label="Tambah dosen" :loading="pending" @save="save" @remove="remove" />
</template>
