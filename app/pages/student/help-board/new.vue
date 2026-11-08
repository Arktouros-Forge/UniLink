<script setup>
import { limits } from "@app/constants/options.json";
import { newSign as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Pasang tanda bantuan" });
const api = useApi();
const { data: skillOptions } = await useSkillOptions();
const form = reactive({ title: "", skillId: "", description: "", time: "" });
const options = computed(() => skillOptions.value.map((item) => ({ value: item.id, label: item.name })));
const valid = computed(() => form.title.length >= 5 && form.skillId && form.description.length >= 10);
const { run, pending, fieldErrors } = useAction(
  async () => {
    const created = await api.post("/student/study-match/help-signs", {
      skillId: form.skillId,
      title: form.title,
      description: form.description,
      preferredTime: form.time || null,
      expiresInDays: limits.signDays,
    });
    await navigateTo(`/student/help-board/${created.id}`);
  },
  { success: copy.created },
);
</script>

<template>
  <PageHeading :title="copy.title" :text="copy.text" />
  <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
    <UiCard class="flex flex-col gap-5">
      <FormField :label="copy.name" :error="fieldErrors.title" v-slot="{ id }"><FormInput :id="id" v-model="form.title" :placeholder="copy.namePlaceholder" /></FormField>
      <FormField :label="copy.skill" :error="fieldErrors.skillId" v-slot="{ id }"><FormSelect :id="id" v-model="form.skillId" :options="options" :placeholder="copy.skillPlaceholder" /></FormField>
      <FormField :label="copy.detail" :error="fieldErrors.description" v-slot="{ id }"><FormTextarea :id="id" v-model="form.description" /></FormField>
      <FormField :label="copy.time" optional v-slot="{ id }"><FormInput :id="id" v-model="form.time" :placeholder="copy.timePlaceholder" /></FormField>
      <div class="flex gap-3">
        <UiButton icon="flag" :loading="pending" :disabled="!valid" @click="run()">{{ copy.submit }}</UiButton>
        <UiButton variant="link" to="/student/help-board">{{ copy.cancel }}</UiButton>
      </div>
    </UiCard>
    <UiCallout :title="copy.limitTitle" tone="info">Maksimal {{ limits.activeSigns }} tanda aktif dan {{ limits.signsPerWeek }} tanda per pekan. Tanda berlaku {{ limits.signDays }} hari.</UiCallout>
  </div>
</template>
