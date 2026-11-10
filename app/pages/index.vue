<script setup>
import {
    hero,
    sections,
    stepsTitle,
    steps,
    cta,
} from "@app/constants/landing.json";
import { university } from "@app/constants/site.json";

const toneBlock = { blue: "bg-blue", red: "bg-red", yellow: "bg-yellow" };

usePageSeo("home");
useSchemaOrg([
    defineWebSite({ name: "UniLink", inLanguage: "id-ID" }),
    defineWebPage({ name: "UniLink", about: "Platform kolaborasi mahasiswa Universitas Udayana" }),
]);
</script>

<template>
    <div>
        <section
            class="container-wide py-10 md:py-16 lg:py-20 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:items-center"
        >
            <div class="flex flex-col gap-6">
                <UiChip tone="neutral" size="md" class="self-start">{{
                    hero.tag
                }}</UiChip>
                <h1 class="t-d1 text-ink m-0 lg:max-w-[640px]">
                    {{ hero.title }}
                </h1>
                <p class="t-body-l text-ink m-0 max-w-[60ch]">
                    {{ hero.text }}
                </p>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <UiButton
                        to="/auth/register"
                        size="lg"
                        icon-end="arrowRight"
                        >{{ hero.primary }}</UiButton
                    >
                    <UiButton
                        to="/how-it-works"
                        variant="secondary"
                        size="lg"
                        icon="book"
                        >{{ hero.secondary }}</UiButton
                    >
                </div>
                <p class="t-body-s text-ink-2 m-0">{{ hero.note }}</p>
            </div>
            <div class="flex flex-col gap-4">
                <ArtBlocks variant="hero" />
                <p class="t-mono-s text-ink m-0">{{ hero.caption }}</p>
            </div>
        </section>

        <section class="bg-card border-y border-hairline">
            <div
                class="container-wide py-14 md:py-20 lg:py-24 flex flex-col gap-14 md:gap-16 lg:gap-24"
            >
                <article
                    v-for="(section, index) in sections"
                    :key="section.numeral"
                    class="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[240px_1fr_280px] lg:gap-12 lg:items-start"
                    :class="index % 2 && 'lg:[&>:last-child]:order-first'"
                >
                    <div class="flex items-end gap-4 lg:gap-6">
                        <span class="t-serif-step text-ink shrink-0 whitespace-nowrap">{{
                            section.numeral
                        }}</span>
                        <h2 class="t-d3 text-ink m-0 pb-2 lg:hidden">
                            {{ section.title }}
                        </h2>
                    </div>
                    <div class="flex flex-col gap-4">
                        <h2
                            class="t-d3 text-ink m-0 hidden lg:block"
                        >
                            {{ section.title }}
                        </h2>
                        <p class="t-body-l text-ink-2 m-0">
                            {{ section.text }}
                        </p>
                        <ul class="m-0 p-0 list-none flex flex-col gap-2">
                            <li
                                v-for="point in section.points"
                                :key="point"
                                class="flex gap-3 t-body-m text-ink"
                            >
                                <UiIcon name="check" class="text-blue mt-1" />{{
                                    point
                                }}
                            </li>
                        </ul>
                    </div>
                    <div
                        class="relative h-32 md:h-40 lg:h-[200px] border-2 border-outline"
                        :class="toneBlock[section.tone]"
                    >
                        <span
                            class="absolute right-[12%] bottom-[-16px] size-16 bg-card border-2 border-outline"
                        />
                    </div>
                </article>
            </div>
        </section>

        <section
            class="container-wide py-16 md:py-20 lg:py-24 flex flex-col gap-10"
        >
            <h2 class="t-d2 text-ink m-0">{{ stepsTitle }}</h2>
            <ol class="grid gap-6 m-0 p-0 list-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                <li
                    v-for="(step, index) in steps"
                    :key="step.title"
                    class="flex flex-col gap-3 border-t-2 border-outline pt-4"
                >
                    <span class="t-serif-small text-ink">{{
                        String(index + 1).padStart(2, "0")
                    }}</span>
                    <h3 class="t-d4 text-ink m-0">{{ step.title }}</h3>
                    <p class="t-body-s text-ink-2 m-0">{{ step.text }}</p>
                    <p class="t-mono-s text-ink m-0">{{ step.meta }}</p>
                </li>
            </ol>
        </section>
    </div>
</template>
