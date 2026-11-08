<script setup>
import { admin } from "@app/constants/student.json";

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  addLabel: { type: String, default: "" },
  noun: { type: String, required: true },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  total: { type: Number, required: true },
  loading: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
  search: { type: String, default: "" },
  removeLabel: { type: String, default: "Hapus" },
});
const emit = defineEmits(["add", "edit", "remove", "retry", "update:search"]);

const selected = ref([]);
const page = defineModel("page", { type: Number, default: 1 });
const cols = computed(() => [...props.columns, { key: "actions", label: "Tindakan", width: "120px" }]);
</script>

<template>
  <PageHeading :title="title" :text="text">
    <UiButton v-if="addLabel" icon="plus" @click="emit('add')">{{ addLabel }}</UiButton>
  </PageHeading>
  <div class="flex flex-col gap-2">
    <p class="t-label text-ink m-0">Pencarian</p>
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
      <SearchBar :model-value="search" :placeholder="`Cari ${noun}...`" @update:model-value="emit('update:search', $event)" />
      <slot name="filters" />
    </div>
  </div>
  <UiCard v-if="failed" padding="p-0">
    <UiEmpty title="Data gagal dimuat" text="Periksa koneksimu lalu coba lagi." icon="alert"><UiButton variant="secondary" icon="refresh" @click="emit('retry')">Coba lagi</UiButton></UiEmpty>
  </UiCard>
  <AutoSkeleton v-else :loading="loading" :id="id">
    <DataTable v-model:selected="selected" v-model:page="page" selectable :columns="cols" :rows="rows" :total="total" :noun="noun" :page-size="admin.pageSize">
      <template v-for="column in columns" :key="column.key" #[`cell-${column.key}`]="{ row, value }">
        <slot :name="`cell-${column.key}`" :row="row" :value="value">{{ value }}</slot>
      </template>
      <template #cell-actions="{ row }">
        <span class="inline-flex gap-4 t-body-xs">
          <button type="button" class="bg-transparent border-0 p-0 text-blue cursor-pointer" @click="emit('edit', row)">Edit</button>
          <button type="button" class="bg-transparent border-0 p-0 text-danger cursor-pointer" @click="emit('remove', row)">{{ removeLabel }}</button>
        </span>
      </template>
      <template #empty>
        <UiEmpty :title="`Belum ada ${noun}`" text="Tambahkan data pertama atau ubah pencarian." icon="inbox"><UiButton v-if="addLabel" icon="plus" @click="emit('add')">{{ addLabel }}</UiButton></UiEmpty>
      </template>
    </DataTable>
  </AutoSkeleton>
  <slot name="footer" />
</template>
