<script setup>
defineProps({
  strong: { type: Boolean, default: false },
  to: { type: String, default: "" },
});
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="block p-5 transition hover:border-ink" :class="strong ? 'card-strong' : 'card'">
    <slot />
  </NuxtLink>
  <div v-else class="p-5" :class="strong ? 'card-strong' : 'card'">
    <slot />
  </div>
</template>
