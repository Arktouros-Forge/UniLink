<script setup>
import { onboarding, years } from "@app/constants/options.json";
import { formatPhone } from "@app/utils/format";
import { useAuthStore } from "@app/stores/auth";
import { useOnboardingStore } from "@app/stores/onboarding";

definePageMeta({ layout: "auth", middleware: "auth", allowIncomplete: true });
const route = useRoute();
const auth = useAuthStore();
const api = useApi();
const { data: skillOptions } = await useSkillOptions();
const step = computed(() => Math.min(Math.max(Number(route.params.step) || 1, 1), onboarding.length));
const current = computed(() => onboarding[step.value - 1]);
const onboardingStore = useOnboardingStore();
onboardingStore.hydrate(auth.user);
const form = onboardingStore.form;
const skillNames = computed(() => skillOptions.value.filter((item) => form.skills.includes(item.id)).map((item) => item.name));
const yearOptions = years.map(String);
const last = computed(() => step.value >= onboarding.length);
const normalizedPhone = computed(() => `+62${form.phone.replace(/\D/g, "").replace(/^62/, "").replace(/^0+/, "")}`);
const stepReady = computed(
  () =>
    [
      form.name.trim().length >= 2 && Boolean(form.cohort),
      form.skills.length > 0,
      /^\+62[0-9]{8,13}$/.test(normalizedPhone.value),
      true,
    ][step.value - 1],
);

const { run, pending, fieldErrors } = useAction(async () => {
  const profile = await api.patch("/me", {
    fullName: form.name,
    year: form.cohort,
    skills: form.skills,
    bio: form.bio || null,
    phone: form.phone,
    onboarded: true,
  });
  auth.update(profile);
  await auth.fetchMe({ force: true });
  onboardingStore.reset();
  await navigateTo("/student/dashboard");
}, { success: "Profil lengkap. Selamat datang!" });

const next = () => (last.value ? run() : navigateTo(`/onboarding/${step.value + 1}`));
</script>

<template>
  <div class="w-full max-w-[640px] self-start flex flex-col gap-8 md:mt-8">
    <UiStepper :steps="onboarding" :current="step" />
    <div class="flex flex-col gap-2">
      <h1 class="t-d2 text-ink m-0">{{ current.title }}</h1>
      <p class="t-body-m text-ink-2 m-0">{{ current.text }}</p>
    </div>
    <UiCard class="flex flex-col gap-5">
      <template v-if="step === 1">
        <FormField label="Nama lengkap" :error="fieldErrors.fullName" v-slot="{ id }"><FormInput :id="id" v-model="form.name" /></FormField>
        <FormField label="Angkatan" :error="fieldErrors.year" v-slot="{ id }"><FormSelect :id="id" v-model="form.cohort" :options="yearOptions" placeholder="Pilih angkatan" /></FormField>
      </template>
      <template v-else-if="step === 2">
        <SkillPicker v-model="form.skills" />
      </template>
      <template v-else-if="step === 3">
        <FormField label="Profil singkat" optional v-slot="{ id }"><FormTextarea :id="id" v-model="form.bio" /></FormField>
        <FormField label="Nomor WhatsApp" :error="fieldErrors.phone" hint="Contoh 0812 3456 7890. Hanya dibagikan setelah kamu menerima permintaan." v-slot="{ id }"><FormInput :id="id" v-model="form.phone" icon="phone" /></FormField>
      </template>
      <template v-else>
        <div class="flex items-center gap-4"><UiAvatar :name="form.name" :size="56" /><div><p class="t-d4 text-ink m-0">{{ form.name }}</p><p class="t-body-s text-ink-2 m-0">Angkatan {{ form.cohort }}</p></div></div>
        <div class="flex flex-wrap gap-2"><UiChip v-for="skill in skillNames" :key="skill" tone="blue">{{ skill }}</UiChip></div>
        <p v-if="form.bio" class="t-body-s text-ink m-0">{{ form.bio }}</p>
        <p class="t-body-s text-ink m-0 flex items-center gap-2"><UiIcon name="phone" />{{ formatPhone(normalizedPhone) }}</p>
      </template>
    </UiCard>
    <div class="flex items-center justify-between">
      <UiButton v-if="step > 1" :to="`/onboarding/${step - 1}`" variant="link" icon="arrowLeft">Kembali</UiButton>
      <span v-else />
      <UiButton icon-end="arrowRight" :loading="pending" :disabled="!stepReady" @click="next">{{ step >= onboarding.length ? "Mulai" : "Lanjut" }}</UiButton>
    </div>
  </div>
</template>
