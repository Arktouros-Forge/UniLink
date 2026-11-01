<script setup>
definePageMeta({ layout: "auth" });
</script>

<template>
  <div class="grid gap-6">
    <header class="grid gap-1">
      <h1 class="type-h1">Buat akun</h1>
      <p class="type-body text-mute">Gunakan email kampusmu.</p>
    </header>
    <RegisterForm @submit="navigateTo('/auth/verify-email')" />
    <p class="type-small text-mute">Sudah punya akun? <NuxtLink to="/auth/login" class="font-medium text-brand-blue">Masuk</NuxtLink></p>
  </div>
</template>
