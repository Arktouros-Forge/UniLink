<script setup>
import { reset as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const form = reactive({ password: "", confirm: "" });
const show = ref(false);
const mismatch = computed(() => form.confirm && form.confirm !== form.password);
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
        <form
            class="flex flex-col gap-4"
            @submit.prevent="navigateTo('/auth/login')"
        >
            <FormField
                :label="copy.password"
                :hint="copy.strength"
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
            <UiButton type="submit" icon="check" class="self-start">{{
                copy.submit
            }}</UiButton>
        </form>
        <p class="t-body-xs text-ink-2 m-0">{{ copy.note }}</p>
    </AuthFrame>
</template>
