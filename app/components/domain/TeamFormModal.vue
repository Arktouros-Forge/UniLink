<script setup>
import { teamForm as copy } from "@app/constants/student.json";

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "Buat tim" },
  initial: { type: Object, default: () => ({}) },
  maxSize: { type: Number, default: 5 },
  minSize: { type: Number, default: 1 },
  pending: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "save"]);

const form = reactive({ name: "", description: "", capacity: "" });

watch(
  () => [props.open, props.initial],
  () => {
    form.name = props.initial.name ?? "";
    form.description = props.initial.description ?? "";
    form.capacity = String(props.initial.capacity ?? props.maxSize);
  },
  { immediate: true },
);

const sizes = computed(() => Array.from({ length: Math.max(1, props.maxSize - props.minSize + 1) }, (_, i) => String(props.minSize + i)));
const valid = computed(() => form.name.trim().length >= 2);
</script>

<template>
  <UiModal :open="open" :title="title" @close="emit('close')">
    <FormField :label="copy.name" :error="errors.name" v-slot="{ id }"><FormInput :id="id" v-model="form.name" :placeholder="copy.namePlaceholder" /></FormField>
    <FormField :label="copy.description" :error="errors.description" v-slot="{ id }"><FormTextarea :id="id" v-model="form.description" :placeholder="copy.descriptionPlaceholder" /></FormField>
    <FormField :label="copy.capacity" :error="errors.maxMembers" v-slot="{ id }"><FormSelect :id="id" v-model="form.capacity" :options="sizes" /></FormField>
    <template #footer>
      <UiButton icon="check" :loading="pending" :disabled="!valid" @click="emit('save', { name: form.name, description: form.description || null, maxMembers: Number(form.capacity) })">{{ copy.save }}</UiButton>
      <UiButton variant="link" @click="emit('close')">{{ copy.cancel }}</UiButton>
    </template>
  </UiModal>
</template>
