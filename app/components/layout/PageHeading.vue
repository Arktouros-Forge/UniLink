<script setup>
defineProps({
    title: { type: String, required: true },
    text: { type: String, default: "" },
});
</script>

<template>
    <div
        class=":uno: flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8"
    >
        <div class=":uno: flex flex-col gap-2 min-w-0">
            <h1 class=":uno: t-d2 text-ink m-0">{{ title }}</h1>
            <p v-if="text" class=":uno: t-body-m text-ink-2 m-0">{{ text }}</p>
        </div>
        <div
            v-if="$slots.default"
            class=":uno: flex items-center gap-3 shrink-0 flex-wrap"
        >
            <slot />
        </div>
    </div>
</template>
