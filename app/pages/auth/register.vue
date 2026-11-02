<script setup>
import { register as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth" });
const auth = useAuthStore();
const form = reactive({ email: "", password: "", confirm: "", agree: false });
const mismatch = computed(() => form.confirm && form.confirm !== form.password);
const valid = computed(() => form.email && form.password.length >= 8 && !mismatch.value && form.agree);
const submit = () => {
  if (!valid.value) return;
  auth.login({ email: form.email, name: form.email.split("@")[0] });
  navigateTo("/auth/verify-email");
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <FormField :label="copy.email"><input v-model="form.email" type="email" class="field" autocomplete="email" /></FormField>
      <FormField :label="copy.password" :hint="copy.passwordHint"><input v-model="form.password" type="password" class="field" autocomplete="new-password" /></FormField>
      <FormField :label="copy.confirm" :error="mismatch ? copy.confirmError : ''"><input v-model="form.confirm" type="password" class="field" autocomplete="new-password" /></FormField>
      <label class="flex items-start gap-2 type-small">
        <input v-model="form.agree" type="checkbox" class="mt-1 accent-[var(--blue)]" />
        <span>{{ copy.terms }} <NuxtLink to="/terms" class="!text-brand-blue">{{ copy.termsLink }}</NuxtLink> {{ copy.and }} <NuxtLink to="/privacy" class="!text-brand-blue">{{ copy.privacyLink }}</NuxtLink> {{ copy.termsSuffix }}</span>
      </label>
      <button type="submit" class="btn-primary btn-lg" :disabled="!valid">{{ copy.submit }}</button>
    </form>
    <button class="btn-secondary btn-lg !text-ink"><span class="i-keyline-icons-globe" />{{ copy.google }}</button>
    <p class="type-small text-center">{{ copy.prompt }} <NuxtLink to="/auth/login" class="!text-brand-blue font-medium">{{ copy.switch }}</NuxtLink></p>
  </div>
</template>
