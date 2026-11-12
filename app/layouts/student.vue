<script setup>
import { workspace } from "@app/constants/site.json";

const route = useRoute();
const body = ref(null);
watch(
  () => route.path,
  () => body.value?.scrollTo({ top: 0 }),
);
</script>

<template>
  <div class=":uno: h-dvh overflow-hidden bg-paper lg:flex">
    <SidebarNav class=":uno: hidden lg:flex" />
    <div class=":uno: h-full min-w-0 flex flex-col lg:flex-1">
      <MobileHeader class=":uno: shrink-0" />
      <WorkspaceHeader class=":uno: shrink-0" :root="workspace.student" :page="route.meta.title || ''" />
      <main ref="body" class=":uno: flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div class=":uno: mx-auto w-full max-w-[1280px] px-5 py-5 pb-24 md:px-8 md:py-6 lg:px-10 lg:py-8 lg:pb-10 flex flex-col gap-6"><slot /></div>
      </main>
    </div>
    <BottomNav />
  </div>
</template>
