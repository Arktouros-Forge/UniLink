<script setup>
import { limits } from "@app/constants/options.json";
import { modals } from "@app/constants/student.json";
import toast from "@app/constants/toast.json";

const copy = modals.request;
const props = defineProps({
    open: { type: Boolean, default: false },
    helper: { type: Object, default: null },
});
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const form = reactive({ skill: "", message: "", time: "" });
const skillNames = computed(
    () => props.helper?.skills?.map((skill) => skill.name) ?? [],
);
watch(
    () => props.helper,
    () => (form.skill = skillNames.value[0] || ""),
    { immediate: true },
);
const { run, pending, fieldErrors } = useAction(async () => {
    await api.post("/student/study-match/requests", {
        helperId: props.helper.id,
        subject: form.skill,
        description: form.message,
        preferredTime: form.time || null,
    });
    form.message = "";
    form.time = "";
    emit("sent");
}, { success: toast.messages.requestSent, validate: () => collect({ description: rule.min(form.message, 20) }) });
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="copy.eyebrow"
        :title="copy.title"
        :text="copy.text"
        :submit="copy.submit"
        :pending="pending"
        @close="emit('close')"
        @submit="run()"
    >
        <div
            v-if="helper"
            class=":uno: flex items-center gap-3 p-3 rounded-md border border-hairline bg-paper/60"
        >
            <UiAvatar :name="helper.fullName" :size="40" />
            <div class=":uno: min-w-0">
                <p class=":uno: t-label text-ink m-0 truncate">
                    {{ helper.fullName }}
                </p>
                <p class=":uno: t-body-xs text-ink-2 m-0 truncate">
                    {{ helper.major }}
                </p>
            </div>
        </div>
        <FormField :label="copy.skill" v-slot="{ id }"
            ><FormChoice :id="id" v-model="form.skill" :options="skillNames"
        /></FormField>
        <FormField
            :label="copy.message"
            :error="fieldErrors.description"
            v-slot="{ id }"
        >
            <FormTextarea
                :id="id"
                v-model="form.message"
                :min="20"
                :max="1000"
                :placeholder="copy.placeholder"
            />
        </FormField>
        <FormField
            :label="copy.time"
            optional
            :error="fieldErrors.preferredTime"
            v-slot="{ id }"
        >
            <div class=":uno: flex flex-col gap-2">
                <FormChoice
                    :model-value="
                        modals.quickTimes.includes(form.time) ? form.time : ''
                    "
                    :options="modals.quickTimes"
                    @update:model-value="form.time = $event"
                />
                <FormInput
                    :id="id"
                    v-model="form.time"
                    :placeholder="copy.timePlaceholder"
                    icon-start="clock"
                />
            </div>
        </FormField>
        <p class=":uno: t-mono-s text-ink-2 m-0 flex items-center gap-2">
            <UiIcon name="lock" />{{
                copy.note.replace("{days}", limits.requestDays)
            }}
        </p>
    </UiModal>
</template>
