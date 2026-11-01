<script setup>
import { limits } from "@app/constants/options.json";
import { useReferenceStore } from "@app/stores/reference";

const reference = useReferenceStore();
const model = defineModel({ type: Array, default: () => [] });
const query = ref("");

const filtered = computed(() => reference.skills.filter((skill) => skill.name.toLowerCase().includes(query.value.toLowerCase())));

const toggle = (id) => {
  if (model.value.includes(id)) model.value = model.value.filter((item) => item !== id);
  else if (model.value.length < limits.maxSkills) model.value = [...model.value, id];
};
</script>

<template>
  <div class="grid gap-3">
    <input v-model="query" class="field" placeholder="Cari mata kuliah atau keahlian" />
    <div class="flex flex-wrap gap-2">
      <button
        v-for="skill in filtered"
        :key="skill.id"
        type="button"
        class="chip cursor-pointer border"
        :class="model.includes(skill.id) ? 'border-brand-blue bg-brand-blue text-onbrand' : 'border-edge bg-card text-ink'"
        @click="toggle(skill.id)"
      >
        {{ skill.name }}
      </button>
    </div>
    <p class="type-meta text-mute">{{ model.length }} / {{ limits.maxSkills }}</p>
  </div>
</template>
