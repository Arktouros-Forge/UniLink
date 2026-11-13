<script setup>
import { register as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", access: "guest" });
const auth = useAuthStore();
const form = reactive({ name: "", email: "", password: "", agree: false });
const { run, pending, fieldErrors } = useAction(
    async () => {
        await auth.register({
            name: form.name,
            email: form.email,
            password: form.password,
        });
        await navigateTo(auth.destination);
    },
    {
        success: copy.created,
        validate: () =>
            collect({
                name: rule.min(form.name, 2),
                email: rule.required(form.email),
                password: rule.min(form.password, 8),
            }),
    },
);
const submit = () => run();

usePageSeo("register");
</script>

<template>
    <AuthFrame>
        <div class=":uno: flex flex-col gap-2">
            <h1 class=":uno: t-d2 text-ink m-0">
                {{ copy.title }}
            </h1>
            <p class=":uno: t-body-s text-ink-2 m-0">{{ copy.text }}</p>
        </div>
        <form novalidate class=":uno: flex flex-col gap-4" @submit.prevent="submit">
            <FormField
                :label="copy.name"
                :error="fieldErrors.name"
                v-slot="{ id }"
                ><FormInput :id="id" v-model="form.name" icon="user"
            /></FormField>
            <FormField
                :label="copy.email"
                :error="fieldErrors.email"
                v-slot="{ id }"
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
            <div class=":uno: flex items-start gap-2">
                <UiCheckbox v-model="form.agree" />

                <p class="text-sm">
                    {{ copy.termsPrefix }}
                    <NuxtLink to="/terms" class=":uno: text-blue underline">
                        {{ copy.termsLink }}
                    </NuxtLink>
                    {{ copy.termsAnd }}
                    <NuxtLink to="/privacy" class=":uno: text-blue underline">
                        {{ copy.privacyLink }}
                    </NuxtLink>
                    {{ copy.termsSuffix }}
                </p>
            </div>
            <UiButton
                type="submit"
                icon="arrowRight"
                :disabled="!form.agree"
                :loading="pending"
                block
                >{{ copy.submit }}</UiButton
            >
        </form>
        <GoogleButton />
        <p class=":uno: t-body-s text-ink-2 m-0">
            {{ copy.prompt }}
            <NuxtLink to="/auth/login" class=":uno: text-ink"
                >{{ copy.switch }} →</NuxtLink
            >
        </p>
    </AuthFrame>
</template>
