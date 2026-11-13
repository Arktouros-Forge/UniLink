<script setup>
import { modals } from "@app/constants/student.json";

defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    text: { type: String, default: "" },
    label: { type: String, default: "Alasan" },
    action: { type: String, default: "Konfirmasi" },
});
const emit = defineEmits(["close", "confirm"]);
const copy = modals.reason;
const reason = ref("");
const { errors: shown, check } = useLocalCheck({});

const submit = () => {
    if (!check({ reason: rule.min(reason.value, 3) })) return;
    emit("confirm", reason.value.trim());
    reason.value = "";
};
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="modals.confirm.eyebrow"
        :title="title"
        :text="text"
        :submit="action"
        danger
        @close="emit('close')"
        @submit="submit"
    >
        <FormField :label="copy.presetLabel"
            ><FormChoice
                :model-value="copy.presets.includes(reason) ? reason : ''"
                :options="copy.presets"
                @update:model-value="reason = $event"
        /></FormField>
        <FormField :label="label" :error="shown.reason" v-slot="{ id }"
            ><FormTextarea
                :id="id"
                v-model="reason"
                :rows="3"
                :min="3"
                :max="300"
                placeholder="Tuliskan alasan singkat."
        /></FormField>
    </UiModal>
</template>
