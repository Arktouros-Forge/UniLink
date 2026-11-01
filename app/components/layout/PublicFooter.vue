<script setup>
import { siteName, event, university, slogan } from "@app/constants/site.json";
</script>

<template>
  <footer class="border-t border-rule">
    <div class="page flex flex-wrap items-center justify-between gap-2 py-6">
      <p class="type-small text-mute">{{ siteName }} · {{ event }} · {{ university }}</p>
      <p class="type-small text-mute">{{ slogan }}</p>
    </div>
  </footer>
</template>
