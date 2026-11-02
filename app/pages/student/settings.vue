<script setup>
import { profile as profileSchema, contact as contactSchema } from "@app/constants/forms.json";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";
import { themeLabels } from "@app/constants/site.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const auth = useAuthStore();
const ui = useUiStore();
const { pending } = useMock("settings", { user: auth.user }, 500);
const picked = ref([...auth.user.skills]);
const saved = ref(false);
const save = (values) => {
  auth.updateProfile({ ...values, skills: picked.value });
  saved.value = true;
  setTimeout(() => (saved.value = false), 2500);
};
const logout = () => {
  auth.logout();
  navigateTo("/auth/login");
};
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[720px]">
    <UiPageHead title="Pengaturan" text="Profil, keahlian, kontak, dan tampilan." meta="Akun" />
    <div v-if="saved" class="card border-good flex gap-3"><span class="i-keyline-icons-circle-check text-2xl text-good" /><p class="type-label">Perubahan disimpan.</p></div>
    <AutoSkeleton :loading="pending" id="settings-forms">
      <section class="card flex flex-col gap-4">
        <h2 class="type-h3">Profil</h2>
        <FieldsForm :schema="[...profileSchema, ...contactSchema]" :initial="auth.user" submit-label="Simpan profil" @submit="save" />
      </section>
      <section class="card flex flex-col gap-4 mt-4">
        <h2 class="type-h3">Keahlian</h2>
        <SkillPicker v-model="picked" />
      </section>
    </AutoSkeleton>
    <section class="card flex items-center justify-between gap-4">
      <h2 class="type-h3">{{ ui.theme === "dark" ? themeLabels.dark : themeLabels.light }}</h2>
      <UiThemeToggle />
    </section>
    <button class="btn-secondary self-start !text-brand-red" @click="logout"><span class="i-keyline-icons-log-out" />Keluar</button>
  </div>
</template>
