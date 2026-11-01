<script setup>
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "auth" });

const ui = useUiStore();
</script>

<template>
  <div class="grid gap-6">
    <header class="grid gap-1">
      <span class="i-keyline-mail text-3xl text-brand-blue" />
      <h1 class="type-h1">Periksa emailmu</h1>
      <p class="type-body text-mute">Kami mengirim tautan verifikasi. Klik tautan tersebut untuk melanjutkan.</p>
    </header>
    <AppButton to="/onboarding/1" block>Saya sudah verifikasi</AppButton>
    <AppButton variant="ghost" block @click="ui.notify('Email verifikasi dikirim ulang')">Kirim ulang email</AppButton>
  </div>
</template>
