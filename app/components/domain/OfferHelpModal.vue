<script setup>
import { offerModal as copy } from "@app/constants/student.json";

const props = defineProps({ open: { type: Boolean, default: false }, signId: { type: String, default: "" } });
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const form = reactive({ description: "", time: "" });
const tooShort = computed(() => form.description.length < 10);
const { run, pending, fieldErrors } = useAction(
  async () => {
    await api.post(`/student/study-match/help-signs/${props.signId}/offer`, { description: form.description, preferredTime: form.time || null });
    form.description = "";
    form.time = "";
    emit("sent");
  },
  { success: copy.sent },
);
</script>

<template>
  <UiModal :open="open" :title="copy.title" @close="emit('close')">
    <FormField :label="copy.message" :hint="copy.hint" :error="fieldErrors.description" v-slot="{ id }"><FormTextarea :id="id" v-model="form.description" /></FormField>
    <FormField :label="copy.time" optional v-slot="{ id }"><FormInput :id="id" v-model="form.time" :placeholder="copy.timePlaceholder" /></FormField>
    <template #footer>
      <UiButton icon="check" :loading="pending" :disabled="tooShort" @click="run()">{{ copy.submit }}</UiButton>
      <UiButton variant="link" @click="emit('close')">{{ copy.cancel }}</UiButton>
    </template>
  </UiModal>
</template>
