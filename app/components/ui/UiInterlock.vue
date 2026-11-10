<script setup>
defineProps({ size: { type: Number, default: 24 } });
</script>

<template>
  <span class=":uno: relative inline-block shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
    <span class=":uno: absolute bg-blue border-2 border-outline" :style="{ left: '37.5%', top: '37.5%', width: '58.33%', height: '58.33%' }" />
    <span class=":uno: absolute bg-card" :style="{ left: '29%', top: '29%', width: '41.6%', height: '8%' }" />
    <span class=":uno: absolute bg-card" :style="{ left: '29%', top: '29%', width: '8%', height: '41.6%' }" />
    <span class=":uno: absolute bg-red border-2 border-outline" :style="{ left: '4%', top: '4%', width: '58.33%', height: '58.33%' }" />
  </span>
</template>
