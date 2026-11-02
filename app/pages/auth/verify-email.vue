<script setup>
import { verify as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth" });
const auth = useAuthStore();
const cooldown = ref(60);
let timer;
onMounted(() => {
  timer = setInterval(() => (cooldown.value = Math.max(0, cooldown.value - 1)), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
const resend = () => (cooldown.value = 60);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <div class="card flex flex-col gap-3">
      <span class="i-keyline-icons-mail text-3xl text-brand-blue" />
      <h2 class="type-h3">{{ copy.cardTitle }}</h2>
      <p class="type-body">{{ copy.cardText }} <strong class="text-ink">{{ auth.user.email }}</strong>.</p>
    </div>
    <div class="card bg-soft flex flex-col gap-1"><p class="type-label">{{ copy.noticeTitle }}</p><p class="type-small">{{ copy.noticeText }}</p></div>
    <button class="btn-primary btn-lg" :disabled="cooldown > 0" @click="resend">{{ copy.resend }}{{ cooldown ? ` (${cooldown})` : "" }}</button>
    <NuxtLink to="/onboarding/1" class="btn-secondary btn-lg">Lanjut ke profil</NuxtLink>
    <NuxtLink to="/auth/register" class="btn-ghost self-start">{{ copy.back }}</NuxtLink>
    <p class="type-small">{{ copy.footnote }}</p>
  </div>
</template>
