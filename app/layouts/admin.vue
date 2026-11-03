<script setup>
import { workspace } from "@app/constants/site.json";
import { adminNav } from "@app/constants/navigation.json";

const route = useRoute();
const items = adminNav.flatMap((section) => section.items);
</script>

<template>
  <div class="min-h-dvh bg-paper flex flex-col">
    <div class="grid grid-cols-3 h-[6px] shrink-0" aria-hidden="true">
      <span class="bg-red" /><span class="bg-blue" /><span class="bg-yellow" />
    </div>
    <div class="flex-1 md:flex">
      <SidebarNav class="hidden md:flex !h-[calc(100dvh-6px)] !top-[6px]" admin />
      <div class="flex-1 min-w-0 flex flex-col">
        <header class="md:hidden flex items-center justify-between h-14 px-5 border-b border-hairline">
          <UiLogo />
        </header>
        <nav class="md:hidden flex gap-2 overflow-x-auto px-5 py-3 border-b border-hairline">
          <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="shrink-0">
            <UiChip size="md" :outline="route.path === item.to">{{ item.label }}</UiChip>
          </NuxtLink>
        </nav>
        <WorkspaceHeader :root="workspace.admin" :page="route.meta.title || ''" />
        <main class="flex-1 px-5 py-6 md:px-12 md:py-8 flex flex-col gap-6"><slot /></main>
      </div>
    </div>
  </div>
</template>
