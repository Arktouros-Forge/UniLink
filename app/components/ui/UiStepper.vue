<script setup>
defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true },
});
</script>

<template>
  <ol class="flex gap-2 m-0 p-0 list-none">
    <li v-for="(step, index) in steps" :key="step.title" class="flex-1 flex flex-col gap-2">
      <span class="h-1 rounded-full" :class="index + 1 <= current ? 'bg-blue' : 'bg-hairline'" />
      <span class="t-mono-s hidden md:block" :class="index + 1 === current ? 'text-ink' : 'text-ink-3'">{{ String(index + 1).padStart(2, "0") }} · {{ step.title }}</span>
    </li>
  </ol>
</template>
