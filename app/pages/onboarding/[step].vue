<script setup>
import { onboardingSteps } from "@app/constants/options.json";
import { profile, contact } from "@app/constants/forms.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", middleware: "auth" });
const route = useRoute();
const auth = useAuthStore();
const step = computed(() => Math.min(Math.max(Number(route.params.step) || 1, 1), onboardingSteps.length));
const current = computed(() => onboardingSteps[step.value - 1]);
const picked = ref([...auth.user.skills]);
const schema = computed(() => (step.value === 1 ? profile : contact));

const next = (values = {}) => {
  auth.updateProfile({ ...values, skills: picked.value });
  navigateTo(step.value >= onboardingSteps.length ? "/student/dashboard" : `/onboarding/${step.value + 1}`);
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-2">
      <span v-for="index in onboardingSteps.length" :key="index" class="h-1.5 flex-1 rounded-full" :class="index <= step ? 'bg-brand-blue' : 'bg-edge'" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="type-meta">Langkah {{ step }} dari {{ onboardingSteps.length }}</p>
      <h1 class="type-h1">{{ current.title }}</h1>
      <p class="type-body">{{ current.text }}</p>
    </div>
    <FieldsForm v-if="step === 1 || step === 3" :key="step" :schema="schema" :initial="auth.user" submit-label="Lanjut" @submit="next" />
    <template v-else-if="step === 2">
      <SkillPicker v-model="picked" />
      <button class="btn-primary btn-lg" :disabled="!picked.length" @click="next()">Lanjut</button>
    </template>
    <button v-else class="btn-primary btn-lg" @click="next()">Mulai</button>
    <NuxtLink v-if="step > 1" :to="`/onboarding/${step - 1}`" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />Kembali</NuxtLink>
  </div>
</template>
