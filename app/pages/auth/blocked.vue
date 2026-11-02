<script setup>
import { blocked as copy, adminEmail } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <UiChip tone="red" icon="i-keyline-icons-ban" class="self-start">{{ copy.chip }}</UiChip>
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <div class="card border-brand-red flex flex-col gap-1"><p class="type-label">{{ copy.noticeTitle }}</p><p class="type-small">{{ copy.noticeText }}</p></div>
    <div class="card flex flex-col gap-2"><h2 class="type-h3">{{ copy.cardTitle }}</h2><p class="type-small">{{ copy.cardText }}</p></div>
    <a :href="`mailto:${adminEmail}`" class="btn-primary btn-lg">{{ copy.contact }}</a>
    <NuxtLink to="/" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />{{ copy.back }}</NuxtLink>
  </div>
</template>
