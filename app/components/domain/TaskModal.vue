<script setup>
import { tasks as copy } from "@app/constants/student.json";

const props = defineProps({
    open: { type: Boolean, default: false },
    initial: { type: Object, default: () => ({}) },
    pending: { type: Boolean, default: false },
    errors: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "save"]);
const { errors: shown, check, reset } = useLocalCheck(toRef(props, "errors"));
const form = reactive({
    title: "",
    course: "",
    dueDate: "",
    priority: "medium",
    notes: "",
});
const editing = computed(() => Boolean(props.initial.id));

watch(
    () => [props.open, props.initial],
    () => {
        reset();
        form.title = props.initial.title ?? "";
        form.course = props.initial.course ?? "";
        form.dueDate = props.initial.dueDate ?? "";
        form.priority = props.initial.priority ?? "medium";
        form.notes = props.initial.notes ?? "";
    },
    { immediate: true },
);

const save = () =>
    check({ title: rule.required(form.title) }) &&
    emit("save", {
        title: form.title,
        course: form.course || null,
        dueDate: form.dueDate || null,
        priority: form.priority,
        notes: form.notes || null,
    });
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="copy.modal.eyebrow"
        :title="editing ? copy.editTitle : copy.newTitle"
        :text="copy.modal.text"
        :submit="editing ? copy.save : copy.create"
        :pending="pending"
        @close="emit('close')"
        @submit="save"
    >
        <FormField
            :label="copy.fieldTitle"
            :error="shown.title"
            v-slot="{ id }"
            ><FormInput
                :id="id"
                v-model="form.title"
                :placeholder="copy.modal.titlePlaceholder"
        /></FormField>
        <div class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <FormField
                :label="copy.fieldCourse"
                optional
                :error="shown.course"
                v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.course"
                    :placeholder="copy.modal.coursePlaceholder"
            /></FormField>
            <FormField
                :label="copy.fieldDue"
                optional
                :error="shown.dueDate"
                v-slot="{ id }"
                ><FormInput :id="id" v-model="form.dueDate" type="date"
            /></FormField>
        </div>
        <FormField :label="copy.fieldPriority"
            ><FormChoice
                v-model="form.priority"
                :options="copy.priorities"
                cols="grid-cols-3"
                center
        /></FormField>
        <FormField
            :label="copy.fieldNotes"
            optional
            :error="shown.notes"
            v-slot="{ id }"
            ><FormTextarea
                :id="id"
                v-model="form.notes"
                :rows="3"
                :max="500"
                :placeholder="copy.modal.notesPlaceholder"
        /></FormField>
    </UiModal>
</template>
