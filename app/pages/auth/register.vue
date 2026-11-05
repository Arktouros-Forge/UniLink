<script setup>
import { register as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const form = reactive({ name: "", email: "", password: "", agree: false });
const valid = computed(
    () => form.name && form.email && form.password.length >= 8 && form.agree,
);
const submit = () => valid.value && navigateTo("/auth/verify-email");
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
        <form class="flex flex-col gap-4" @submit.prevent="submit">
            <FormField :label="copy.name" v-slot="{ id }"
                ><FormInput :id="id" v-model="form.name" icon="user"
            /></FormField>
            <FormField :label="copy.email" v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.email"
                    type="email"
                    icon="mail"
            /></FormField>
            <FormField
                :label="copy.password"
                :hint="copy.passwordHint"
                v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.password"
                    type="password"
                    icon="lock"
            /></FormField>
            <UiCheckbox v-model="form.agree" :label="copy.terms" />
            <UiButton
                type="submit"
                icon="arrowRight"
                :disabled="!valid"
                class="self-start"
                >{{ copy.submit }}</UiButton
            >
        </form>
        <UiDivider />
        <UiButton variant="secondary" class="self-start"
            >G · {{ copy.google }}</UiButton
        >
        <p class="t-body-s text-ink-2 m-0">
            {{ copy.prompt }}
            <NuxtLink to="/auth/login" class="text-ink"
                >{{ copy.switch }} →</NuxtLink
            >
        </p>
    </AuthFrame>
</template>
