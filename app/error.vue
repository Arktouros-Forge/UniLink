<script setup>
import { notFound } from "@app/constants/site.json";

defineProps({ error: { type: Object, default: () => ({}) } });
const goHome = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="min-h-dvh bg-paper flex items-center justify-center px-5">
    <div class="max-w-[520px] text-center flex flex-col items-center gap-5">
      <UiLogo />
      <p class="type-numeral">{{ error.statusCode || 404 }}</p>
      <h1 class="type-h1">{{ notFound.title }}</h1>
      <p class="type-body">{{ notFound.text }}</p>
      <button class="btn-primary btn-lg" @click="goHome">{{ notFound.action }}</button>
    </div>
  </div>
</template>
