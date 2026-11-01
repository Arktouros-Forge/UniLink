<script setup>
import { years } from "@app/constants/options.json";

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save"]);

const form = reactive({ fullName: "", nim: "", phone: "", year: "", website: "", skillIds: [], ...props.initial });
const yearOptions = years.map((year) => ({ value: String(year), label: String(year) }));
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form })">
    <AppInput v-model="form.fullName" label="Nama lengkap" required />
    <div class="grid gap-4 sm:grid-cols-2">
      <AppInput v-model="form.nim" label="NIM" required />
      <AppInput v-model="form.year" label="Angkatan" as="select" placeholder="Pilih angkatan" :options="yearOptions" required />
    </div>
    <AppInput v-model="form.phone" label="Nomor WhatsApp" type="tel" required />
    <AppInput v-model="form.website" label="Situs pribadi" type="url" />
    <div class="grid gap-1.5">
      <span class="type-small font-medium">Keahlian</span>
      <SkillPicker v-model="form.skillIds" />
    </div>
    <AppButton type="submit" block>Simpan</AppButton>
  </form>
</template>
