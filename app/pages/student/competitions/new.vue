<script setup>
import { newCompetition as copy } from "@app/constants/student.json";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Tambah kompetisi",
});
const api = useApi();
const { data: categories } = await useCategoryOptions();
const form = reactive({
    title: "",
    host: "",
    description: "",
    sourceUrl: "",
    deadline: "",
    prize: "",
    maxTeamSize: "",
    categoryIds: [],
});
const toggle = (id) =>
    (form.categoryIds = form.categoryIds.includes(id)
        ? form.categoryIds.filter((entry) => entry !== id)
        : [...form.categoryIds, id].slice(0, 5));
const valid = computed(
    () =>
        form.title &&
        form.host &&
        form.description.length >= 10 &&
        form.deadline &&
        form.categoryIds.length,
);
const { run, pending, fieldErrors } = useAction(
    async () => {
        const created = await api.post("/student/competitions", {
            title: form.title,
            host: form.host,
            description: form.description,
            sourceUrl: form.sourceUrl || null,
            deadline: new Date(`${form.deadline}T23:59:00`).toISOString(),
            prize: form.prize || null,
            maxTeamSize: form.maxTeamSize ? Number(form.maxTeamSize) : null,
            categoryIds: form.categoryIds,
        });
        await navigateTo(`/student/competitions/${created.id}`);
    },
    { success: copy.created },
);
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text" />
    <div class=":uno: grid gap-6 md:items-start">
        <UiCard class=":uno: flex flex-col gap-5">
            <FormField
                :label="copy.name"
                :error="fieldErrors.title"
                v-slot="{ id }"
                ><FormInput :id="id" v-model="form.title"
            /></FormField>
            <FormField
                :label="copy.host"
                :error="fieldErrors.host"
                v-slot="{ id }"
                ><FormInput :id="id" v-model="form.host"
            /></FormField>
            <FormField
                :label="copy.about"
                :error="fieldErrors.description"
                v-slot="{ id }"
                ><FormTextarea :id="id" v-model="form.description"
            /></FormField>
            <FormField
                :label="copy.source"
                :error="fieldErrors.sourceUrl"
                v-slot="{ id }"
                ><FormInput
                    :id="id"
                    v-model="form.sourceUrl"
                    type="url"
                    icon="external"
                    placeholder="https://"
            /></FormField>
            <div
                class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2"
            >
                <FormField
                    :label="copy.deadline"
                    :error="fieldErrors.deadline"
                    v-slot="{ id }"
                    ><FormInput :id="id" v-model="form.deadline" type="date"
                /></FormField>
                <FormField
                    :label="copy.maxTeam"
                    optional
                    :error="fieldErrors.maxTeamSize"
                    v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        v-model="form.maxTeamSize"
                        type="number"
                /></FormField>
            </div>
            <FormField :label="copy.prize" optional v-slot="{ id }"
                ><FormInput :id="id" v-model="form.prize"
            /></FormField>
            <FormField
                :label="copy.categories"
                :error="fieldErrors.categoryIds"
                v-slot="{ id }"
            >
                <div :id="id" class=":uno: flex flex-wrap gap-2">
                    <button
                        v-for="item in categories"
                        :key="item.id"
                        type="button"
                        class=":uno: bg-transparent border-0 p-0 cursor-pointer"
                        @click="toggle(item.id)"
                    >
                        <UiChip
                            size="md"
                            :outline="form.categoryIds.includes(item.id)"
                            :icon="
                                form.categoryIds.includes(item.id)
                                    ? 'check'
                                    : ''
                            "
                            >{{ item.name }}</UiChip
                        >
                    </button>
                </div>
            </FormField>
            <div class=":uno: flex gap-3">
                <UiButton
                    size="sm"
                    :loading="pending"
                    :disabled="!valid"
                    @click="run()"
                    >{{ copy.submit }}</UiButton
                >
                <UiButton size="sm" variant="link" to="/student/competitions">{{
                    copy.cancel
                }}</UiButton>
            </div>
        </UiCard>
    </div>
</template>
