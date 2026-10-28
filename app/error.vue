<script setup>
const props = defineProps({
    error: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div>
        <h1>{{ error.status }}</h1>
        <NuxtLink to="/">Go back home</NuxtLink>
    </div>
</template>
