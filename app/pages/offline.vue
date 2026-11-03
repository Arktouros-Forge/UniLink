<script setup>
definePageMeta({ layout: false });
</script>

<template>
  <div class="min-h-dvh bg-paper flex flex-col">
    <header class="h-16 md:h-[72px] px-5 md:px-16 flex items-center"><UiLogo /></header>
    <main class="flex-1 flex items-center justify-center px-5 py-10">
      <div class="max-w-[520px] flex flex-col gap-6">
        <UiIcon name="server" size="text-5xl" class="text-red" />
        <h1 class="t-d2 text-ink m-0">Tidak ada koneksi.</h1>
        <p class="t-body-m text-ink-2 m-0">Periksa jaringanmu lalu coba lagi. Data yang belum disimpan tetap aman di perangkat ini.</p>
        <UiButton icon="refresh" class="self-start" @click="reloadNuxtApp()">Coba lagi</UiButton>
      </div>
    </main>
  </div>
</template>
