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
            if (
                failure.statusCode === 403 &&
                /blocked/i.test(failure.message)
            ) {
                auth.setBlocked(failure.errors?.[0]?.message);
                await navigateTo("/auth/blocked");
                return;
            }
            throw failure;
        }
        await navigateTo(auth.landing(route.query.redirect));
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

        <UiCallout v-if="error" tone="danger">
            {{ error.message }}
        </UiCallout>

        <UiButton variant="secondary" block :loading="pending" @click="run()">
            <span class=":uno: inline-flex items-center justify-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                >
                    <path
                        fill="#4285F4"
                        d="M21.35 12.2c0-.74-.07-1.45-.2-2.13H12v4.03h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.26Z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.99Z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M6.54 14.1a5.86 5.86 0 0 1 0-3.75V7.85H3.3a9.75 9.75 0 0 0 0 8.75l3.24 2.5Z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 6.32c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.43 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.35l3.24 2.5C7.31 8.04 9.46 6.32 12 6.32Z"
                    />
                </svg>

                <span>{{ copy.google }}</span>
            </span>
        </UiButton>
    </div>
</template>
