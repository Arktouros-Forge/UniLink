<script setup>
import { categoryOptions } from "@app/constants/mock/people.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Tambah kompetisi" });
const form = reactive({ title: "", host: "", source: "", deadline: "", categories: [] });
const toggle = (item) => (form.categories = form.categories.includes(item) ? form.categories.filter((entry) => entry !== item) : [...form.categories, item]);
const valid = computed(() => form.title && form.host && form.source);
</script>

<template>
  <PageHeading title="Tambah kompetisi" text="Bagikan kompetisi untuk kampus. Sertakan tautan resmi agar mudah diverifikasi." />
  <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
    <UiCard class="flex flex-col gap-5">
      <FormField label="Nama kompetisi" v-slot="{ id }"><FormInput :id="id" v-model="form.title" /></FormField>
      <FormField label="Penyelenggara" v-slot="{ id }"><FormInput :id="id" v-model="form.host" /></FormField>
      <FormField label="Tautan resmi" v-slot="{ id }"><FormInput :id="id" v-model="form.source" type="url" icon="external" placeholder="https://" /></FormField>
      <FormField label="Batas pendaftaran" v-slot="{ id }"><FormInput :id="id" v-model="form.deadline" type="date" /></FormField>
      <FormField label="Kategori" v-slot="{ id }">
        <div :id="id" class="flex flex-wrap gap-2">
          <button v-for="item in categoryOptions" :key="item" type="button" class="bg-transparent border-0 p-0 cursor-pointer" @click="toggle(item)"><UiChip size="md" :outline="form.categories.includes(item)">{{ item }}</UiChip></button>
        </div>
      </FormField>
      <div class="flex gap-3">
        <UiButton :disabled="!valid" @click="navigateTo('/student/competitions')">Simpan kompetisi</UiButton>
        <UiButton variant="link" to="/student/competitions">Batal</UiButton>
      </div>
    </UiCard>
    <UiCallout title="Ditinjau admin" tone="info">Kompetisi mahasiswa ditandai sampai admin memverifikasi tautan resmi.</UiCallout>
  </div>
</template>
