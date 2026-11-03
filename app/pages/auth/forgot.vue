<script setup>
import { forgot as copy, demoEmail } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const email = ref(demoEmail);
const sent = ref(false);
</script>

<template>
  <AuthFrame>
    <div class="flex flex-col gap-2">
      <h1 class="t-d2 text-ink m-0 !text-[36px] !leading-[44px] md:!text-[40px] md:!leading-[48px]">{{ copy.title }}</h1>
      <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
    </div>
    <UiCallout v-if="sent" :title="copy.sentTitle" tone="info">{{ copy.sentText }}</UiCallout>
    <form class="flex flex-col gap-4" @submit.prevent="sent = true">
      <FormField :label="copy.email" v-slot="{ id }"><FormInput :id="id" v-model="email" type="email" icon="mail" /></FormField>
      <UiButton type="submit" icon="arrowRight" class="self-start">{{ copy.submit }}</UiButton>
    </form>
    <UiButton to="/auth/login" variant="link" icon="arrowLeft" class="self-start">{{ copy.back }}</UiButton>
  </AuthFrame>
</template>
