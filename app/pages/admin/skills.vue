<script setup>
import { useReferenceStore } from "@app/stores/reference";

definePageMeta({ layout: "admin" });

const reference = useReferenceStore();
const columns = [
  { key: "name", label: "Nama" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Deskripsi" },
];
const fields = [
  { key: "name", label: "Nama", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "description", label: "Deskripsi", as: "textarea" },
];
</script>

<template>
  <AdminCrud
    title="Keahlian"
    text="Mata kuliah dan keahlian yang bisa dipilih mahasiswa."
    :rows="reference.skills"
    :columns="columns"
    :fields="fields"
    @add="reference.skillCrud.add"
    @update="reference.skillCrud.update"
    @remove="reference.skillCrud.remove"
  />
</template>
