<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, required: true },
  action: { type: String, default: "Hapus" },
});
defineEmits(["close", "confirm"]);
</script>

<template>
  <UiModal :open="open" :title="title" @close="$emit('close')">
    <p class="t-body-m text-ink-2 m-0">{{ text }}</p>
    <template #footer>
      <UiButton variant="danger" @click="$emit('confirm')">{{ action }}</UiButton>
      <UiButton variant="link" @click="$emit('close')">Batal</UiButton>
    </template>
  </UiModal>
</template>
