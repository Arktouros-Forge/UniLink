<script setup>
import { years, priorities, days } from "@app/constants/options.json";
import { results } from "@app/constants/forms.json";
import { skills, lecturers, categories } from "@app/constants/mock/people.json";

const props = defineProps({
  schema: { type: Array, required: true },
  initial: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: "Simpan" },
  cancelLabel: { type: String, default: "" },
});
const emit = defineEmits(["submit", "cancel"]);

const values = reactive({ ...props.initial });
const errors = reactive({});

const optionsFor = {
  year: years.map((year) => ({ value: year, label: String(year) })),
  priority: priorities,
  day: days.map((day, index) => ({ value: index, label: day })),
  skill: skills.map((item) => ({ value: item.name, label: item.name })),
  lecturer: lecturers.map((item) => ({ value: item.name, label: item.name })),
  result: results,
};

const inputType = (type) => (["text", "email", "tel", "url", "date", "time"].includes(type) ? type : "text");

const submit = () => {
  let valid = true;
  props.schema.forEach((field) => {
    const empty = values[field.name] === undefined || values[field.name] === "" || values[field.name] === null;
    errors[field.name] = field.required && empty ? "Wajib diisi." : "";
    if (errors[field.name]) valid = false;
  });
  if (valid) emit("submit", { ...values });
};
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
    <FormField v-for="field in schema" :key="field.name" :label="field.label" :error="errors[field.name]">
      <textarea v-if="field.type === 'textarea'" v-model="values[field.name]" class="field !h-28 py-3 resize-none" :placeholder="field.placeholder" />
      <select v-else-if="optionsFor[field.type]" v-model="values[field.name]" class="field">
        <option value="" disabled>Pilih</option>
        <option v-for="option in optionsFor[field.type]" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div v-else-if="field.type === 'category'" class="flex flex-wrap gap-2">
        <label v-for="item in categories" :key="item.id" class="chip cursor-pointer bg-card border-edge">
          <input v-model="values[field.name]" type="checkbox" :value="item.name" class="accent-[var(--blue)]" />
          {{ item.name }}
        </label>
      </div>
      <input v-else v-model="values[field.name]" class="field" :type="inputType(field.type)" :placeholder="field.placeholder" />
    </FormField>
    <div class="flex gap-3 justify-end pt-2">
      <button v-if="cancelLabel" type="button" class="btn-secondary" @click="emit('cancel')">{{ cancelLabel }}</button>
      <button type="submit" class="btn-primary">{{ submitLabel }}</button>
    </div>
  </form>
</template>
