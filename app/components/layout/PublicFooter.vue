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
            'bg-paper',
            variant === 'default' ? 'border-t border-hairline' : '',
        ]"
    >
        <div
            class="container-app !max-w-[1440px] md:!px-20 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            :class="variant === 'default' ? 'py-8' : 'py-4'"
        >
            <p class="t-mono-s text-ink/60 m-0">
                {{ copyright }} · {{ university }}
            </p>

            <nav class="flex gap-2 t-body-s text-ink-2">
                <template v-for="(item, index) in footerLinks" :key="item.to">
                    <NuxtLink :to="item.to" class="hover:text-blue">
                        {{ item.label }}
                    </NuxtLink>

                    <span v-if="index < footerLinks.length - 1">·</span>
                </template>
            </nav>
        </div>
    </footer>
</template>
