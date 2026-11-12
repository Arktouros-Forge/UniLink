<script setup>
import { verify as copy, firebase as fb } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", access: "verify" });
const auth = useAuthStore();
const route = useRoute();
const api = useApi();
const firebase = useFirebaseAuth();
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
        if (firebase.enabled && (await firebase.resendVerification())) {
            cooldown.value = 60;
            return;
        }
        await api.post("/auth/resend-verification");
        cooldown.value = 60;
    },
    { success: copy.resent },
);

const recheck = useAction(
    async () => {
        if (!(await auth.syncVerification())) throw new Error(fb.stillPending);
        state.value = "done";
    },
    { silent: true },
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
    <div class=":uno: flex flex-col gap-2">
      <h1 class=":uno: t-d2 text-ink m-0">
        {{ state === "checking" ? copy.verifyingTitle : state === "done" ? copy.successTitle : state === "failed" ? copy.failedTitle : copy.title }}
      </h1>
      <p class=":uno: t-body-s text-ink-2 m-0">{{ state === "done" ? copy.successText : state === "failed" ? copy.failedText : copy.text }}</p>
    </div>
    <template v-if="state === 'done' || auth.isVerified">
      <UiButton :to="auth.isAuthed ? auth.destination : '/auth/login'" icon-end="arrowRight" block>{{ copy.continue }}</UiButton>
    </template>
    <template v-else-if="state !== 'checking'">
      <UiCard class=":uno: flex gap-4" padding="p-5">
        <UiIcon name="mail" size="text-3xl" class=":uno: text-blue" />
        <p class=":uno: t-body-s text-ink m-0">{{ copy.sentTo }} <strong>{{ auth.user?.email }}</strong>.</p>
      </UiCard>
      <UiCallout :title="copy.noticeTitle">{{ copy.noticeText }}</UiCallout>
      <div class=":uno: flex flex-col gap-2">
        <UiCallout v-if="recheck.error.value" tone="danger">{{ recheck.error.value.message }}</UiCallout>
        <UiButton v-if="firebase.enabled" block :loading="recheck.pending.value" @click="recheck.run()">{{ fb.verifiedCheck }}</UiButton>
        <UiButton variant="secondary" block :disabled="cooldown > 0" :loading="resending" @click="resend()">{{ copy.resend }}{{ cooldown ? ` (${cooldown})` : "" }}</UiButton>
        <UiButton variant="link" class=":uno: self-center" @click="signOut">{{ copy.logout }}</UiButton>
      </div>
    </template>
  </AuthFrame>
</template>
