<script setup>
import { slogan, copyright, university, legal } from "@app/constants/site.json";
</script>

<template>
  <footer class="border-t border-rule bg-paper">
    <div class="wrap py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col gap-2">
        <UiLogo />
        <p class="type-small">{{ slogan }}</p>
      </div>
      <div class="flex flex-col gap-2 md:items-end">
        <div class="flex gap-5">
          <NuxtLink v-for="item in legal" :key="item.to" :to="item.to" class="type-small hover:text-brand-blue">{{ item.label }}</NuxtLink>
        </div>
        <p class="type-meta">{{ copyright }} · {{ university }}</p>
      </div>
    </div>
  </footer>
</template>
