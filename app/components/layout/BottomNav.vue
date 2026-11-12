<script setup>
import { studentTabs } from "@app/constants/navigation.json";
import { activeNavTo } from "@app/utils/nav";

const route = useRoute();
const activeTo = computed(() =>
    activeNavTo(
        route.path,
        studentTabs.map((item) => item.to),
    ),
);
const isActive = (to) => activeTo.value === to;
</script>

<template>
    <nav
        class=":uno: lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 bg-card border-t border-hairline safe-bottom"
        aria-label="Navigasi utama"
    >
        <NuxtLink
            v-for="item in studentTabs"
            :key="item.to"
            :to="item.to"
            class=":uno: h-16 flex flex-col items-center justify-center gap-1 text-xs font-medium"
            :class="isActive(item.to) ? ':uno: text-blue' : ':uno: text-ink'"
        >
            <UiIcon :name="item.icon" size=":uno: text-2xl" />{{ item.label }}
        </NuxtLink>
    </nav>
</template>
