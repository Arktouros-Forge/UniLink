<script setup>
defineOptions({
    inheritAttrs: false,
});

defineProps({
    as: { type: String, default: "section" },
    padding: { type: String, default: "p-6" },
    hover: { type: Boolean, default: false },
    tint: { type: String, default: "" },
});
</script>

<template>
    <component
        :is="as"
        v-bind="$attrs"
        class=":uno: surface"
        :class="[
            padding,
            hover && ':uno: transition-shadow hover:shadow-hover',
            tint,
        ]"
    >
        <slot />
    </component>
</template>
