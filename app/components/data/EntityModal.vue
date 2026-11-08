<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  fields: { type: Array, required: true },
  initial: { type: Object, default: () => ({}) },
  pending: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "save"]);
const values = reactive({});
watch(() => [props.open, props.initial], () => {
  props.fields.forEach((field) => (values[field.key] = props.initial?.[field.key] ?? ""));
}, { immediate: true });
const valid = computed(() => props.fields.filter((field) => field.required).every((field) => values[field.key]));
</script>

<template>
  <UiModal :open="open" :title="title" @close="emit('close')">
    <FormField v-for="field in fields" :key="field.key" :label="field.label" :error="errors[field.payloadKey ?? field.key]" v-slot="{ id }">
      <FormSelect v-if="field.options" :id="id" v-model="values[field.key]" :options="field.options" placeholder="Pilih" />
      <FormTextarea v-else-if="field.multiline" :id="id" v-model="values[field.key]" />
      <FormInput v-else :id="id" v-model="values[field.key]" :type="field.type || 'text'" />
    </FormField>
    <template #footer>
      <UiButton icon="check" :loading="pending" :disabled="!valid" @click="emit('save', { ...initial, ...values })">Simpan</UiButton>
      <UiButton variant="link" @click="emit('close')">Batal</UiButton>
    </template>
  </UiModal>
</template>
