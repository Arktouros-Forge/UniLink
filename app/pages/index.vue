<script setup>
import landing from "@app/constants/landing.json";
import { event } from "@app/constants/site.json";
</script>

<template>
  <div>
    <section class="page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
      <div class="grid gap-5">
        <AppChip tone="yellow">{{ event }}</AppChip>
        <h1 class="type-display">{{ landing.hero.title }}</h1>
        <p class="type-body text-mute">{{ landing.hero.text }}</p>
        <div class="flex flex-wrap gap-3">
          <AppButton to="/auth/register">{{ landing.hero.primary }}</AppButton>
          <AppButton to="/how-it-works" variant="secondary">{{ landing.hero.secondary }}</AppButton>
        </div>
        <p class="type-small text-mute">{{ landing.hero.note }}</p>
      </div>
      <div class="grid justify-items-center"><InterlockArt /></div>
    </section>

    <section class="page py-10">
      <h2 class="type-h1 mb-6">{{ landing.featuresTitle }}</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <AppCard v-for="feature in landing.features" :key="feature.title" class="grid gap-2">
          <span class="text-2xl text-brand-blue" :class="feature.icon" />
          <h3 class="type-h3">{{ feature.title }}</h3>
          <p class="type-body text-mute">{{ feature.text }}</p>
        </AppCard>
      </div>
    </section>

    <section class="page grid gap-4 py-10 md:grid-cols-3">
      <div v-for="fact in landing.facts" :key="fact.value" class="border-t border-ink pt-3">
        <p class="type-numeral">{{ fact.value }}</p>
        <p class="type-small text-mute">{{ fact.label }}</p>
      </div>
    </section>

    <section class="page py-10">
      <AppCard strong class="grid gap-3 p-8 text-center">
        <h2 class="type-h1">{{ landing.cta.title }}</h2>
        <p class="type-body text-mute">{{ landing.cta.text }}</p>
        <div><AppButton to="/auth/register">{{ landing.cta.button }}</AppButton></div>
      </AppCard>
    </section>
  </div>
</template>
