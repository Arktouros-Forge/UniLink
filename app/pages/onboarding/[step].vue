<script setup>
import { onboarding, years } from "@app/constants/options.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", middleware: "auth" });
const route = useRoute();
const auth = useAuthStore();
const step = computed(() => Math.min(Math.max(Number(route.params.step) || 1, 1), onboarding.length));
const current = computed(() => onboarding[step.value - 1]);
const form = reactive({ name: auth.user.name, cohort: auth.user.cohort, skills: [...auth.user.skills], bio: auth.user.bio, phone: auth.user.phone });
const next = () => {
  auth.update({ ...form });
  navigateTo(step.value >= onboarding.length ? "/student/dashboard" : `/onboarding/${step.value + 1}`);
};
</script>

<template>
  <div class="w-full max-w-[640px] flex flex-col gap-8">
    <UiStepper :steps="onboarding" :current="step" />
    <div class="flex flex-col gap-2">
      <p class="t-mono-s text-ink-2 m-0">Langkah {{ step }} dari {{ onboarding.length }}</p>
      <h1 class="t-d2 text-ink m-0 !text-[36px] !leading-[44px]">{{ current.title }}</h1>
      <p class="t-body-m text-ink-2 m-0">{{ current.text }}</p>
    </div>
    <UiCard class="flex flex-col gap-5">
      <template v-if="step === 1">
        <FormField label="Nama lengkap" v-slot="{ id }"><FormInput :id="id" v-model="form.name" /></FormField>
        <FormField label="Angkatan" v-slot="{ id }"><FormSelect :id="id" v-model="form.cohort" :options="years" /></FormField>
      </template>
      <template v-else-if="step === 2">
        <SkillPicker v-model="form.skills" />
      </template>
      <template v-else-if="step === 3">
        <FormField label="Profil singkat" v-slot="{ id }"><FormTextarea :id="id" v-model="form.bio" /></FormField>
        <FormField label="Nomor WhatsApp" hint="Hanya dibagikan setelah kamu menerima permintaan." v-slot="{ id }"><FormInput :id="id" v-model="form.phone" icon="phone" /></FormField>
      </template>
      <template v-else>
        <div class="flex items-center gap-4"><UiAvatar :name="form.name" :size="56" /><div><p class="t-d4 text-ink m-0">{{ form.name }}</p><p class="t-body-s text-ink-2 m-0">Angkatan {{ form.cohort }}</p></div></div>
        <div class="flex flex-wrap gap-2"><UiChip v-for="skill in form.skills" :key="skill">{{ skill }}</UiChip></div>
        <p class="t-body-s text-ink m-0">{{ form.bio }}</p>
        <p class="t-mono-s text-ink m-0">{{ form.phone }}</p>
      </template>
    </UiCard>
    <div class="flex items-center justify-between">
      <UiButton v-if="step > 1" :to="`/onboarding/${step - 1}`" variant="link" icon="arrowLeft">Kembali</UiButton>
      <span v-else />
      <UiButton icon-end="arrowRight" @click="next">{{ step >= onboarding.length ? "Mulai" : "Lanjut" }}</UiButton>
    </div>
  </div>
</template>
