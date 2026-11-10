<script setup>
import { errors } from "@app/constants/states.json";

const props = defineProps({ error: { type: Object, default: () => ({}) } });
const state = computed(() => errors[props.error.statusCode] || errors.default);
const home = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="min-h-dvh bg-paper flex flex-col">
    <header class="h-16 md:h-[72px] px-5 md:px-8 lg:px-16 flex items-center"><UiLogo /></header>
    <main class="flex-1 flex items-center justify-center px-5 py-10">
      <div class="max-w-[520px] flex flex-col gap-6">
        <p class="t-serif-display text-ink m-0">{{ state.code }}</p>
        <h1 class="t-d2 text-ink m-0">{{ state.title }}</h1>
        <p class="t-body-m text-ink-2 m-0">{{ state.text }}</p>
        <div class="flex gap-3"><UiButton icon="home" @click="home">Kembali ke beranda</UiButton><UiButton variant="secondary" icon="refresh" @click="reloadNuxtApp()">Muat ulang</UiButton></div>
      </div>
    </main>
  </div>
</template>
