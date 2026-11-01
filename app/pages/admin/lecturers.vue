<script setup>
import { useReferenceStore } from "@app/stores/reference";

definePageMeta({ layout: "admin" });

const reference = useReferenceStore();
const columns = [
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telepon" },
  { key: "nidn", label: "NIDN" },
];
const fields = [
  { key: "name", label: "Nama", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Telepon", type: "tel" },
  { key: "nidn", label: "NIDN" },
  { key: "bio", label: "Bio", as: "textarea" },
];
</script>

<template>
  <AdminCrud
    title="Dosen"
    text="Data dosen untuk jadwal kuliah."
    :rows="reference.lecturers"
    :columns="columns"
    :fields="fields"
    @add="reference.lecturerCrud.add"
    @update="reference.lecturerCrud.update"
    @remove="reference.lecturerCrud.remove"
  />
</template>
