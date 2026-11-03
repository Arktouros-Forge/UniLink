<script setup>
import { aside } from "@app/constants/auth.json";
</script>

<template>
    <div
        class="w-full max-w-[1200px] grid gap-12 md:grid-cols-[400px_1fr] md:gap-24 md:items-center"
    >
        <section class="flex flex-col gap-6"><slot /></section>
        <aside class="hidden md:flex flex-col gap-6">
            <ArtBlocks variant="auth" />
            <h2
                class="t-d4 text-ink m-0 whitespace-pre-line !text-[22px] !leading-8"
            >
                {{ aside.title }}
            </h2>
            <p class="t-body-m text-ink-2 m-0">{{ aside.text }}</p>
            <p class="t-mono-s text-ink m-0">{{ aside.meta }}</p>
        </aside>
    </div>
</template>
