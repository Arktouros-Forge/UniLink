<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  icon: { type: String, default: "i-keyline-icons-inbox" },
});
</script>

<template>
  <div class="card flex flex-col items-center text-center gap-3 py-12 border-dashed">
    <span class="size-12 inline-flex items-center justify-center rounded-full bg-soft"><span :class="icon" class="text-2xl text-mute" /></span>
    <h3 class="type-h3">{{ title }}</h3>
    <p v-if="text" class="type-small max-w-[360px]">{{ text }}</p>
    <slot />
  </div>
</template>
