<script setup>
defineProps({ pages: { type: Number, required: true } });
const model = defineModel({ type: Number, default: 1 });
</script>

<template>
  <nav class="flex items-center gap-3 t-body-s text-ink-2" aria-label="Halaman">
    <button type="button" class="size-8 inline-flex items-center justify-center bg-transparent border-0 cursor-pointer rounded-sm text-ink hover:bg-hairline disabled:opacity-40" :disabled="model <= 1" @click="model--"><UiIcon name="chevronLeft" /></button>
    <span class="min-w-8 h-8 px-2 inline-flex items-center justify-center rounded-sm bg-hairline text-ink t-label">{{ model }}</span>
    <span>dari {{ pages }}</span>
    <button type="button" class="size-8 inline-flex items-center justify-center bg-transparent border-0 cursor-pointer rounded-sm text-ink hover:bg-hairline disabled:opacity-40" :disabled="model >= pages" @click="model++"><UiIcon name="chevronRight" /></button>
  </nav>
</template>
