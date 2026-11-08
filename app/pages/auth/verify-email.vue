<script setup>
import { verify as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", middleware: "auth", allowIncomplete: true });
const auth = useAuthStore();
const route = useRoute();
const api = useApi();
const cooldown = ref(60);
const state = ref(route.query.token ? "checking" : "idle");
let timer;

const confirm = async () => {
    try {
        await api.post("/auth/verify-email", { token: String(route.query.token) });
        await auth.fetchMe({ force: true });
        state.value = "done";
    } catch {
        state.value = "failed";
    }
};

const { run: resend, pending: resending } = useAction(
    async () => {
        await api.post("/auth/resend-verification");
        cooldown.value = 60;
    },
    { success: copy.resent },
);

const signOut = async () => {
    await auth.logout();
    await navigateTo("/auth/login");
};

onMounted(() => {
    if (state.value === "checking") confirm();
    timer = setInterval(() => (cooldown.value = Math.max(0, cooldown.value - 1)), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <AuthFrame>
    <div class="flex flex-col gap-2">
      <h1 class="t-d2 text-ink m-0 !text-[36px] !leading-[44px] md:!text-[40px] md:!leading-[48px]">
        {{ state === "checking" ? copy.verifyingTitle : state === "done" ? copy.successTitle : state === "failed" ? copy.failedTitle : copy.title }}
      </h1>
      <p class="t-body-s text-ink-2 m-0">{{ state === "done" ? copy.successText : state === "failed" ? copy.failedText : copy.text }}</p>
    </div>
    <template v-if="state === 'done' || auth.isVerified">
      <UiButton :to="auth.isOnboarded ? auth.home : '/onboarding/1'" icon-end="arrowRight" class="self-start">{{ copy.continue }}</UiButton>
    </template>
    <template v-else-if="state !== 'checking'">
      <UiCard class="flex gap-4" padding="p-5">
        <UiIcon name="mail" size="text-3xl" class="text-blue" />
        <p class="t-body-s text-ink m-0">{{ copy.sentTo }} <strong>{{ auth.user?.email }}</strong>.</p>
      </UiCard>
      <UiCallout :title="copy.noticeTitle">{{ copy.noticeText }}</UiCallout>
      <div class="flex flex-wrap gap-3">
        <UiButton variant="secondary" :disabled="cooldown > 0" :loading="resending" @click="resend()">{{ copy.resend }}{{ cooldown ? ` (${cooldown})` : "" }}</UiButton>
        <UiButton variant="link" @click="signOut">{{ copy.logout }}</UiButton>
      </div>
    </template>
  </AuthFrame>
</template>
