<script setup>
defineProps({
    label: { type: String, default: "" },
    indeterminate: { type: Boolean, default: false },
});
const model = defineModel({ type: Boolean, default: false });
</script>

<template>
    <label
        class="inline-flex items-center gap-2 cursor-pointer t-body-s text-ink"
    >
        <span
            class="size-5 rounded-sm border inline-flex items-center justify-center shrink-0 transition-colors"
            :class="
                model || indeterminate
                    ? 'bg-blue border-blue text-onblue'
                    : 'bg-card border-ink-3'
            "
        >
            <UiIcon v-if="indeterminate" name="minus" size="text-sm" />
            <UiIcon v-else-if="model" name="check" size="text-sm" />
        </span>
        <input v-model="model" type="checkbox" class="sr-only" />
        <span v-if="label">{{ label }}</span>
    </label>
</template>
