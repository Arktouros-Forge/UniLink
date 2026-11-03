<script setup>
defineProps({ placeholder: { type: String, default: "Cari" } });
const model = defineModel({ type: String, default: "" });
</script>

<template>
  <div class="relative flex-1">
    <UiIcon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
    <input v-model="model" type="search" :placeholder="placeholder" class="w-full h-11 md:h-[46px] rounded-md border border-hairline bg-card shadow-rest pl-11 pr-4 t-body-s text-ink outline-none focus:border-blue focus:shadow-[0_0_0_2px_var(--canvas-paper),0_0_0_4px_var(--brand-blue)]" />
  </div>
</template>
