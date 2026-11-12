<script setup>
import { icons } from "@app/constants/icons";

defineProps({
    name: { type: String, required: true },
    size: { type: String, default: ":uno: text-xl" },
});
</script>

<template>
    <span :class="[icons[name], size]" aria-hidden="true" />
</template>
