<script setup>
import { hero, featuresTitle, features, facts, stepsTitle, steps, cta } from "@app/constants/landing.json";
</script>

<template>
  <div>
    <section class="wrap py-12 md:py-24 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
      <div class="flex flex-col gap-6">
        <h1 class="type-display">{{ hero.title }}</h1>
        <p class="type-lead max-w-[560px]">{{ hero.text }}</p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <NuxtLink to="/auth/register" class="btn-primary btn-lg">{{ hero.primary }}</NuxtLink>
          <NuxtLink to="/how-it-works" class="btn-secondary btn-lg">{{ hero.secondary }}</NuxtLink>
        </div>
        <p class="type-small">{{ hero.note }}</p>
      </div>
      <div class="flex flex-col items-center gap-3"><InterlockArt /><p class="type-meta">{{ hero.art.numeral }} · {{ hero.art.caption }}</p></div>
    </section>

    <section class="border-y border-rule bg-card">
      <div class="wrap py-6 grid gap-4 md:grid-cols-3">
        <div v-for="fact in facts" :key="fact.label" class="flex items-baseline gap-3">
          <span class="font-display font-bold text-2xl text-brand-blue">{{ fact.value }}</span>
          <span class="type-small">{{ fact.label }}</span>
        </div>
      </div>
    </section>

    <section class="wrap py-12 md:py-20 flex flex-col gap-8">
      <h2 class="type-h2">{{ featuresTitle }}</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="(feature, index) in features" :key="feature.title" class="card !p-6 flex flex-col gap-3 relative overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-1.5" :class="['bg-brand-blue', 'bg-brand-red', 'bg-brand-yellow'][index]" />
          <h3 class="type-h3 mt-2">{{ feature.title }}</h3>
          <p class="type-body">{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="wrap pb-12 md:pb-20 flex flex-col gap-8">
      <h2 class="type-h2">{{ stepsTitle }}</h2>
      <div class="grid gap-4 md:grid-cols-4">
        <article v-for="(step, index) in steps" :key="step.title" class="flex flex-col gap-3">
          <span class="type-numeral">{{ index + 1 }}</span>
          <h3 class="type-h3">{{ step.title }}</h3>
          <p class="type-small">{{ step.text }}</p>
        </article>
      </div>
    </section>

    <section class="bg-brand-blue text-onbrand">
      <div class="wrap py-14 md:py-20 flex flex-col gap-5 md:items-center md:text-center">
        <h2 class="font-display font-bold text-[28px] leading-9 md:text-[40px] md:leading-[52px] tracking-[-0.02em]">{{ cta.title }}</h2>
        <p class="text-lg opacity-90">{{ cta.text }}</p>
        <NuxtLink to="/auth/register" class="btn btn-lg bg-brand-yellow text-[#16151a] self-start md:self-center">{{ cta.button }}</NuxtLink>
      </div>
    </section>
  </div>
</template>
