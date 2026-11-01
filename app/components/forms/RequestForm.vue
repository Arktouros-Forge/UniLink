<script setup>
const props = defineProps({
  subject: { type: String, default: "" },
  submitLabel: { type: String, default: "Kirim permintaan" },
});
const emit = defineEmits(["save"]);

const form = reactive({ subject: props.subject, description: "", preferredTime: "" });
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form })">
    <AppInput v-model="form.subject" label="Topik" required />
    <AppInput v-model="form.description" label="Pesan" as="textarea" :rows="3" required />
    <AppInput v-model="form.preferredTime" label="Waktu yang cocok" />
    <AppButton type="submit" block>{{ submitLabel }}</AppButton>
  </form>
</template>
