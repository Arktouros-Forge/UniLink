<script setup>
import { offerModal as copy, modals } from "@app/constants/student.json";

const props = defineProps({
    open: { type: Boolean, default: false },
    signId: { type: String, default: "" },
});
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const form = reactive({ description: "", time: "" });
const { run, pending, fieldErrors } = useAction(
    async () => {
        await api.post(
            `/student/study-match/help-signs/${props.signId}/offer`,
            { description: form.description, preferredTime: form.time || null },
        );
        form.description = "";
        form.time = "";
        emit("sent");
    },
    {
        success: copy.sent,
        validate: () => collect({ description: rule.min(form.description, 10) }),
    },
);
</script>

<template>
    <UiModal
        :open="open"
        :eyebrow="modals.offer.eyebrow"
        :title="copy.title"
        :text="modals.offer.text"
        :submit="copy.submit"
        :pending="pending"
        @close="emit('close')"
        @submit="run()"
    >
        <FormField
            :label="copy.message"
            :error="fieldErrors.description"
            v-slot="{ id }"
            ><FormTextarea
                :id="id"
                v-model="form.description"
                :min="10"
                :max="1000"
                :placeholder="modals.offer.placeholder"
        /></FormField>
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
                    :placeholder="modals.offer.timePlaceholder"
                    icon-start="clock"
                />
            </div>
        </FormField>
    </UiModal>
</template>
