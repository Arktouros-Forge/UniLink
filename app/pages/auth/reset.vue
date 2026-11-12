<script setup>
import { reset as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth", middleware: "guest" });
const route = useRoute();
const api = useApi();
const token = computed(() => String(route.query.token ?? ""));
const form = reactive({ password: "", confirm: "" });
const show = ref(false);
const mismatch = computed(() => form.confirm && form.confirm !== form.password);
const { run, pending, error, fieldErrors } = useAction(
    async () => {
        await api.post("/auth/reset", { token: token.value, password: form.password });
        await navigateTo("/auth/login");
    },
    { success: copy.done, silent: true },
);
const submit = () => !mismatch.value && run();
</script>

<template>
    <AuthFrame>
        <div class=":uno: flex flex-col gap-2">
            <h1
                class=":uno: t-d2 text-ink m-0"
            >
                {{ copy.title }}
            </h1>
            <p class=":uno: t-body-s text-ink-2 m-0">{{ copy.text }}</p>
        </div>
        <form
            class=":uno: flex flex-col gap-4"
            @submit.prevent="submit"
        >
            <FormField
                :label="copy.password"
                :hint="copy.strength"
                :error="fieldErrors.password"
                v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.password"
                    :type="show ? 'text' : 'password'"
                    :icon="show ? 'eye' : 'eyeOff'"
                    @icon="show = !show"
            /></FormField>
            <FormField
                :label="copy.confirm"
                :error="mismatch ? 'Kata sandi tidak sama.' : ''"
                v-slot="{ id, invalid }"
                ><FormInput
                    :id="id"
                    v-model="form.confirm"
                    :type="show ? 'text' : 'password'"
                    :invalid="invalid"
            /></FormField>
            <UiCallout v-if="error && !fieldErrors.password" tone="danger" :title="copy.invalidTitle">{{ error.message }} <NuxtLink to="/auth/forgot" class=":uno: text-ink">{{ copy.requestNew }} →</NuxtLink></UiCallout>
            <UiButton type="submit" icon="check" block :loading="pending" :disabled="!token">{{
                copy.submit
            }}</UiButton>
        </form>
        <p class=":uno: t-body-xs text-ink-2 m-0">{{ copy.note }}</p>
    </AuthFrame>
</template>
