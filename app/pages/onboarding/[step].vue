<script setup>
import { onboardingSteps, years } from "@app/constants/options.json";
import { useAuthStore } from "@app/stores/auth";
import { useReferenceStore } from "@app/stores/reference";
import { useUsersStore } from "@app/stores/users";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "auth" });

const route = useRoute();
const auth = useAuthStore();
const users = useUsersStore();
const reference = useReferenceStore();
const ui = useUiStore();

const step = computed(() => Math.min(Math.max(Number(route.params.step) || 1, 1), onboardingSteps.length));
const info = computed(() => onboardingSteps[step.value - 1]);
const last = computed(() => step.value === onboardingSteps.length);
const yearOptions = years.map((year) => ({ value: String(year), label: String(year) }));

const next = async () => {
  if (!last.value) return navigateTo(`/onboarding/${step.value + 1}`);
  users.update(auth.currentId, { ...auth.draft });
  auth.resetDraft();
  ui.notify("Profil siap digunakan", "good");
  await navigateTo(auth.homePath);
};
</script>

<template>
  <form class="grid gap-6" @submit.prevent="next">
    <header class="grid gap-1">
      <p class="type-meta text-mute">Langkah {{ step }} dari {{ onboardingSteps.length }}</p>
      <h1 class="type-h1">{{ info.title }}</h1>
      <p class="type-body text-mute">{{ info.text }}</p>
    </header>

    <template v-if="step === 1">
      <AppInput v-model="auth.draft.fullName" label="Nama lengkap" required />
      <AppInput v-model="auth.draft.nim" label="NIM" required />
      <AppInput v-model="auth.draft.phone" label="Nomor WhatsApp" type="tel" required />
      <AppInput v-model="auth.draft.year" label="Angkatan" as="select" placeholder="Pilih angkatan" :options="yearOptions" required />
    </template>

    <SkillPicker v-else-if="step === 2" v-model="auth.draft.skillIds" />

    <AppInput v-else-if="step === 3" v-model="auth.draft.website" label="Situs pribadi" type="url" />

    <AppCard v-else class="grid gap-2">
      <p class="type-h3">{{ auth.draft.fullName }}</p>
      <p class="type-small text-mute">{{ auth.draft.nim }} · Angkatan {{ auth.draft.year }} · {{ auth.draft.phone }}</p>
      <div class="flex flex-wrap gap-1.5">
        <AppChip v-for="id in auth.draft.skillIds" :key="id" tone="brand">{{ reference.skillsById[id]?.name }}</AppChip>
      </div>
    </AppCard>

    <div class="flex justify-between gap-3">
      <AppButton v-if="step > 1" :to="`/onboarding/${step - 1}`" variant="ghost">Kembali</AppButton>
      <span v-else />
      <AppButton type="submit">{{ last ? "Selesai" : "Lanjut" }}</AppButton>
    </div>
  </form>
</template>
