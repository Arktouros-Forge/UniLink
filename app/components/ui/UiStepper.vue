<script setup>
defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true },
});
</script>

<template>
  <ol class=":uno: flex gap-2 m-0 p-0 list-none">
    <li v-for="(step, index) in steps" :key="step.title" class=":uno: flex-1 flex flex-col gap-2">
      <span class=":uno: h-1 rounded-full" :class="index + 1 <= current ? ':uno: bg-blue' : ':uno: bg-hairline'" />
      <span class=":uno: t-mono-s hidden md:block" :class="index + 1 === current ? ':uno: text-ink' : ':uno: text-ink-3'">{{ String(index + 1).padStart(2, "0") }} · {{ step.title }}</span>
    </li>
  </ol>
</template>
