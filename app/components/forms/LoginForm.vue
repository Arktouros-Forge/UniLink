<script setup>
const emit = defineEmits(["submit"]);
const form = reactive({ email: "", password: "" });
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('submit', form)">
    <AppInput v-model="form.email" label="Email kampus" type="email" autocomplete="email" required />
    <AppInput v-model="form.password" label="Kata sandi" type="password" autocomplete="current-password" required />
    <NuxtLink to="/auth/forgot-password" class="type-small text-brand-blue">Lupa kata sandi?</NuxtLink>
    <AppButton type="submit" block>Masuk</AppButton>
  </form>
</template>
