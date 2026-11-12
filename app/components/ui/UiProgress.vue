<script setup>
const props = defineProps({
    value: { type: Number, required: true },
    max: { type: Number, required: true },
    tone: { type: String, default: "blue" },
    label: { type: String, default: "" },
    showValue: { type: Boolean, default: true },
});

const percent = computed(() =>
    props.max ? Math.min(100, Math.round((props.value / props.max) * 100)) : 0,
);
const tones = {
    blue: ":uno: bg-blue",
    success: ":uno: bg-success",
    warning: ":uno: bg-warning",
    danger: ":uno: bg-danger",
    yellow: ":uno: bg-yellow",
};
</script>

<template>
    <div class=":uno: flex flex-col gap-1.5">
        <div
            v-if="label || showValue"
            class=":uno: flex justify-between t-mono-s text-ink-2"
        >
            <span>{{ label }}</span>
            <span v-if="showValue">{{ value }}/{{ max }}</span>
        </div>
        <div
            class=":uno: h-2 rounded-sm bg-hairline overflow-hidden"
            role="progressbar"
            :aria-valuenow="value"
            :aria-valuemin="0"
            :aria-valuemax="max"
        >
            <div
                class=":uno: h-full transition-all"
                :class="tones[tone]"
                :style="{ width: `${percent}%` }"
            />
        </div>
    </div>
</template>
