<script setup>
import { publicNav, publicActions } from "@app/constants/navigation.json";

const open = ref(false);
const route = useRoute();
watch(
    () => route.path,
    () => (open.value = false),
);
</script>

<template>
    <header class="sticky top-0 z-40 bg-paper border-b border-hairline">
        <div
            class="container-app !max-w-[1440px] md:!px-20 flex items-center justify-between h-16 md:h-20"
        >
            <NuxtLink to="/" class="focus-ring"><UiLogo /></NuxtLink>
            <nav class="hidden md:flex items-center gap-8">
                <NuxtLink
                    v-for="item in publicNav"
                    :key="item.to"
                    :to="item.to"
                    class="t-body-s text-ink hover:text-blue"
                    >{{ item.label }}</NuxtLink
                >
                <NuxtLink
                    to="/auth/login"
                    class="t-label text-blue ml-4 px-2"
                    >{{ publicActions.login }}</NuxtLink
                >
                <UiButton to="/auth/register" icon-end="arrowRight">{{
                    publicActions.register
                }}</UiButton>
            </nav>
            <div class="md:hidden flex items-center gap-2">
                <UiIconButton
                    :icon="open ? 'close' : 'menu'"
                    label="Menu"
                    variant="outline"
                    @click="open = !open"
                />
            </div>
        </div>
        <nav
            v-if="open"
            class="md:hidden container-app flex flex-col gap-1 pb-4"
        >
            <NuxtLink
                v-for="item in publicNav"
                :key="item.to"
                :to="item.to"
                class="h-11 flex items-center t-label text-ink"
                >{{ item.label }}</NuxtLink
            >
            <NuxtLink
                to="/auth/login"
                class="h-11 flex items-center t-label text-blue"
                >{{ publicActions.login }}</NuxtLink
            >
            <UiButton to="/auth/register" icon-end="arrowRight" block>{{
                publicActions.register
            }}</UiButton>
        </nav>
    </header>
</template>
