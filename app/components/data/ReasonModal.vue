<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, default: "" },
  label: { type: String, default: "Alasan" },
  action: { type: String, default: "Konfirmasi" },
});
const emit = defineEmits(["close", "confirm"]);
const reason = ref("");
const valid = computed(() => reason.value.trim().length >= 3);

const submit = () => {
  emit("confirm", reason.value.trim());
  reason.value = "";
};
</script>

<template>
  <UiModal :open="open" :title="title" @close="emit('close')">
    <p v-if="text" class="t-body-m text-ink-2 m-0">{{ text }}</p>
    <FormField :label="label" v-slot="{ id }"><FormTextarea :id="id" v-model="reason" placeholder="Tuliskan alasan singkat." /></FormField>
    <template #footer>
      <UiButton variant="danger" :disabled="!valid" @click="submit">{{ action }}</UiButton>
      <UiButton variant="link" @click="emit('close')">Batal</UiButton>
    </template>
  </UiModal>
</template>
