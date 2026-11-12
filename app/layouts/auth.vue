<script setup>
import { university } from "@app/constants/site.json";
</script>

<template>
    <div class=":uno: min-h-dvh bg-paper flex flex-col">
        <header
            class=":uno: flex items-center justify-between h-16 md:h-[72px] px-5 md:px-8 lg:px-16"
        >
            <NuxtLink to="/" class=":uno: focus-ring"><UiLogo /></NuxtLink>
            <span class=":uno: hidden lg:inline t-mono-s text-ink">{{
                university
            }}</span>
        </header>
        <main
            class=":uno: flex-1 flex items-center justify-center px-5 py-8 md:px-16"
        >
            <slot />
        </main>
        <PublicFooter variant="compact" />
    </div>
</template>
