<script setup>
import { forgot as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const email = ref("");
const sent = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <div v-if="sent" class="card border-good flex gap-3">
      <span class="i-keyline-icons-circle-check text-2xl text-good" />
      <div class="flex flex-col gap-1"><p class="type-label">{{ copy.noticeTitle }}</p><p class="type-small">{{ copy.noticeText }}</p></div>
    </div>
    <form class="flex flex-col gap-4" @submit.prevent="sent = true">
      <FormField :label="copy.email"><input v-model="email" type="email" class="field" /></FormField>
      <button type="submit" class="btn-primary btn-lg">{{ copy.submit }}</button>
    </form>
    <NuxtLink to="/auth/login" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />{{ copy.back }}</NuxtLink>
    <p class="type-small">{{ copy.prompt }}</p>
  </div>
</template>
