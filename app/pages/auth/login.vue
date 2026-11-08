<script setup>
import { login as copy } from "@app/constants/auth.json";
import { useAuthStore } from "@app/stores/auth";

definePageMeta({ layout: "auth", middleware: "guest" });
const auth = useAuthStore();
const route = useRoute();
const form = reactive({ email: "", password: "", remember: false });
const show = ref(false);
const { run, pending, error } = useAction(
    async () => {
        try {
            await auth.login({ ...form });
        } catch (failure) {
            if (failure.statusCode === 403 && /blocked/i.test(failure.message)) {
                auth.setBlocked(failure.errors?.[0]?.message);
                await navigateTo("/auth/blocked");
                return;
            }
            throw failure;
        }
        const target = String(route.query.redirect ?? "");
        await navigateTo(target.startsWith("/") && !target.startsWith("//") ? target : auth.home);
    },
    { silent: true },
);
const submit = () => run();
</script>

<template>
    <AuthFrame>
        <div class="flex flex-col gap-2">
            <h1
                class="t-d2 text-ink m-0 !text-[36px] !leading-[44px] md:!text-[40px] md:!leading-[48px]"
            >
                {{ copy.title }}
            </h1>
            <p class="t-body-s text-ink-2 m-0">{{ copy.text }}</p>
        </div>
        <div class="gap-4 flex flex-col">
            <form class="flex flex-col gap-4 pb-0" @submit.prevent="submit">
                <FormField :label="copy.email" v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        v-model="form.email"
                        type="email"
                        icon="mail"
                /></FormField>
                <FormField :label="copy.password" v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        v-model="form.password"
                        :type="show ? 'text' : 'password'"
                        :icon="show ? 'eye' : 'eyeOff'"
                        @icon="show = !show"
                /></FormField>
                <div class="flex items-center justify-between">
                    <UiCheckbox
                        v-model="form.remember"
                        :label="copy.remember"
                    />
                    <NuxtLink to="/auth/forgot" class="t-body-s text-blue">{{
                        copy.forgot
                    }}</NuxtLink>
                </div>
                <UiCallout v-if="error" tone="danger">{{ error.message }}</UiCallout>
                <UiButton type="submit" icon="arrowRight" block :loading="pending">{{
                    copy.submit
                }}</UiButton>
            </form>
            <GoogleButton />
            <p class="t-body-s text-ink-2 m-0">
                {{ copy.prompt }}
                <NuxtLink to="/auth/register" class="text-ink"
                    >{{ copy.switch }} →</NuxtLink
                >
            </p>
        </div>
    </AuthFrame>
</template>
