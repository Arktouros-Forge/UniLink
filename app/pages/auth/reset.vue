<script setup>
import { reset as copy } from "@app/constants/auth.json";

definePageMeta({ layout: "auth" });
const form = reactive({ password: "", confirm: "" });
const show = ref(false);
const submit = () => navigateTo("/auth/login");
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <UiChip tone="green" icon="i-keyline-icons-circle-check" class="self-start">{{ copy.chip }}</UiChip>
      <h1 class="type-h1">{{ copy.title }}</h1>
      <p class="type-body">{{ copy.text }}</p>
    </div>
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <FormField :label="copy.password" :hint="copy.strength"><input v-model="form.password" :type="show ? 'text' : 'password'" class="field" /></FormField>
      <label class="flex items-center gap-2 type-small"><input v-model="show" type="checkbox" class="accent-[var(--blue)]" />{{ copy.showPassword }}</label>
      <FormField :label="copy.confirm"><input v-model="form.confirm" :type="show ? 'text' : 'password'" class="field" /></FormField>
      <button type="submit" class="btn-primary btn-lg">{{ copy.submit }}</button>
    </form>
    <p class="type-small">{{ copy.note }}</p>
    <NuxtLink to="/auth/login" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />{{ copy.back }}</NuxtLink>
  </div>
</template>
