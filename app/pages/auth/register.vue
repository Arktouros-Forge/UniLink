<script setup>
import { register as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", middleware: "guest" });
const auth = useAuthStore();
const form = reactive({ name: "", email: "", password: "", agree: false });
const valid = computed(
    () => form.name && form.email && form.password.length >= 8 && form.agree,
);
const { run, pending, fieldErrors, error } = useAction(
    async () => {
        await auth.register({ name: form.name, email: form.email, password: form.password });
        await navigateTo("/auth/verify-email");
    },
    { success: copy.created, silent: true },
);
const submit = () => valid.value && run();

usePageSeo("register");
</script>

<template>
    <AuthFrame>
        <div class="flex flex-col gap-2">
            <h1
                class="t-d2 text-ink m-0"
            >
                {{ copy.title }}
            </h1>
            <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
        </div>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
            <FormField :label="copy.name" :error="fieldErrors.name" v-slot="{ id }"
                ><FormInput :id="id" v-model="form.name" icon="user"
            /></FormField>
            <FormField :label="copy.email" :error="fieldErrors.email" v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.email"
                    type="email"
                    icon="mail"
            /></FormField>
            <FormField
                :label="copy.password"
                :hint="copy.passwordHint"
                :error="fieldErrors.password"
                v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.password"
                    type="password"
                    icon="lock"
            /></FormField>
            <UiCheckbox v-model="form.agree" :label="copy.terms" />
            <UiCallout v-if="error && !Object.keys(fieldErrors).length" tone="danger">{{ error.message }}</UiCallout>
            <UiButton
                type="submit"
                icon="arrowRight"
                :disabled="!valid"
                :loading="pending" block
                >{{ copy.submit }}</UiButton
            >
        </form>
        <GoogleButton />
        <p class="t-body-s text-ink-2 m-0">
            {{ copy.prompt }}
            <NuxtLink to="/auth/login" class="text-ink"
                >{{ copy.switch }} →</NuxtLink
            >
        </p>
    </AuthFrame>
</template>
