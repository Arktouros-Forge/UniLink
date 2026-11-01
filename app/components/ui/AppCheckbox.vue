<script setup>
defineProps({
  label: { type: String, default: "" },
});

const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2.5">
    <input v-model="model" type="checkbox" class="size-5 accent-[var(--blue)]" />
    <span v-if="label" class="type-body"><slot>{{ label }}</slot></span>
  </label>
</template>
