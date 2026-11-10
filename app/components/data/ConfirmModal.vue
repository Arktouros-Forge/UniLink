<script setup>
import { modals } from "@app/constants/student.json";

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, required: true },
  action: { type: String, default: "Hapus" },
});
defineEmits(["close", "confirm"]);
</script>

<template>
  <UiModal :open="open" :eyebrow="modals.confirm.eyebrow" :title="title" :text="text" :submit="action" danger width="sm:max-w-[440px]" @close="$emit('close')" @submit="$emit('confirm')" />
</template>
