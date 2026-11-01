<script setup>
const emit = defineEmits(["submit"]);
const form = reactive({ username: "", email: "", password: "", confirm: "" });
const error = computed(() => (form.confirm && form.confirm !== form.password ? "Kata sandi tidak sama." : ""));
</script>

<template>
  <form class="grid gap-4" @submit.prevent="!error && emit('submit', form)">
    <AppInput v-model="form.username" label="Nama pengguna" autocomplete="username" required />
    <AppInput v-model="form.email" label="Email kampus" type="email" autocomplete="email" required />
    <AppInput v-model="form.password" label="Kata sandi" type="password" autocomplete="new-password" required />
    <AppInput v-model="form.confirm" label="Ulangi kata sandi" type="password" autocomplete="new-password" :error="error" required />
    <AppButton type="submit" block>Buat akun</AppButton>
  </form>
</template>
