<script setup>
import { skillOptions } from "@app/constants/mock/people.json";

defineProps({ placeholder: { type: String, default: "Cari keahlian untuk ditambahkan..." } });
const model = defineModel({ type: Array, default: () => [] });
const query = ref("");
const suggestions = computed(() =>
  query.value ? skillOptions.filter((item) => item.toLowerCase().includes(query.value.toLowerCase()) && !model.value.includes(item)) : [],
);
const add = (item) => {
  model.value = [...model.value, item];
  query.value = "";
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="relative">
      <FormInput v-model="query" icon="search" :placeholder="placeholder" />
      <ul v-if="suggestions.length" class="absolute z-10 inset-x-0 top-12 m-0 p-1 list-none bg-elevated border border-hairline rounded-md shadow-popover">
        <li v-for="item in suggestions" :key="item">
          <button type="button" class="w-full text-left h-9 px-3 bg-transparent border-0 rounded-sm cursor-pointer t-body-s text-ink hover:bg-hairline" @click="add(item)">{{ item }}</button>
        </li>
      </ul>
    </div>
    <div class="flex flex-wrap gap-2">
      <UiChip v-for="item in model" :key="item" removable @remove="model = model.filter((entry) => entry !== item)">{{ item }}</UiChip>
    </div>
  </div>
</template>
