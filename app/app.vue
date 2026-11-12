<script setup>
import { Toaster } from "vue-sonner";
import copy from "@app/constants/toast.json";
import site from "@app/constants/site.json";
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
const route = useRoute();
useHead({
    titleTemplate: (title) => (title ? `${title} · ${site.siteName}` : `${site.siteName} · ${site.university}`),
    title: () => route.meta.title,
});
onMounted(ui.initTheme);

const classes = {
    toast: "group relative w-full flex items-start gap-3 py-3 pl-4 pr-10 bg-elevated text-ink border border-hairline border-l-4 rounded-md shadow-popover font-sans",
    content: "flex flex-col gap-0.5 min-w-0",
    title: "t-label text-ink",
    description: "t-body-xs !text-ink-2 whitespace-pre-line",
    icon: "mt-0.5 shrink-0",
    closeButton: "!absolute !right-2 !top-2 !left-auto !size-6 !rounded-md !border-0 !bg-transparent !text-ink-2 hover:!bg-hairline !transform-none inline-flex items-center justify-center cursor-pointer",
    success: "!border-l-success",
    error: "!border-l-danger",
    warning: "!border-l-warning",
    info: "!border-l-blue",
};
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
        <Toaster position="top-right" close-button :visible-toasts="3" :gap="10" :offset="16" :mobile-offset="12" :toast-options="{ unstyled: true, classes }" :close-button-aria-label="copy.close">
            <template #success-icon><UiIcon name="checkCircle" size="text-xl" class=":uno: text-success" /></template>
            <template #error-icon><UiIcon name="alert" size="text-xl" class=":uno: text-danger" /></template>
            <template #info-icon><UiIcon name="info" size="text-xl" class=":uno: text-blue" /></template>
            <template #warning-icon><UiIcon name="alert" size="text-xl" class=":uno: text-warning" /></template>
            <template #close-icon><UiIcon name="close" size="text-base" /></template>
        </Toaster>
    </ClientOnly>
</template>
