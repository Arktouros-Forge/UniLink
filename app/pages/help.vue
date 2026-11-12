<script setup>
import { blocked } from "@app/constants/auth.json";

usePageSeo("help");
</script>

<template>
    <article
        class=":uno: container-app !max-w-[800px] py-12 md:py-20 flex flex-col gap-6"
    >
        <h1 class=":uno: t-d2 text-ink m-0">Bantuan</h1>
        <p class=":uno: t-body-l text-ink-2 m-0">
            Butuh bantuan memakai UniLink? Hubungi admin kampus.
        </p>
        <UiButton
            :href="`mailto:${blocked.adminEmail}`"
            icon="mail"
            class=":uno: self-start"
            >Hubungi admin</UiButton
        >
    </article>
</template>
