<script setup>
defineProps({
    title: { type: String, default: "" },
    tone: { type: String, default: "neutral" },
});
</script>

<template>
    <aside
        class=":uno: border-l-2 px-4 py-3 flex flex-col gap-1"
        :class="
            {
                info: ':uno: border-blue bg-blue-soft',
                danger: ':uno: border-danger bg-danger-soft',
            }[tone] ?? ':uno: border-blue bg-hairline'
        "
    >
        <p v-if="title" class=":uno: t-label text-ink m-0">{{ title }}</p>
        <div class=":uno: t-body-s text-ink-2"><slot /></div>
    </aside>
</template>
