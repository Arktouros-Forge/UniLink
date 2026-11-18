<script setup>
import { errors } from "@app/constants/states.json";

const props = defineProps({ error: { type: Object, default: () => ({}) } });
const state = computed(() => errors[props.error.statusCode] || errors.default);
const home = () => clearError({ redirect: "/" });
</script>

<template>

    <div class=":uno: min-h-dvh bg-paper flex flex-col">
        <header
            class=":uno: h-16 md:h-[72px] px-5 md:px-8 lg:px-16 flex items-center"
        >
            <UiLogo />
        </header>

        <main class=":uno: flex-1 flex items-center justify-center px-5 py-10">
            <div class=":uno: w-full max-w-[520px] flex flex-col gap-6">
                <p class=":uno: t-serif-display text-ink m-0">
                    {{ state.code }}
                </p>

                <h1 class=":uno: t-d2 text-ink m-0">
                    {{ state.title }}
                </h1>

                <p class=":uno: t-body-m text-ink-2 m-0">
                    {{ state.text }}
                </p>

                <div class=":uno: flex flex-col sm:flex-row gap-3">
                    <UiButton
                        size="md"
                        icon="home"
                        @click="home"
                    >
                        Kembali ke beranda
                    </UiButton>

                    <UiButton
                        size="md"
                        variant="secondary"
                        icon="refresh"
                        @click="reloadNuxtApp()"
                    >
                        Muat ulang
                    </UiButton>
                </div>
            </div>
        </main>
    </div>
</template>
