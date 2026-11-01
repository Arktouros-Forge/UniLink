<script setup>
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "auth" });

const ui = useUiStore();
const email = ref("");

const submit = async () => {
  ui.notify("Tautan pemulihan dikirim ke emailmu", "good");
  await navigateTo("/auth/reset-password");
};
</script>

<template>
  <form class="grid gap-6" @submit.prevent="submit">
    <header class="grid gap-1">
      <h1 class="type-h1">Lupa kata sandi</h1>
      <p class="type-body text-mute">Kami kirim tautan pemulihan ke emailmu.</p>
    </header>
    <AppInput v-model="email" label="Email kampus" type="email" required />
    <AppButton type="submit" block>Kirim tautan</AppButton>
    <NuxtLink to="/auth/login" class="type-small font-medium text-brand-blue">Kembali ke masuk</NuxtLink>
  </form>
</template>
