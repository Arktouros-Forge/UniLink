<script setup>
import { useReferenceStore } from "@app/stores/reference";

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save"]);

const reference = useReferenceStore();
const form = reactive({ title: "", host: "", level: "", description: "", categoryIds: [], deadline: "", maxTeamSize: 4, status: "published", sourceUrl: "", imageUrl: "", ...props.initial });
form.deadline = form.deadline ? form.deadline.slice(0, 16) : "";
const statuses = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
  { value: "closed", label: "Ditutup" },
];

const toggleCategory = (id) => {
  form.categoryIds = form.categoryIds.includes(id) ? form.categoryIds.filter((item) => item !== id) : [...form.categoryIds, id];
};
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form, maxTeamSize: Number(form.maxTeamSize) })">
    <AppInput v-model="form.title" label="Nama kompetisi" required />
    <div class="grid gap-4 sm:grid-cols-2">
      <AppInput v-model="form.host" label="Penyelenggara" required />
      <AppInput v-model="form.level" label="Tingkat" />
    </div>
    <AppInput v-model="form.description" label="Deskripsi" as="textarea" :rows="3" />
    <div class="grid gap-1.5">
      <span class="type-small font-medium">Kategori</span>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in reference.categories"
          :key="category.id"
          type="button"
          class="chip cursor-pointer border"
          :class="form.categoryIds.includes(category.id) ? 'border-brand-blue bg-brand-blue text-onbrand' : 'border-edge bg-card text-ink'"
          @click="toggleCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <AppInput v-model="form.deadline" label="Batas pendaftaran" type="datetime-local" />
      <AppInput v-model="form.maxTeamSize" label="Maks. anggota" type="number" hint="0 untuk tanpa batas" />
      <AppInput v-model="form.status" label="Status" as="select" :options="statuses" />
    </div>
    <AppInput v-model="form.sourceUrl" label="Tautan sumber" type="url" />
    <AppInput v-model="form.imageUrl" label="Tautan gambar" type="url" />
    <AppButton type="submit" block>Simpan</AppButton>
  </form>
</template>
