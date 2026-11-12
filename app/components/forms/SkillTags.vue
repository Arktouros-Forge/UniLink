<script setup>
defineProps({ placeholder: { type: String, default: "Cari keahlian untuk ditambahkan..." } });
const model = defineModel({ type: Array, default: () => [] });
const { data: options } = await useSkillOptions();
const query = ref("");
const names = computed(() => Object.fromEntries(options.value.map((item) => [item.id, item.name])));
const suggestions = computed(() =>
  query.value
    ? options.value.filter((item) => item.name.toLowerCase().includes(query.value.toLowerCase()) && !model.value.includes(item.id)).slice(0, 8)
    : [],
);
const add = (id) => {
  model.value = [...model.value, id];
  query.value = "";
};
</script>

<template>
  <div class=":uno: flex flex-col gap-3">
    <div class=":uno: relative">
      <FormInput v-model="query" icon="search" :placeholder="placeholder" />
      <ul v-if="suggestions.length" class=":uno: absolute z-10 inset-x-0 top-12 m-0 p-1 list-none bg-elevated border border-hairline rounded-md shadow-popover">
        <li v-for="item in suggestions" :key="item.id">
          <button type="button" class=":uno: w-full text-left h-9 px-3 bg-transparent border-0 rounded-sm cursor-pointer t-body-s text-ink hover:bg-hairline" @click="add(item.id)">{{ item.name }}</button>
        </li>
      </ul>
    </div>
    <div class=":uno: flex flex-wrap gap-2">
      <UiChip v-for="id in model" :key="id" removable @remove="model = model.filter((entry) => entry !== id)">{{ names[id] ?? id }}</UiChip>
    </div>
  </div>
</template>
