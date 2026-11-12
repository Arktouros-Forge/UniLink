<script setup>
import { teamForm as copy, modals } from "@app/constants/student.json";

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
const text = modals.team;
const form = reactive({ name: "", description: "", capacity: 1 });

watch(
    () => [props.open, props.initial],
    () => {
        form.name = props.initial.name ?? "";
        form.description = props.initial.description ?? "";
        form.capacity = Number(props.initial.capacity ?? props.maxSize);
    },
    { immediate: true },
);

const valid = computed(() => form.name.trim().length >= 2);
const save = () =>
    emit("save", {
        name: form.name,
        description: form.description || null,
        maxMembers: form.capacity,
    });
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="text.eyebrow"
        :title="title"
        :text="text.text"
        :submit="copy.save"
        :pending="pending"
        :disabled="!valid"
        @close="emit('close')"
        @submit="save"
    >
        <FormField :label="copy.name" :error="errors.name" v-slot="{ id }"
            ><FormInput
                :id="id"
                v-model="form.name"
                :placeholder="copy.namePlaceholder"
                icon-start="users"
        /></FormField>
        <FormField
            :label="copy.description"
            optional
            :error="errors.description"
            v-slot="{ id }"
            ><FormTextarea
                :id="id"
                v-model="form.description"
                :rows="3"
                :max="500"
                :placeholder="copy.descriptionPlaceholder"
        /></FormField>
        <FormField
            :label="copy.capacity"
            :hint="text.capacityHint"
            :error="errors.maxMembers"
        >
            <FormStepper
                v-model="form.capacity"
                :min="Math.max(1, minSize)"
                :max="Math.max(maxSize, minSize, 1)"
                :unit="text.unit"
            />
        </FormField>
    </UiModal>
</template>
