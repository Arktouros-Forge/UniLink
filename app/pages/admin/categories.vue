<script setup>
import { useReferenceStore } from "@app/stores/reference";

definePageMeta({ layout: "admin" });

const reference = useReferenceStore();
const columns = [
  { key: "name", label: "Nama" },
  { key: "color", label: "Warna" },
  { key: "description", label: "Deskripsi" },
];
const fields = [
  { key: "name", label: "Nama", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "color", label: "Warna", type: "color" },
  { key: "description", label: "Deskripsi", as: "textarea" },
];
</script>

<template>
  <AdminCrud
    title="Kategori"
    text="Kategori kompetisi."
    :rows="reference.categories"
    :columns="columns"
    :fields="fields"
    @add="reference.categoryCrud.add"
    @update="reference.categoryCrud.update"
    @remove="reference.categoryCrud.remove"
  >
    <template #color="{ row }">
      <span class="inline-flex items-center gap-2"><span class="size-4 rounded-full" :style="{ background: row.color }" />{{ row.color }}</span>
    </template>
  </AdminCrud>
</template>
