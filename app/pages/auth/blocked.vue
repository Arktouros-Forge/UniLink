<script setup>
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth" });

const auth = useAuthStore();
</script>

<template>
  <div class="grid gap-6">
    <header class="grid gap-1">
      <span class="i-keyline-ban text-3xl text-brand-red" />
      <h1 class="type-h1">Akunmu diblokir</h1>
      <p class="type-body text-mute">{{ auth.user?.blockedReason || "Hubungi admin untuk informasi lebih lanjut." }}</p>
    </header>
    <AppButton to="/auth/login" variant="secondary" block @click="auth.logout()">Kembali ke masuk</AppButton>
  </div>
</template>
