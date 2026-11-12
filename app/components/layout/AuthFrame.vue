<script setup>
import { aside } from "@app/constants/auth.json";
</script>

<template>
    <div
        class=":uno: w-full max-w-[1200px] grid gap-12 lg:grid-cols-[400px_1fr] lg:gap-20 lg:items-center"
    >
        <section class=":uno: flex flex-col gap-6"><slot /></section>
        <aside class=":uno: hidden lg:flex flex-col gap-6">
            <ArtBlocks variant="auth" />
            <h2
                class=":uno: t-d4 text-ink m-0 whitespace-pre-line"
            >
                {{ aside.title }}
            </h2>
            <p class=":uno: t-body-m text-ink-2 m-0">{{ aside.text }}</p>
            <p class=":uno: t-mono-s text-ink m-0">{{ aside.meta }}</p>
        </aside>
    </div>

</template>
