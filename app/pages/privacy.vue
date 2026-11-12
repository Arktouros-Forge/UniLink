<script setup>
import { legal } from "@app/constants/legal.json";

const route = useRoute();
const page = computed(() => legal[route.path.slice(1)] || legal.privacy);

usePageSeo("privacy");
</script>

<template>
    <article
        class=":uno: container-app !max-w-[800px] py-12 md:py-20 flex flex-col gap-6"
    >
        <h1 class=":uno: t-d2 text-ink m-0">{{ page.title }}</h1>
        <p class=":uno: t-body-l text-ink-2 m-0">{{ page.intro }}</p>
        <section
            v-for="item in page.sections"
            :key="item.title"
            class=":uno: flex flex-col gap-2"
        >
            <h2 class=":uno: t-d4 text-ink m-0">{{ item.title }}</h2>
            <p class=":uno: t-body-m text-ink-2 m-0">{{ item.text }}</p>
        </section>
    </article>
</template>
