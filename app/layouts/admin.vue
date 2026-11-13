<script setup>
import { workspace } from "@app/constants/site.json";
import { useUiStore } from "@app/stores/ui";

const route = useRoute();
const ui = useUiStore();
const body = ref(null);
watch(
    () => route.path,
    () => body.value?.scrollTo({ top: 0 }),
);
</script>

<template>
    <div class=":uno: h-dvh overflow-hidden bg-paper flex flex-col">
        <div class=":uno: grid grid-cols-3 h-[6px] shrink-0" aria-hidden="true">
            <span class=":uno: bg-red" /><span class=":uno: bg-blue" /><span
                class=":uno: bg-yellow"
            />
        </div>
        <div class=":uno: flex-1 min-h-0 lg:flex">
            <SidebarNav class=":uno: hidden lg:flex" admin />
            <div class=":uno: h-full min-w-0 flex flex-col lg:flex-1">
                <header
                    class=":uno: lg:hidden shrink-0 flex items-center justify-between h-14 px-5 md:px-8 bg-paper border-b border-hairline"
                >
                    <NuxtLink to="/admin"><UiLogo /></NuxtLink>
                    <div class=":uno: flex items-center gap-2">
                        <ThemeToggle />
                        <UiIconButton
                            icon="menu"
                            label="Buka menu"
                            variant="outline"
                            @click="ui.sidebarOpen = true"
                        />
                    </div>
                </header>
                <WorkspaceHeader
                    class=":uno: shrink-0"
                    :root="workspace.admin"
                    :page="route.meta.title || ''"
                />
                <main
                    ref="body"
                    class=":uno: flex-1 min-h-0 overflow-y-auto overscroll-contain"
                >
                    <div
                        class=":uno: mx-auto w-full max-w-[1280px] px-5 py-5 md:px-8 md:py-6 lg:px-10 lg:py-8 flex flex-col gap-6"
                    >
                        <slot />
                    </div>
                </main>
            </div>
        </div>
        <AdminDrawer />
    </div>
</template>
