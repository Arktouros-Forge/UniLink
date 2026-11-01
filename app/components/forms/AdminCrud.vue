<script setup>
import { useUiStore } from "@app/stores/ui";

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  fields: { type: Array, required: true },
});

const emit = defineEmits(["add", "update", "remove"]);

const ui = useUiStore();
const modal = ref(false);
const editing = ref(null);
const form = reactive({});

const open = (row = null) => {
  editing.value = row;
  for (const field of props.fields) form[field.key] = row?.[field.key] ?? "";
  modal.value = true;
};

const save = () => {
  emit(editing.value ? "update" : "add", editing.value ? editing.value.id : { ...form }, { ...form });
  modal.value = false;
  ui.notify("Data disimpan", "good");
};
</script>

<template>
  <div>
    <PageHeading :title="title" :text="text">
      <AppButton @click="open()"><span class="i-keyline-plus" />Tambah</AppButton>
    </PageHeading>
    <AppTable :columns="[...columns, { key: 'actions', label: '' }]" :rows="rows">
      <template v-for="column in columns" :key="column.key" #[column.key]="{ row }">
        <slot :name="column.key" :row="row">{{ row[column.key] }}</slot>
      </template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Ubah" @click="open(row)"><span class="i-keyline-pen" /></button>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Hapus" @click="emit('remove', row.id)"><span class="i-keyline-bin" /></button>
        </div>
      </template>
    </AppTable>
    <AppModal v-model="modal" :title="editing ? 'Ubah data' : 'Tambah data'">
      <form class="grid gap-4" @submit.prevent="save">
        <AppInput v-for="field in fields" :key="field.key" v-model="form[field.key]" :label="field.label" :type="field.type" :as="field.as" :required="field.required" />
        <AppButton type="submit" block>Simpan</AppButton>
      </form>
    </AppModal>
  </div>
</template>
