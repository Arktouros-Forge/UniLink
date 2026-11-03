<script setup>
defineProps({
  id: { type: String, default: undefined },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 4 },
});
const model = defineModel({ type: String, default: "" });
</script>

<template>
  <textarea :id="id" v-model="model" :rows="rows" :placeholder="placeholder" class="w-full rounded-md border border-hairline bg-card text-ink t-body-s p-3 outline-none resize-none focus:border-blue focus:shadow-[0_0_0_2px_var(--canvas-paper),0_0_0_4px_var(--brand-blue)]" />
</template>
