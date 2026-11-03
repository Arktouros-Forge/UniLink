<script setup>
import { skillOptions } from "@app/constants/mock/people.json";
import { limits } from "@app/constants/options.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Pasang tanda bantuan" });
const form = reactive({ title: "", skill: "", detail: "" });
const valid = computed(() => form.title && form.skill);
</script>

<template>
  <PageHeading title="Pasang tanda bantuan" text="Tulis kebutuhanmu agar teman yang tepat bisa menemukanmu." />
  <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
    <UiCard class="flex flex-col gap-5">
      <FormField label="Judul" v-slot="{ id }"><FormInput :id="id" v-model="form.title" placeholder="Contoh: Butuh bantuan Python rekursi" /></FormField>
      <FormField label="Keahlian dibutuhkan" v-slot="{ id }"><FormSelect :id="id" v-model="form.skill" :options="skillOptions" placeholder="Pilih keahlian" /></FormField>
      <FormField label="Detail" optional v-slot="{ id }"><FormTextarea :id="id" v-model="form.detail" /></FormField>
      <div class="flex gap-3">
        <UiButton icon="flag" :disabled="!valid" @click="navigateTo('/student/help-board/mine')">Pasang tanda</UiButton>
        <UiButton variant="link" to="/student/help-board">Batal</UiButton>
      </div>
    </UiCard>
    <UiCallout title="Batas tanda" tone="info">Maksimal {{ limits.activeSigns }} tanda aktif dan {{ limits.signsPerWeek }} tanda per pekan. Tanda berlaku {{ limits.signDays }} hari.</UiCallout>
  </div>
</template>
