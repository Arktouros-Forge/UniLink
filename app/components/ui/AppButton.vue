<script setup>
defineProps({
  variant: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  to: { type: String, default: "" },
  href: { type: String, default: "" },
  type: { type: String, default: "button" },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};
const sizes = { md: "", sm: "btn-sm" };
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="btn" :class="[variants[variant], sizes[size], block && 'w-full']">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" target="_blank" rel="noopener" class="btn" :class="[variants[variant], sizes[size], block && 'w-full']">
    <slot />
  </a>
  <button v-else :type="type" :disabled="loading" class="btn" :class="[variants[variant], sizes[size], block && 'w-full']">
    <span v-if="loading" class="i-keyline-clock animate-spin" />
    <slot />
  </button>
</template>
