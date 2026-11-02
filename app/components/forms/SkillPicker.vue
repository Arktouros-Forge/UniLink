<script setup>
import { skills } from "@app/constants/mock/people.json";

const model = defineModel({ type: Array, default: () => [] });

const toggle = (id) => {
  model.value = model.value.includes(id) ? model.value.filter((item) => item !== id) : [...model.value, id];
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="skill in skills"
      :key="skill.id"
      type="button"
      class="chip cursor-pointer"
      :class="model.includes(skill.id) ? 'bg-brand-blue text-onbrand border-brand-blue' : 'bg-card text-ink border-edge'"
      @click="toggle(skill.id)"
    >
      <span v-if="model.includes(skill.id)" class="i-keyline-icons-check" />
      {{ skill.name }}
    </button>
  </div>
</template>
