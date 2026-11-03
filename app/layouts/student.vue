<script setup>
import { workspace } from "@app/constants/site.json";

const route = useRoute();
</script>

<template>
  <div class="min-h-dvh bg-paper md:flex">
    <SidebarNav class="hidden md:flex" />
    <div class="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
      <MobileHeader />
      <WorkspaceHeader :root="workspace.student" :page="route.meta.title || ''" />
      <main class="flex-1 px-5 py-6 md:px-12 md:py-8 flex flex-col gap-6"><slot /></main>
    </div>
    <BottomNav />
  </div>
</template>
