<script setup>
import { studentNav, adminNav } from "@app/constants/navigation.json";
import { useAuthStore } from "@app/stores/auth";
import { roleLabels } from "@app/constants/site.json";

const props = defineProps({
  nav: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

const auth = useAuthStore();
const items = computed(() => (props.nav === "adminNav" ? adminNav : studentNav));
const route = useRoute();
const isActive = (to) => route.path === to || (to !== "/admin" && route.path.startsWith(`${to}/`));
const logout = () => {
  auth.logout();
  navigateTo("/auth/login");
};
</script>

<template>
  <aside class="flex-col gap-6 sticky top-0 h-dvh bg-card border-r border-edge p-4">
    <NuxtLink :to="admin ? '/admin' : '/student/dashboard'" class="px-2 pt-2"><UiLogo /></NuxtLink>
    <nav class="flex flex-col gap-1 flex-1 overflow-y-auto">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 h-10 px-3 rounded-lg type-label"
        :class="isActive(item.to) ? 'bg-brand-blue !text-onbrand' : 'hover:bg-soft'"
      >
        <span :class="item.icon" class="text-lg" />
        {{ item.label }}
      </NuxtLink>
    </nav>
    <div class="flex items-center gap-3 border-t border-edge pt-4">
      <UiAvatar :name="auth.user.name" />
      <div class="flex-1 min-w-0">
        <p class="type-label truncate">{{ auth.user.name }}</p>
        <p class="type-meta">{{ admin ? roleLabels.admin : roleLabels.student }}</p>
      </div>
      <button class="size-9 inline-flex items-center justify-center bg-transparent border-0 text-ink cursor-pointer rounded-lg hover:bg-soft" @click="logout">
        <span class="i-keyline-icons-log-out text-lg" />
      </button>
    </div>
  </aside>
</template>
