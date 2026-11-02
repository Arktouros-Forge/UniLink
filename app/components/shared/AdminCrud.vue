<script setup>
import { statusTone } from "@app/constants/options.json";

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  schema: { type: Array, default: () => [] },
  addLabel: { type: String, default: "Tambah" },
  loading: { type: Boolean, default: false },
  id: { type: String, required: true },
});

const emit = defineEmits(["save", "remove"]);
const query = ref("");
const editing = ref(null);
const modalOpen = ref(false);

const filtered = computed(() =>
  props.rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.value.toLowerCase())),
);

const openNew = () => {
  editing.value = null;
  modalOpen.value = true;
};
const openEdit = (row) => {
  editing.value = row;
  modalOpen.value = true;
};
const save = (values) => {
  emit("save", { ...editing.value, ...values });
  modalOpen.value = false;
};
const cell = (row, column) => (Array.isArray(row[column.key]) ? row[column.key].join(", ") : row[column.key]);
</script>

<template>
  <UiPageHead :title="title" :text="text">
    <button v-if="schema.length" class="btn-primary" @click="openNew"><span class="i-keyline-icons-plus" />{{ addLabel }}</button>
  </UiPageHead>
  <div class="relative max-w-[360px] mb-4">
    <span class="i-keyline-icons-search absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
    <input v-model="query" class="field pl-10 !h-11" placeholder="Cari" />
  </div>
  <AutoSkeleton :loading="loading" :id="id">
    <div class="card !p-0 overflow-x-auto">
      <table class="w-full text-left min-w-[560px]">
        <thead>
          <tr class="border-b border-edge">
            <th v-for="column in columns" :key="column.key" class="type-meta px-5 py-3 font-medium">{{ column.label }}</th>
            <th class="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filtered" :key="row.id" class="border-b border-edge last:border-0">
            <td v-for="column in columns" :key="column.key" class="px-5 py-3.5 type-small !text-ink">
              <UiChip v-if="column.chip" :tone="statusTone[row[column.key]]?.tone">{{ statusTone[row[column.key]]?.label }}</UiChip>
              <template v-else>{{ cell(row, column) }}</template>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex justify-end gap-1">
                <button v-if="schema.length" class="size-9 inline-flex items-center justify-center bg-transparent border-0 text-ink cursor-pointer rounded-lg hover:bg-soft" @click="openEdit(row)"><span class="i-keyline-icons-pen text-lg" /></button>
                <button class="size-9 inline-flex items-center justify-center bg-transparent border-0 text-brand-red cursor-pointer rounded-lg hover:bg-soft" @click="emit('remove', row)"><span class="i-keyline-icons-bin text-lg" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <UiEmpty v-if="!filtered.length" title="Tidak ada data" text="Coba kata kunci lain." class="!border-0" />
    </div>
  </AutoSkeleton>
  <UiModal :open="modalOpen" :title="editing ? 'Ubah data' : addLabel" @close="modalOpen = false">
    <FieldsForm :schema="schema" :initial="editing || {}" cancel-label="Batal" @submit="save" @cancel="modalOpen = false" />
  </UiModal>
</template>
