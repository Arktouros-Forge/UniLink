<script setup>
import { studentTabs } from "@app/constants/navigation.json";

const route = useRoute();
const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`);
</script>

<template>
    <nav
        class="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 bg-card border-t border-hairline safe-bottom"
        aria-label="Navigasi utama"
    >
        <NuxtLink
            v-for="item in studentTabs"
            :key="item.to"
            :to="item.to"
            class="h-16 flex flex-col items-center justify-center gap-1 text-xs font-medium"
            :class="isActive(item.to) ? 'text-blue' : 'text-ink'"
        >
            <UiIcon :name="item.icon" size="text-2xl" />{{ item.label }}
        </NuxtLink>
    </nav>
</template>
