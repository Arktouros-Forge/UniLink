<script setup>
import { limits } from "@app/constants/options.json";

const props = defineProps({
    open: { type: Boolean, default: false },
    helper: { type: Object, default: null },
});
const emit = defineEmits(["close", "sent"]);
const api = useApi();
const form = reactive({ skill: "", message: "", time: "" });
const tooShort = computed(() => form.message.length < 20);
const skillNames = computed(() => props.helper?.skills?.map((skill) => skill.name) ?? []);
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
});
const send = () => !tooShort.value && run();
</script>

<template>
    <UiModal :open="open" title="Minta bantuan" @close="emit('close')">
        <UiCard
            v-if="helper"
            padding="p-4"
            class="flex items-center gap-3 shadow-none"
        >
            <UiAvatar :name="helper.fullName" :size="40" />
            <div>
                <p class="t-label text-ink m-0">{{ helper.fullName }}</p>
                <p class="t-body-xs text-ink-2 m-0">
                    {{ helper.major }} · Universitas Udayana
                </p>
                <p class="t-mono-s text-ink m-0">
                    {{ skillNames.join(" · ") }}
                </p>
            </div>
        </UiCard>
        <FormField label="Keahlian yang dibutuhkan" v-slot="{ id }"
            ><FormSelect
                :id="id"
                v-model="form.skill"
                :options="skillNames"
        /></FormField>
        <FormField
            label="Apa yang ingin kamu pahami?"
            hint="Minimal 20 karakter. Fokus pada pemahaman, bukan meminta jawaban tugas."
            :error="fieldErrors.description || (form.message && tooShort ? 'Minimal 20 karakter.' : '')"
            v-slot="{ id }"
        >
            <FormTextarea
                :id="id"
                v-model="form.message"
                placeholder="Ceritakan yang sudah kamu coba dan bagian yang membingungkan."
            />
        </FormField>
        <FormField label="Waktu yang diharapkan" optional v-slot="{ id }"
            ><FormInput
                :id="id"
                v-model="form.time"
                placeholder="Contoh: Selasa 16.00 WITA"
        /></FormField>
        <UiCallout title="Lanjutkan percakapan di WhatsApp" tone="info"
            >Berlaku {{ limits.requestDays }} hari. Nomor terbuka setelah
            permintaan diterima.</UiCallout
        >
        <template #footer>
            <UiButton icon="check" :loading="pending" :disabled="tooShort" @click="send"
                >Kirim permintaan</UiButton
            >
            <UiButton variant="link" @click="emit('close')">Batal</UiButton>
        </template>
    </UiModal>
</template>
