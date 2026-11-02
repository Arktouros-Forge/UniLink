<script setup>
import { steps, guide } from "@app/constants/landing.json";
</script>

<template>
  <div class="wrap py-12 md:py-20 flex flex-col gap-10">
    <div class="flex flex-col gap-3 max-w-[640px]">
      <p class="type-meta">{{ guide.meta }}</p>
      <h1 class="type-h1">{{ guide.title }}</h1>
      <p class="type-lead">{{ guide.text }}</p>
    </div>
    <ol class="grid gap-4 md:grid-cols-2">
      <li v-for="(step, index) in steps" :key="step.title" class="card !p-6 flex gap-5">
        <span class="type-numeral !text-[48px]">{{ index + 1 }}</span>
        <div class="flex flex-col gap-2">
          <p class="type-meta">{{ guide.stepMeta[index] }}</p>
          <h2 class="type-h3">{{ step.title }}</h2>
          <p class="type-body">{{ step.text }}</p>
        </div>
      </li>
    </ol>
    <div class="card !p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-brand-blue">
      <div class="flex flex-col gap-1.5">
        <h2 class="type-h3">{{ guide.consentTitle }}</h2>
        <p class="type-body">{{ guide.consentText }}</p>
      </div>
      <NuxtLink to="/auth/register" class="btn-primary btn-lg">{{ guide.consentButton }}</NuxtLink>
    </div>
  </div>
</template>
