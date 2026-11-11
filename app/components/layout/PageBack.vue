<script setup>
defineProps({ to: { type: String, required: true } });
</script>

<template>
  <UiButton :to="to" variant="link" icon="arrowLeft" class=":uno: self-start"><slot /></UiButton>
</template>
