<script setup>
defineProps({
    title: { type: String, required: true },
    text: { type: String, default: "" },
    icon: { type: String, default: "inbox" },
});
</script>

<template>
    <div class=":uno: flex flex-col items-center text-center gap-3 px-6 py-12">
        <span
            class=":uno: size-12 inline-flex items-center justify-center rounded-md bg-hairline text-ink-2"
            ><UiIcon :name="icon" size="text-2xl"
        /></span>
        <h3 class=":uno: t-d4 text-ink m-0">{{ title }}</h3>
        <p v-if="text" class=":uno: t-body-s text-ink-2 max-w-[360px] m-0">
            {{ text }}
        </p>
        <div class=":uno: flex gap-3 pt-1"><slot /></div>
    </div>
</template>
