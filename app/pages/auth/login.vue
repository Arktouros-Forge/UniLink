<script setup>
import { login as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth" });
const auth = useAuthStore();
const form = reactive({ email: "", password: "", remember: true });
const show = ref(false);
const submit = () => {
  auth.login({ email: form.email || undefined });
  navigateTo("/student/dashboard");
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <p class="type-meta">{{ copy.meta }}</p>
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <FormField :label="copy.email"><input v-model="form.email" type="email" class="field" autocomplete="email" /></FormField>
      <FormField :label="copy.password">
        <div class="relative">
          <input v-model="form.password" :type="show ? 'text' : 'password'" class="field pr-12" autocomplete="current-password" />
          <button type="button" class="absolute right-1 top-1 size-10 inline-flex items-center justify-center bg-transparent border-0 text-mute cursor-pointer" @click="show = !show">
            <span :class="show ? 'i-keyline-icons-eye-off' : 'i-keyline-icons-eye'" class="text-xl" />
          </button>
        </div>
      </FormField>
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 type-small"><input v-model="form.remember" type="checkbox" class="accent-[var(--blue)]" />{{ copy.remember }}</label>
        <NuxtLink to="/auth/forgot" class="type-small !text-brand-blue">{{ copy.forgot }}</NuxtLink>
      </div>
      <button type="submit" class="btn-primary btn-lg">{{ copy.submit }}</button>
    </form>
    <div class="flex items-center gap-3"><span class="h-px flex-1 bg-edge" /><span class="type-meta">{{ copy.divider }}</span><span class="h-px flex-1 bg-edge" /></div>
    <button class="btn-secondary btn-lg !text-ink"><span class="i-keyline-icons-globe" />{{ copy.google }}</button>
    <p class="type-small text-center">{{ copy.prompt }} <NuxtLink to="/auth/register" class="!text-brand-blue font-medium">{{ copy.switch }}</NuxtLink></p>
  </div>
</template>
