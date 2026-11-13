<script setup>
import { years } from "@app/constants/options.json";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";

definePageMeta({
    layout: "student",
    access: "student",
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
const themeOptions = [
    { value: "light", label: "Terang" },
    { value: "dark", label: "Gelap" },
    { value: "system", label: "Ikuti sistem" },
];
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
    {
        success: "Kata sandi diperbarui.",
        validate: () =>
            collect({
                currentPassword: rule.required(passwordForm.currentPassword),
                newPassword: rule.min(passwordForm.newPassword, 8),
            }),
    },
);

const signOut = async () => {
    await auth.logout();
    await navigateTo("/auth/login");
};
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
        <div v-if="tab === 'profile'" class=":uno: grid md:items-start">
            <UiCard class=":uno: flex flex-col gap-5">
                <div
                    class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2"
                >
                    <FormField
                        label="Nama lengkap"
                        :error="profile.fieldErrors.value.fullName"
                        v-slot="{ id }"
                        ><FormInput :id="id" v-model="form.name"
                    /></FormField>
                    <FormField
                        label="Angkatan"
                        :error="profile.fieldErrors.value.year"
                        v-slot="{ id }"
                        ><FormSelect
                            :id="id"
                            v-model="form.cohort"
                            :options="years"
                            disabled
                    /></FormField>
                    <FormField label="NIM " v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            :model-value="auth.user?.nim"
                            icon="lock"
                            locked
                            disabled
                    /></FormField>
                    <FormField
                        label="Nomor WhatsApp"
                        :error="profile.fieldErrors.value.phone"
                        v-slot="{ id }"
                        ><FormInput :id="id" v-model="form.phone" icon="phone"
                    /></FormField>
                </div>
                <FormField
                    label="Keahlian"
                    :error="profile.fieldErrors.value.skills"
                    v-slot="{ id }"
                    ><SkillTags v-model="form.skills" :id="id"
                /></FormField>
                <FormField
                    label="Website / portofolio"
                    :error="profile.fieldErrors.value.personalWebsite"
                    v-slot="{ id }"
                    ><FormInput :id="id" v-model="form.website" icon="external"
                /></FormField>
                <div class=":uno: flex items-center justify-between gap-4">
                    <p class=":uno: t-body-s text-ink-2 m-0">
                        {{
                            dirty
                                ? "Perubahan belum disimpan."
                                : "Semua perubahan tersimpan."
                        }}
                    </p>
                    <UiButton
                        size="sm"
                        :loading="profile.pending.value"
                        :disabled="!dirty"
                        @click="profile.run()"
                        >Simpan perubahan</UiButton
                    >
                </div>
            </UiCard>
        </div>
        <div
            v-else
            class=":uno: grid grid-cols-[minmax(0,1fr)] gap-6 md:items-start"
        >
            <UiCard
                v-if="!auth.user.firebaseStatus"
                class=":uno: flex flex-col gap-5"
            >
                <p class=":uno: t-label text-ink m-0">Ganti kata sandi</p>
                <div
                    class=":uno: grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2"
                >
                    <FormField
                        label="Kata sandi saat ini"
                        :error="password.fieldErrors.value.currentPassword"
                        v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            v-model="passwordForm.currentPassword"
                            type="password"
                            icon="lock"
                    /></FormField>
                    <FormField
                        label="Kata sandi baru"
                        hint="Minimal 8 karakter dengan huruf dan angka."
                        :error="password.fieldErrors.value.newPassword"
                        v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            v-model="passwordForm.newPassword"
                            type="password"
                            icon="lock"
                    /></FormField>
                </div>
                <div class=":uno: flex justify-end">
                    <UiButton
                        size="sm"
                        :loading="password.pending.value"
                        @click="password.run()"
                        >Perbarui kata sandi</UiButton
                    >
                </div>
            </UiCard>
            <UiCard class=":uno: flex flex-col gap-5">
                <FormField label="Email" v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        :model-value="auth.user?.email"
                        icon="mail"
                        disabled
                        locked
                /></FormField>
                <UiDivider />
                <div class=":uno: flex items-center justify-between gap-4">
                    <div>
                        <p class=":uno: t-label text-ink m-0">Tampilan</p>
                        <p class=":uno: t-body-s text-ink-2 m-0">
                            Pilih terang, gelap, atau ikuti pengaturan
                            perangkatmu.
                        </p>
                    </div>
                    <FormChoice
                        :model-value="ui.mode"
                        :options="themeOptions"
                        @update:model-value="ui.setMode($event)"
                    />
                </div>
                <UiDivider />
                <div class=":uno: flex items-center justify-between gap-4">
                    <div>
                        <p class=":uno: t-label text-ink m-0">Keluar</p>
                        <p class=":uno: t-body-s text-ink-2 m-0">
                            Klik tombol di bawah untuk keluar dari akun Anda.
                        </p>
                    </div>
                    <UiButton
                        size="sm"
                        variant="danger"
                        icon="logout"
                        @click="signOut"
                    ></UiButton>
                </div>
            </UiCard>
        </div>
    </AutoSkeleton>
</template>
