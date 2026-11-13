<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
const dark = computed(() => ui.theme === "dark");
</script>

<template>
    <ClientOnly>
        <UiIconButton
            :icon="dark ? 'sun' : 'moon'"
            :label="dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'"
            @click="ui.toggleTheme()"
        />
        <template #fallback><span class=":uno: size-10" /></template>
    </ClientOnly>
</template>
