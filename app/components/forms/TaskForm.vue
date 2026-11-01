<script setup>
import { priorities } from "@app/constants/options.json";

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save"]);

const form = reactive({ title: "", notes: "", dueDate: "", priority: "medium", ...props.initial });
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form })">
    <AppInput v-model="form.title" label="Judul" required />
    <AppInput v-model="form.notes" label="Catatan" as="textarea" :rows="3" />
    <div class="grid gap-4 sm:grid-cols-2">
      <AppInput v-model="form.dueDate" label="Tenggat" type="date" />
      <AppInput v-model="form.priority" label="Prioritas" as="select" :options="priorities" />
    </div>
    <AppButton type="submit" block>Simpan</AppButton>
  </form>
</template>
