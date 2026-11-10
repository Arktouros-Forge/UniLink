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
            class="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1fr)_256px] md:items-start"
        >
            <UiCard class="flex flex-col gap-5">
                <div class="flex items-center gap-4">
                    <UiAvatar :name="form.name" :size="56" />
                    <div class="flex-1">
                        <p class="t-label text-ink m-0">Foto profil</p>
                        <p class="t-body-xs text-ink-2 m-0">
                            JPG/PNG · Maks. 2 MB · Inisial
                            {{
                                auth.user.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")
                            }}
                            tanpa foto.
                        </p>
                    </div>
                    <UiButton
                        variant="secondary"
                        icon="upload"
                        class="hidden md:inline-flex"
                        >Unggah foto</UiButton
                    >
                </div>
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
                    <FormField label="NIM · tidak tampil publik" v-slot="{ id }"
                        ><FormInput
                            :id="id"
                            :model-value="auth.user.nim"
                            icon="lock"
                            locked
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
                    <UiButton :loading="profile.pending.value" :disabled="!dirty" @click="profile.run()">Simpan perubahan</UiButton>
                </div>
            </UiCard>
            <div class="flex flex-col gap-4">
                <UiCallout title="Profil publik kampus"
                    >Nama, foto, angkatan, keahlian, dan website dapat dilihat
                    mahasiswa Universitas Udayana.</UiCallout
                >
                <UiCard padding="p-5" class="flex flex-col gap-3">
                    <h2 class="t-d4 text-ink m-0">Identitas tetap privat</h2>
                    <p class="t-body-s text-ink-2 m-0">
                        NIM tidak ditampilkan di profil teman belajar. Hubungi
                        administrator untuk koreksi NIM.
                    </p>
                    <p class="t-body-s text-ink-2 m-0">
                        Nomor WhatsApp hanya dibuka setelah permintaan diterima.
                    </p>
                    <UiButton
                        variant="secondary"
                        size="sm"
                        :to="`/student/study-match/helpers/${auth.user.id}`"
                        class="self-start"
                        >Lihat profil saya</UiButton
                    >
                </UiCard>
            </div>
        </div>
        <div v-else class="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1fr)_256px] md:items-start">
            <UiCard class="flex flex-col gap-5">
                <FormField label="Email" v-slot="{ id }"
                    ><FormInput
                        :id="id"
                        :model-value="auth.user.email"
                        icon="mail"
                        locked
                /></FormField>
                <UiDivider />
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="t-label text-ink m-0">Mode gelap</p>
                        <p class="t-body-s text-ink-2 m-0">
                            Ikuti tema perangkat atau pilih sendiri.
                        </p>
                    </div>
                    <UiToggle
                        :model-value="ui.theme === 'dark'"
                        @update:model-value="
                            ui.setTheme($event ? 'dark' : 'light')
                        "
                    />
                </div>
                <UiDivider />
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="t-label text-ink m-0">Ubah kata sandi</p>
                        <p class="t-body-s text-ink-2 m-0">
                            Kami kirim tautan ke emailmu.
                        </p>
                    </div>
                    <UiButton variant="secondary" to="/auth/forgot"
                        >Kirim tautan</UiButton
                    >
                </div>
            </UiCard>
            <UiCallout title="Keluar dari semua perangkat" tone="info"
                >Kamu bisa keluar dari sesi lain kapan saja.</UiCallout
            >
        </div>
    </AutoSkeleton>
</template>
