<script setup>
defineProps({
    id: { type: String, default: undefined },
    placeholder: { type: String, default: "" },
    rows: { type: Number, default: 4 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
});
const model = defineModel({ type: String, default: "" });
</script>

<template>
    <div class=":uno: relative">
        <textarea
            :id="id"
            v-model="model"
            :rows="rows"
            :maxlength="max || undefined"
            :placeholder="placeholder"
            :class="(min || max) && ':uno: pb-7'"
            class=":uno: w-full rounded-md border border-hairline bg-card text-ink t-body-s p-3 outline-none resize-none focus:border-blue focus:shadow-[0_0_0_2px_var(--canvas-paper),0_0_0_4px_var(--brand-blue)]"
        />
        <span
            v-if="min || max"
            class=":uno: absolute right-3 bottom-2 t-mono-s pointer-events-none"
            :class="
                model.length >= min ? ':uno: text-success' : ':uno: text-ink-3'
            "
            >{{ model.length }}{{ max ? `/${max}` : ""
            }}{{ min && model.length < min ? ` · min ${min}` : "" }}</span
        >
    </div>
</template>
