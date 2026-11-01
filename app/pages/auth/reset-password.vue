<script setup>
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "auth" });

const ui = useUiStore();
const form = reactive({ password: "", confirm: "" });
const error = computed(() => (form.confirm && form.confirm !== form.password ? "Kata sandi tidak sama." : ""));

const submit = async () => {
  if (error.value) return;
  ui.notify("Kata sandi diperbarui", "good");
  await navigateTo("/auth/login");
};
</script>

<template>
  <form class="grid gap-6" @submit.prevent="submit">
    <header class="grid gap-1">
      <h1 class="type-h1">Atur ulang kata sandi</h1>
      <p class="type-body text-mute">Pilih kata sandi baru.</p>
    </header>
    <AppInput v-model="form.password" label="Kata sandi baru" type="password" autocomplete="new-password" required />
    <AppInput v-model="form.confirm" label="Ulangi kata sandi" type="password" autocomplete="new-password" :error="error" required />
    <AppButton type="submit" block>Simpan</AppButton>
  </form>
</template>
