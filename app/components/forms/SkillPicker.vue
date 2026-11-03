<script setup>
import { skillOptions } from "@app/constants/mock/people.json";

const model = defineModel({ type: Array, default: () => [] });
const toggle = (item) => {
  model.value = model.value.includes(item) ? model.value.filter((entry) => entry !== item) : [...model.value, item];
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="item in skillOptions" :key="item" type="button" class="bg-transparent border-0 p-0 cursor-pointer" @click="toggle(item)">
      <UiChip size="md" :outline="model.includes(item)" :icon="model.includes(item) ? 'check' : ''">{{ item }}</UiChip>
    </button>
  </div>
</template>
