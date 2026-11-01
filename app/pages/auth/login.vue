<script setup>
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "auth" });

const auth = useAuthStore();
const ui = useUiStore();
const route = useRoute();

const submit = async ({ email }) => {
  const user = auth.login(email);
  if (user.status === "blocked") return navigateTo("/auth/blocked");
  ui.notify(`Selamat datang, ${firstName(user.fullName)}`, "good");
  await navigateTo(route.query.redirect || auth.homePath);
};
</script>

<template>
  <div class="grid gap-6">
    <header class="grid gap-1">
      <h1 class="type-h1">Masuk</h1>
      <p class="type-body text-mute">Lanjutkan ke akun UniLink-mu.</p>
    </header>
    <LoginForm @submit="submit" />
    <p class="type-small text-mute">Belum punya akun? <NuxtLink to="/auth/register" class="font-medium text-brand-blue">Daftar</NuxtLink></p>
  </div>
</template>
