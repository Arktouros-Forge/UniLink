<script setup>
import { forgot as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth", middleware: "guest" });
const api = useApi();
const email = ref("");
const sent = ref(false);
const { run, pending, fieldErrors } = useAction(async () => {
    await api.post("/auth/forgot", { email: email.value });
    sent.value = true;
});
</script>

<template>
  <AuthFrame>
    <div class="flex flex-col gap-2">
      <h1 class="t-d2 text-ink m-0 !text-[36px] !leading-[44px] md:!text-[40px] md:!leading-[48px]">{{ copy.title }}</h1>
      <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
    </div>
    <UiCallout v-if="sent" :title="copy.sentTitle" tone="info">{{ copy.sentText }}</UiCallout>
    <form class="flex flex-col gap-4" @submit.prevent="run()">
      <FormField :label="copy.email" :error="fieldErrors.email" v-slot="{ id }"><FormInput :id="id" v-model="email" type="email" icon="mail" /></FormField>
      <UiButton type="submit" icon="arrowRight" class="self-start" :loading="pending">{{ copy.submit }}</UiButton>
    </form>
    <UiButton to="/auth/login" variant="link" icon="arrowLeft" class="self-start">{{ copy.back }}</UiButton>
  </AuthFrame>
</template>
