<script setup>
import { studentNav, adminNav } from "@app/constants/navigation.json";
import { roles, university, logout } from "@app/constants/site.json";
import { useAuthStore } from "@app/stores/auth";
import { activeNavTo } from "@app/utils/nav";

const props = defineProps({ admin: { type: Boolean, default: false } });
const auth = useAuthStore();
const route = useRoute();
const sections = computed(() => (props.admin ? adminNav : studentNav));
const activeTo = computed(() =>
    activeNavTo(
        route.path,
        sections.value.flatMap((section) =>
            section.items.map((item) => item.to),
        ),
    ),
);
const isActive = (to) => activeTo.value === to;
const signOut = async () => {
    await auth.logout();
    await navigateTo("/auth/login");
};
</script>

<template>
    <aside
        class=":uno: flex flex-col w-[270px] shrink-0 h-full bg-card border-r border-hairline"
    >
        <NuxtLink
            :to="admin ? '/admin' : '/student/dashboard'"
            class=":uno: px-5 pt-8 pb-7"
            ><UiLogo
        /></NuxtLink>
        <nav class=":uno: flex-1 overflow-y-auto flex flex-col pb-4">
            <section
                v-for="section in sections"
                :key="section.label"
                class=":uno: flex flex-col"
            >
                <p class=":uno: px-5 pt-1 pb-2 m-0 t-body-s text-ink-2">
                    {{ section.label }}
                </p>
                <NuxtLink
                    v-for="item in section.items"
                    :key="item.to"
                    :to="item.to"
                    class=":uno: relative mx-5 mb-2 h-11 pl-3 pr-3 flex items-center gap-3 t-label transition-colors"
                    :class="
                        isActive(item.to)
                            ? ':uno: bg-blue text-onblue'
                            : ':uno: text-ink-2 hover:bg-hairline'
                    "
                >
                    <span
                        v-if="isActive(item.to)"
                        class=":uno: absolute left-0 top-0 bottom-0 w-1 bg-red"
                    />
                    <UiIcon :name="item.icon" />
                    {{ item.label }}
                </NuxtLink>
            </section>
        </nav>
        <div class=":uno: px-5 pb-6 flex flex-col gap-4">
            <div class=":uno: flex items-center gap-3">
                <UiAvatar :name="auth.user?.name ?? ''" :size="32" />
                <div class=":uno: min-w-0">
                    <p class=":uno: t-body-s text-ink m-0 truncate">
                        {{ auth.user?.name }}
                    </p>
                    <p class=":uno: t-body-s text-ink-2 m-0 truncate">
                        {{ admin ? roles.admin : university }}
                    </p>
                </div>
            </div>
            <button
                type="button"
                class=":uno: inline-flex items-center gap-3 px-3 bg-transparent border-0 text-blue t-button cursor-pointer h-10"
                @click="signOut"
            >
                <UiIcon name="logout" />{{ logout }}
            </button>
        </div>
    </aside>
</template>
