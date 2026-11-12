<script setup>
import { firebase as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

const auth = useAuthStore();
const route = useRoute();
const firebase = useFirebaseAuth();
const { run, pending, error } = useAction(
  async () => {
    try {
      await auth.loginWithGoogle();
    } catch (failure) {
      if (failure.statusCode === 403 && /blocked/i.test(failure.message)) {
        auth.setBlocked(failure.errors?.[0]?.message);
        await navigateTo("/auth/blocked");
        return;
      }
      throw failure;
    }
    const target = String(route.query.redirect ?? "");
    await navigateTo(target.startsWith("/") && !target.startsWith("//") ? target : auth.isVerified && !auth.isOnboarded ? "/onboarding/1" : auth.home);
  },
  { silent: true },
);
</script>

<template>
  <div v-if="firebase.enabled" class=":uno: flex flex-col gap-4">
    <div class=":uno: flex items-center gap-3 text-ink-2">
      <span class=":uno: flex-1 h-px bg-hairline" />
      <span class=":uno: t-body-xs">{{ copy.or }}</span>
      <span class=":uno: flex-1 h-px bg-hairline" />
    </div>
    <UiCallout v-if="error" tone="danger">{{ error.message }}</UiCallout>
    <UiButton variant="secondary" block :loading="pending" @click="run()">{{ copy.google }}</UiButton>
  </div>
</template>
