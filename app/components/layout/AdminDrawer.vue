<script setup>
import { useUiStore } from "@app/stores/ui";

const ui = useUiStore();
const route = useRoute();
const close = () => {
    ui.sidebarOpen = false;
};
watch(() => route.path, close);
const onKey = (event) => event.key === "Escape" && close();
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <Teleport to="body">
        <div
            v-if="ui.sidebarOpen"
            class=":uno: lg:hidden fixed inset-0 z-50 flex"
        >
            <SidebarNav
                admin
                class=":uno: relative z-10 max-w-[85vw] shadow-hover"
            />
            <button
                type="button"
                aria-label="Tutup menu"
                class=":uno: flex-1 border-0 bg-ink/10 cursor-pointer"
                @click="close"
            />
        </div>
    </Teleport>
</template>
