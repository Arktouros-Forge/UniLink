<script setup>
import { useAuthStore } from "@app/stores/auth";

defineProps({
  items: { type: Array, required: true },
  mobileItems: { type: Array, required: true },
});

const auth = useAuthStore();

const signOut = async () => {
  auth.logout();
  await navigateTo("/auth/login");
};
</script>

<template>
  <div class="min-h-screen md:grid md:grid-cols-[16rem_1fr]">
    <aside class="sticky top-0 hidden h-screen flex-col gap-6 border-r border-rule p-4 md:flex">
      <AppBrand />
      <SidebarNav :items="items" />
      <div class="mt-auto grid gap-3">
        <div v-if="auth.user" class="flex items-center gap-3">
          <AppAvatar :name="auth.user.fullName" />
          <div class="min-w-0">
            <p class="type-small truncate font-medium">{{ auth.user.fullName }}</p>
            <p class="type-meta truncate text-mute">{{ auth.user.email }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <ThemeToggle />
          <AppButton variant="ghost" size="sm" @click="signOut"><span class="i-keyline-log-out" />Keluar</AppButton>
        </div>
      </div>
    </aside>
    <div class="min-w-0 pb-20 md:pb-0">
      <header class="flex items-center justify-between border-b border-rule px-4 py-3 md:hidden">
        <AppBrand />
        <div class="flex items-center gap-1">
          <ThemeToggle />
          <AppButton variant="ghost" size="sm" aria-label="Keluar" @click="signOut"><span class="i-keyline-log-out" /></AppButton>
        </div>
      </header>
      <main class="page py-6 md:py-8"><slot /></main>
    </div>
    <MobileNav :items="mobileItems" />
  </div>
</template>
