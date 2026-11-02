<script setup>
import { skills } from "@app/constants/mock/people.json";
import { skill as schema } from "@app/constants/forms.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("admin-skills", { rows: skills });
const rows = ref(skills.map((item) => ({ ...item })));
const columns = [{ key: "name", label: "Nama" }, { key: "users", label: "Pengguna" }];
const save = (row) => {
  rows.value = row.id ? rows.value.map((item) => (item.id === row.id ? row : item)) : [{ ...row, id: Date.now() }, ...rows.value];
};
const remove = (row) => (rows.value = rows.value.filter((item) => item.id !== row.id));
</script>

<template>
  <AdminCrud id="admin-skills-table" title="Keahlian" :columns="columns" :rows="rows" :schema="schema" add-label="Tambah keahlian" :loading="pending" @save="save" @remove="remove" />
</template>
