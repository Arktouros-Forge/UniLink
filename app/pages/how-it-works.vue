<script setup>
import landing from "@app/constants/landing.json";

const { howItWorks, steps, stepsTitle } = landing;
</script>

<template>
  <div class="page grid gap-8 py-12">
    <header class="grid max-w-2xl gap-3">
      <p class="type-meta text-mute">{{ howItWorks.meta }}</p>
      <h1 class="type-display">{{ howItWorks.title }}</h1>
      <p class="type-body text-mute">{{ howItWorks.text }}</p>
    </header>
    <ol class="grid gap-4 md:grid-cols-2">
      <li v-for="(step, index) in steps" :key="step.title">
        <AppCard class="grid gap-2">
          <span class="type-numeral text-brand-blue">{{ index + 1 }}</span>
          <h2 class="type-h3">{{ step.title }}</h2>
          <p class="type-body text-mute">{{ step.text }}</p>
          <AppChip tone="outline">{{ step.meta }}</AppChip>
        </AppCard>
      </li>
    </ol>
    <AppCard strong class="grid gap-1">
      <h2 class="type-h3">{{ howItWorks.consentTitle }}</h2>
      <p class="type-body text-mute">{{ howItWorks.consentText }}</p>
    </AppCard>
  </div>
</template>
