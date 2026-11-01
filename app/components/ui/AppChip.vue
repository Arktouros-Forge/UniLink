<script setup>
defineProps({
  tone: { type: String, default: "neutral" },
});

const tones = {
  neutral: "bg-soft text-ink",
  brand: "bg-brand-blue text-onbrand",
  red: "bg-brand-red text-onbrand",
  yellow: "bg-brand-yellow text-black",
  good: "bg-good text-onbrand",
  outline: "border border-edge text-mute",
};
</script>

<template>
  <span class="chip" :class="tones[tone] ?? tones.neutral"><slot /></span>
</template>
