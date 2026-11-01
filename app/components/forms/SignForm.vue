<script setup>
import { useReferenceStore } from "@app/stores/reference";

const emit = defineEmits(["save"]);
const reference = useReferenceStore();
const form = reactive({ skillId: "", title: "", description: "", preferredTime: "" });
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form })">
    <AppInput v-model="form.skillId" label="Mata kuliah atau keahlian" as="select" placeholder="Pilih" :options="reference.skillOptions" required />
    <AppInput v-model="form.title" label="Judul" required />
    <AppInput v-model="form.description" label="Deskripsi" as="textarea" :rows="3" required />
    <AppInput v-model="form.preferredTime" label="Waktu yang cocok" />
    <AppButton type="submit" block>Pasang Help Sign</AppButton>
  </form>
</template>
