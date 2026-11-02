<template>
  <div class="min-h-dvh bg-paper md:grid md:grid-cols-[232px_1fr]">
    <SideNav class="hidden md:flex" nav="adminNav" admin />
    <div class="flex flex-col min-h-dvh">
      <AppTopbar admin />
      <nav class="md:hidden flex gap-2 overflow-x-auto px-5 py-3 border-b border-edge">
        <NuxtLink
          v-for="item in adminNav"
          :key="item.to"
          :to="item.to"
          class="chip shrink-0"
          :class="$route.path === item.to ? toneClass.blue : toneClass.neutral"
        >{{ item.label }}</NuxtLink>
      </nav>
      <main class="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-[1200px] w-full mx-auto"><slot /></main>
    </div>
  </div>
</template>

<script setup>
import { adminNav } from "@app/constants/navigation.json";
import { toneClass } from "@app/utils/tone";
</script>
