<script setup>
import { publicNav, publicActions } from "@app/constants/navigation.json";

const open = ref(false);
const route = useRoute();
watch(
    () => route.path,
    () => (open.value = false),
);
watch(open, (value) => {
    if (import.meta.client)
        document.documentElement.style.overflow = value ? "hidden" : "";
});
const onKey = (event) => event.key === "Escape" && (open.value = false);
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKey);
    if (import.meta.client) document.documentElement.style.overflow = "";
});
</script>

<template>
    <header class=":uno: sticky top-0 z-40 bg-paper border-b border-hairline">
        <div
            class=":uno: container-wide flex items-center justify-between h-16 md:h-18"
        >
            <NuxtLink to="/"><UiLogo /></NuxtLink>
            <nav class=":uno: hidden md:flex items-center gap-6 lg:gap-8">
                <NuxtLink
                    v-for="item in publicNav"
                    :key="item.to"
                    :to="item.to"
                    class=":uno: t-body-s text-ink hover:text-blue"
                    >{{ item.label }}</NuxtLink
                >
                <NuxtLink
                    to="/auth/login"
                    class=":uno: t-label text-blue px-2"
                    >{{ publicActions.login }}</NuxtLink
                >
                <UiButton size="sm" to="/auth/register" icon-end="arrowRight">{{
                    publicActions.register
                }}</UiButton>
            </nav>
            <UiIconButton
                class=":uno: md:hidden"
                icon="menu"
                label="Buka menu"
                variant="outline"
                @click="open = true"
            />
        </div>
        <ClientOnly
            ><Teleport to="body">
                <div
                    v-if="open"
                    class=":uno: md:hidden fixed inset-0 z-50 bg-paper flex flex-col"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                >
                    <div
                        class=":uno: grid grid-cols-3 h-1.5 shrink-0"
                        aria-hidden="true"
                    >
                        <span class=":uno: bg-red" /><span
                            class=":uno: bg-blue"
                        /><span class=":uno: bg-yellow" />
                    </div>
                    <div
                        class=":uno: container-wide flex items-center justify-between h-16 shrink-0"
                    >
                        <NuxtLink to="/"><UiLogo /></NuxtLink>
                        <UiIconButton
                            icon="close"
                            label="Tutup menu"
                            variant="outline"
                            @click="open = false"
                        />
                    </div>
                    <nav
                        class=":uno: container-wide flex-1 overflow-y-auto flex flex-col pt-4"
                    >
                        <NuxtLink
                            v-for="(item, index) in publicNav"
                            :key="item.to"
                            :to="item.to"
                            class=":uno: flex items-baseline gap-4 py-5 border-b border-hairline text-ink focus-ring"
                        >
                            <span class=":uno: t-mono-s text-ink-3">{{
                                String(index + 1).padStart(2, "0")
                            }}</span>
                            <span class=":uno: t-d3 flex-1">{{
                                item.label
                            }}</span>
                            <UiIcon
                                name="arrowRight"
                                class=":uno: text-ink-2 self-center"
                            />
                        </NuxtLink>
                    </nav>
                    <div
                        class=":uno: container-wide shrink-0 flex flex-col gap-3 pt-4 pb-6 safe-bottom"
                    >
                        <UiButton
                            to="/auth/register"
                            icon-end="arrowRight"
                            block
                            >{{ publicActions.register }}</UiButton
                        >
                        <UiButton to="/auth/login" variant="secondary" block>{{
                            publicActions.login
                        }}</UiButton>
                    </div>
                </div>
            </Teleport></ClientOnly
        >
    </header>
</template>
