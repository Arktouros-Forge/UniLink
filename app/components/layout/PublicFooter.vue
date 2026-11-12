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
    <footer
        :class="[
            ':uno: bg-paper',
            variant === 'default' ? ':uno: border-t border-hairline' : '',
        ]"
    >
        <div
            class=":uno: container-wide flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            :class="variant === 'default' ? ':uno: py-8' : ':uno: py-5'"
        >
            <p class=":uno: t-mono-s text-ink-2 m-0">
                {{ copyright }} · {{ university }}
            </p>
            <nav
                class=":uno: flex flex-wrap gap-x-4 gap-y-1 t-mono-s text-ink-2"
            >
                <NuxtLink
                    v-for="item in footerLinks"
                    :key="item.to"
                    :to="item.to"
                    class=":uno: hover:text-blue"
                    >{{ item.label }}</NuxtLink
                >
            </nav>
        </div>
    </footer>
</template>
