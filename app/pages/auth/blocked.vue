<script setup>
import { blocked as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth" });
const auth = useAuthStore();
const reason = computed(() => (typeof auth.blocked === "string" ? auth.blocked : copy.reason));
</script>

<template>
  <AuthFrame>
    <div class="flex flex-col gap-3">
      <UiChip tone="danger" icon="ban" size="md" class="self-start">{{ copy.chip }}</UiChip>
      <h1 class="t-d2 text-ink m-0">{{ copy.title }}</h1>
      <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
    </div>
    <UiCallout :title="copy.reasonTitle">{{ reason }}</UiCallout>
    <UiCard class="flex flex-col gap-2" padding="p-5">
      <h2 class="t-d4 text-ink m-0 !text-base">{{ copy.appealTitle }}</h2>
      <p class="t-body-s text-ink-2 m-0">{{ copy.appealText }}</p>
    </UiCard>
    <div class="flex flex-wrap gap-3">
      <UiButton :href="`mailto:${copy.adminEmail}`" icon="mail">{{ copy.contact }}</UiButton>
      <UiButton to="/" variant="secondary">{{ copy.back }}</UiButton>
    </div>
  </AuthFrame>
</template>
