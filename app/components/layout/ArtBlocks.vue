<script setup>
defineProps({ variant: { type: String, default: "hero" } });
</script>

<template>
  <div v-if="variant === 'hero'" class=":uno: relative w-full max-w-[520px] aspect-[520/400]">
    <span class=":uno: absolute -top-[6%] left-[2%] font-serif text-[160px] leading-none text-hairline select-none md:text-[200px]">01</span>
    <span class=":uno: absolute right-[10%] top-[8%] w-[34.6%] h-[50%] bg-red border-2 border-outline" />
    <span class=":uno: absolute right-[0%] top-[53%] w-[38.5%] h-[30%] bg-yellow border-2 border-outline" />
    <span class=":uno: absolute left-[0%] top-[27%] w-[50%] h-[50%] bg-blue border-2 border-outline" />
  </div>
  <div v-else class=":uno: relative w-full max-w-[400px] aspect-[400/250]">
    <span class=":uno: absolute left-[10%] top-0 w-[41.5%] h-[66%] bg-red border-2 border-outline" />
    <span class=":uno: absolute right-0 top-0 w-[19%] h-[35%] bg-yellow border-2 border-outline" />
    <span class=":uno: absolute left-0 right-0 top-[80%] border-t-2 border-outline" />
    <span class=":uno: absolute left-[36%] top-[42%] w-[41.5%] h-[58%] bg-blue border-2 border-outline" />
  </div>
</template>
