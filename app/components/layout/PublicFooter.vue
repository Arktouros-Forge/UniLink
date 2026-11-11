<script setup>
import { copyright, footerLinks, university } from "@app/constants/site.json";

defineProps({
    variant: {
        type: String,
        default: "default",
        validator: (value) => ["default", "compact"].includes(value),
    },
});
</script>

<template>
    <footer :class="[':uno: bg-paper', variant === 'default' ? ':uno: border-t border-hairline' : '']">
        <div
            class="container-wide flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            :class="variant === 'default' ? 'py-8' : 'py-5'"
        >
            <p class="t-mono-s text-ink-2 m-0">{{ copyright }} · {{ university }}</p>
            <nav class="flex flex-wrap gap-x-4 gap-y-1 t-mono-s text-ink-2">
                <NuxtLink v-for="item in footerLinks" :key="item.to" :to="item.to" class="hover:text-blue">{{ item.label }}</NuxtLink>
            </nav>
        </div>
    </footer>
</template>
