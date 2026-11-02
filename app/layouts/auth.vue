<script setup>
import { authPanel } from "@app/constants/site.json";
</script>

<template>
  <div class="min-h-dvh bg-paper md:grid md:grid-cols-[1fr_1fr]">
    <aside class="hidden md:flex flex-col justify-between bg-brand-blue text-onbrand p-16">
      <NuxtLink to="/"><UiLogo inverted /></NuxtLink>
      <div class="flex flex-col gap-6">
        <InterlockArt />
        <h2 class="font-display font-bold text-[40px] leading-[52px] tracking-[-0.02em]">{{ authPanel.title }}</h2>
        <p class="text-lg leading-7 opacity-90">{{ authPanel.text }}</p>
      </div>
      <p class="type-meta !text-onbrand opacity-80">{{ authPanel.meta }}</p>
    </aside>
    <div class="flex flex-col min-h-dvh">
      <header class="flex items-center justify-between h-16 px-5 md:px-12">
        <NuxtLink to="/" class="md:invisible"><UiLogo /></NuxtLink>
        <UiThemeToggle />
      </header>
      <main class="flex-1 flex items-center justify-center px-5 pb-10 md:px-12">
        <div class="w-full max-w-[440px]"><slot /></div>
      </main>
    </div>
  </div>
</template>
