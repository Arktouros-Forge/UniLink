<script setup>
import { teamResults } from "@app/constants/options.json";
import { modals } from "@app/constants/student.json";

defineProps({ open: { type: Boolean, default: false }, pending: { type: Boolean, default: false } });
const emit = defineEmits(["close", "save"]);
const copy = modals.result;
const result = ref("");
</script>

<template>
  <UiModal :open="open" :eyebrow="copy.eyebrow" title="Laporkan hasil" :text="copy.text" submit="Kirim laporan" :pending="pending" :disabled="!result" @close="emit('close')" @submit="emit('save', result)">
    <FormField :label="copy.label"><FormChoice v-model="result" :options="teamResults" stacked /></FormField>
    <p class=":uno: t-mono-s text-ink-2 m-0 flex items-center gap-2"><UiIcon name="info" />{{ copy.note }}</p>
  </UiModal>
</template>
