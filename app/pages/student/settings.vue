<script setup>
import { years } from "@app/constants/options.json";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";

definePageMeta({
    layout: "student",
    middleware: "auth",
    title: "Pengaturan profil",
});
const auth = useAuthStore();
const ui = useUiStore();
const api = useApi();
const tab = ref("profile");
const form = reactive({
    name: auth.user.name,
    cohort: Number(auth.user.cohort),
    phone: auth.user.phone ?? "",
    website: auth.user.website ?? "",
    skills: [...auth.user.skillIds],
});
const dirty = ref(false);
watch(form, () => (dirty.value = true));
const pending = ref(false);

const profile = useAction(
    async () => {
        await api.patch("/me", {
            fullName: form.name,
            year: String(form.cohort),
            phone: form.phone,
            personalWebsite: form.website || null,
            skills: form.skills,
        });
        await auth.fetchMe({ force: true });
        dirty.value = false;
    },
    { success: "Profil disimpan." },
);

const passwordForm = reactive({ currentPassword: "", newPassword: "" });
const password = useAction(
    async () => {
        await api.patch("/me/password", { ...passwordForm });
        passwordForm.currentPassword = "";
        passwordForm.newPassword = "";
    },
    { success: "Kata sandi diperbarui." },
);
</script>

<template>
    <PageHeading
        :title="tab === 'profile' ? 'Pengaturan profil' : 'Pengaturan akun'"
        text="Jaga profilmu tetap relevan untuk teman dan tim kampus."
    />
    <UiTabs
        v-model="tab"
        :items="[
            { value: 'profile', label: 'Profil' },
            { value: 'account', label: 'Akun dan tampilan' },
        ]"
    />
    <AutoSkeleton :loading="pending" id="settings-body">
        <div
            v-if="tab === 'profile'"
            class="grid md:items-start"
        >
            <UiCard class="flex flex-col gap-5">

                <div class="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                    <FormField label="Nama lengkap" :error="profile.fieldErrors.value.fullName" v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            v-model="form.name"
                    /></FormField>
                    <FormField label="Angkatan" v-slot="{ id }"
                        ><FormSelect
                            :id="id"
                            v-model="form.cohort"
                            :options="years"
                    /></FormField>
                    <FormField label="NIM " v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            :model-value="auth.user.nim"
                            icon="lock"
                            locked
                            disabled
                    /></FormField>
                    <FormField label="Nomor WhatsApp" v-slot="{ id }"
                        ><FormInput :id="id" v-model="form.phone" icon="phone"
                    /></FormField>
                </div>
                <FormField label="Keahlian" v-slot="{ id }"
                    ><SkillTags v-model="form.skills" :id="id"
                /></FormField>
                <FormField label="Website / portofolio" v-slot="{ id }"
                    ><FormInput :id="id" v-model="form.website" icon="external"
                /></FormField>
                <div class="flex items-center justify-between gap-4">
                    <p class="t-body-s text-ink-2 m-0">
                        {{
                            dirty
                                ? "Perubahan belum disimpan."
                                : "Semua perubahan tersimpan."
                        }}
                    </p>
                    <UiButton size="sm" :loading="profile.pending.value" :disabled="!dirty" @click="profile.run()">Simpan perubahan</UiButton>
                </div>
            </UiCard>
        </div>
        <div v-else class="grid gap-6 md:items-start">
            <UiCard class="flex flex-col gap-5">
                <FormField label="Email" v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        :model-value="auth.user.email"
                        icon="mail"
                        disabled
                        locked
                /></FormField>
                <UiDivider />
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="t-label text-ink m-0">Mode gelap</p>
                        <p class="t-body-s text-ink-2 m-0">
                            Ubah tema untuk mengaktifkan {{ ui.theme === 'dark' ? 'mode terang' : 'mode gelap' }}.
                        </p>
                    </div>
                    <UiToggle
                        :model-value="ui.theme === 'dark'"
                        @update:model-value="
                            ui.setTheme($event ? 'dark' : 'light')
                        "
                    />
                </div>
            </UiCard>
        </div>
    </AutoSkeleton>
</template>
