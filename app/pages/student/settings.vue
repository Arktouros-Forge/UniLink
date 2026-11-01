<script setup>
import { useAuthStore } from "@app/stores/auth";
import { useUsersStore } from "@app/stores/users";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const auth = useAuthStore();
const users = useUsersStore();
const ui = useUiStore();
const tab = ref("profile");
const tabs = [
  { value: "profile", label: "Profil" },
  { value: "account", label: "Akun" },
];
const themes = [
  { value: "", label: "Ikuti perangkat" },
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
];

const save = (data) => {
  users.update(auth.currentId, data);
  ui.notify("Profil diperbarui", "good");
};

const signOut = async () => {
  auth.logout();
  await navigateTo("/auth/login");
};
</script>

<template>
  <div class="max-w-2xl">
    <PageHeading title="Pengaturan" />
    <AppTabs v-model="tab" :items="tabs" class="mb-6" />
    <ProfileForm v-if="tab === 'profile'" :initial="auth.user" @save="save" />
    <div v-else class="grid gap-6">
      <AppInput :model-value="auth.user.email" label="Email" disabled />
      <AppInput :model-value="ui.theme" label="Tema" as="select" :options="themes" @update:model-value="ui.setTheme" />
      <AppButton variant="danger" class="w-fit" @click="signOut">Keluar</AppButton>
    </div>
  </div>
</template>
