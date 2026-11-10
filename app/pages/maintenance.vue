<script setup>
import { siteName } from "@app/constants/site.json";

definePageMeta({ layout: false });
</script>

<template>
  <div class="min-h-dvh bg-paper flex flex-col">
    <header class="h-16 md:h-[72px] px-5 md:px-8 lg:px-16 flex items-center"><UiLogo /></header>
    <main class="flex-1 flex items-center justify-center px-5 py-10">
      <div class="max-w-[520px] flex flex-col gap-6">
        <UiIcon name="wrench" size="text-5xl" class="text-blue" />
        <h1 class="t-d2 text-ink m-0">{{ siteName }} sedang dirawat.</h1>
        <p class="t-body-m text-ink-2 m-0">Kami memperbarui layanan agar lebih baik. Coba lagi sebentar lagi.</p>
        <UiButton variant="secondary" icon="refresh" class="self-start" @click="reloadNuxtApp()">Muat ulang</UiButton>
      </div>
    </main>
  </div>
</template>
