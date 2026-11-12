<script setup>
import { steps, guide } from "@app/constants/landing.json";

usePageSeo("how");
</script>

<template>
    <div class=":uno: container-wide py-12 md:py-20 flex flex-col gap-12">
        <div class=":uno: flex flex-col gap-3 max-w-[720px]">
            <h1 class=":uno: t-d2 text-ink m-0">{{ guide.title }}</h1>
            <p class=":uno: t-body-l text-ink-2 m-0">{{ guide.text }}</p>
        </div>
        <ol class=":uno: grid gap-6 m-0 p-0 list-none md:grid-cols-2">
            <li v-for="(step, index) in steps" :key="step.title">
                <UiCard class=":uno: flex gap-4 md:gap-6 h-full" hover>
                    <span
                        class=":uno: t-serif-step text-ink shrink-0 whitespace-nowrap"
                        >{{ String(index + 1).padStart(2, "0") }}</span
                    >
                    <div class=":uno: flex flex-col gap-2 min-w-0">
                        <p class=":uno: t-mono-s text-ink-2 m-0">
                            {{ step.meta }}
                        </p>
                        <h2 class=":uno: t-d4 text-ink m-0">
                            {{ step.title }}
                        </h2>
                        <p class=":uno: t-body-m text-ink-2 m-0">
                            {{ step.text }}
                        </p>
                    </div>
                </UiCard>
            </li>
        </ol>
        <UiCallout :title="guide.consentTitle" tone="info">{{
            guide.consentText
        }}</UiCallout>
        <UiButton
            to="/auth/register"
            size="lg"
            icon-end="arrowRight"
            class=":uno: self-start"
            >Daftar gratis</UiButton
        >
    </div>
</template>
