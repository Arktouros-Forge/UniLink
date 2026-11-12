<script setup>
import { initialsOf } from "@app/utils/format";

defineProps({
    name: { type: String, required: true },
    size: { type: Number, default: 40 },
    tone: { type: String, default: "blue" },
});
</script>

<template>
    <span
        class=":uno: inline-flex items-center justify-center shrink-0 rounded-full font-sans font-semibold"
        :class="
            tone === 'neutral'
                ? ':uno: bg-hairline text-blue'
                : ':uno: bg-blue-soft text-blue'
        "
        :style="{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${Math.max(11, Math.round(size * 0.3))}px`,
        }"
        >{{ initialsOf(name) }}</span
    >
</template>
