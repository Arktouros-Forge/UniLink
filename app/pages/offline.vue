<script setup>
definePageMeta({ layout: false });
</script>

<template>
  <div class=":uno: min-h-dvh bg-paper flex flex-col">
    <header class=":uno: h-16 md:h-[72px] px-5 md:px-8 lg:px-16 flex items-center"><UiLogo /></header>
    <main class=":uno: flex-1 flex items-center justify-center px-5 py-10">
      <div class=":uno: max-w-[520px] flex flex-col gap-6">
        <UiIcon name=":uno: server" size="text-5xl" class="text-red" />
        <h1 class=":uno: t-d2 text-ink m-0">Tidak ada koneksi.</h1>
        <p class=":uno: t-body-m text-ink-2 m-0">Periksa jaringanmu lalu coba lagi. Data yang belum disimpan tetap aman di perangkat ini.</p>
        <UiButton icon="refresh" class=":uno: self-start" @click="reloadNuxtApp()">Coba lagi</UiButton>
      </div>
    </main>
  </div>
</template>
