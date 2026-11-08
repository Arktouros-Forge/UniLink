<script setup>
const model = defineModel({ type: Array, default: () => [] });
const { data: options } = await useSkillOptions();
const toggle = (id) => {
  model.value = model.value.includes(id) ? model.value.filter((entry) => entry !== id) : [...model.value, id];
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="item in options" :key="item.id" type="button" class="bg-transparent border-0 p-0 cursor-pointer" @click="toggle(item.id)">
      <UiChip size="md" :outline="model.includes(item.id)" :icon="model.includes(item.id) ? 'check' : ''">{{ item.name }}</UiChip>
    </button>
  </div>
</template>
