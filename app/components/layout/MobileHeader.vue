<script setup>
import { useAuthStore } from "@app/stores/auth";

const auth = useAuthStore();
</script>

<template>
    <header
        class=":uno: lg:hidden flex items-center justify-between h-14 px-5 md:px-8 bg-paper border-b border-hairline"
    >
        <NuxtLink to="/student/dashboard"><UiLogo /></NuxtLink>
        <div class=":uno: flex items-center gap-2">
            <NuxtLink to="/student/settings"
                ><UiAvatar :name="auth.user?.name ?? ''" :size="32" tone="neutral"
            /></NuxtLink>
        </div>
    </header>
</template>
