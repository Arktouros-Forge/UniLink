<script setup>
import { verify as copy, demoEmail } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const cooldown = ref(60);
let timer;
onMounted(() => {
  timer = setInterval(() => (cooldown.value = Math.max(0, cooldown.value - 1)), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <AuthFrame>
    <div class="flex flex-col gap-2">
      <h1 class="t-d2 text-ink m-0 !text-[36px] !leading-[44px] md:!text-[40px] md:!leading-[48px]">{{ copy.title }}</h1>
      <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
    </div>
    <UiCard class="flex gap-4" padding="p-5">
      <UiIcon name="mail" size="text-3xl" class="text-blue" />
      <p class="t-body-s text-ink m-0">{{ copy.sentTo }} <strong>{{ demoEmail }}</strong>.</p>
    </UiCard>
    <UiCallout :title="copy.noticeTitle">{{ copy.noticeText }}</UiCallout>
    <div class="flex flex-wrap gap-3">
      <UiButton to="/onboarding/1" icon-end="arrowRight">{{ copy.continue }}</UiButton>
      <UiButton variant="secondary" :disabled="cooldown > 0" @click="cooldown = 60">{{ copy.resend }}{{ cooldown ? ` (${cooldown})` : "" }}</UiButton>
    </div>
    <UiButton to="/auth/register" variant="link" class="self-start">{{ copy.change }}</UiButton>
  </AuthFrame>
</template>
