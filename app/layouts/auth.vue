<script setup>
import { authPanel } from "@app/constants/site.json";
</script>

<template>
  <div class="min-h-screen lg:grid lg:grid-cols-2">
    <section class="hidden flex-col justify-between bg-soft p-10 lg:flex">
      <AppBrand />
      <div class="grid gap-6">
        <InterlockArt />
        <h2 class="type-display">{{ authPanel.title }}</h2>
        <p class="type-body max-w-md text-mute">{{ authPanel.text }}</p>
      </div>
      <PublicFooter />
    </section>
    <section class="flex flex-col p-4 sm:p-8">
      <div class="flex items-center justify-between lg:justify-end">
        <div class="lg:hidden"><AppBrand /></div>
        <ThemeToggle />
      </div>
      <div class="m-auto w-full max-w-md py-8"><slot /></div>
    </section>
  </div>
</template>
