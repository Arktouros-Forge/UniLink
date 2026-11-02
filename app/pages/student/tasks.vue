<script setup>
import { tasks } from "@app/constants/mock/planner.json";
import { task as taskSchema } from "@app/constants/forms.json";
import { taskFilters } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const { pending } = useMock("tasks", { tasks });
const items = ref(tasks.map((item) => ({ ...item })));
const filter = ref("all");
const open = ref(false);
const list = computed(() => items.value.filter((item) => filter.value === "all" || (filter.value === "done") === item.done));
const toggle = (item) => (item.done = !item.done);
const remove = (item) => (items.value = items.value.filter((entry) => entry.id !== item.id));
const add = (values) => {
  items.value = [{ id: Date.now(), done: false, ...values }, ...items.value];
  open.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Tugas" text="Pantau tenggat dan prioritasmu." meta="Perencana">
      <button class="btn-primary" @click="open = true"><span class="i-keyline-icons-plus" />Tambah tugas</button>
    </UiPageHead>
    <UiTabs v-model="filter" :items="taskFilters" />
    <AutoSkeleton :loading="pending" id="task-list">
      <div class="flex flex-col gap-3 max-w-[800px]">
        <TaskItem v-for="item in list" :key="item.id" :item="item" @toggle="toggle" @remove="remove" />
        <UiEmpty v-if="!list.length" title="Tidak ada tugas" text="Tambahkan tugas pertamamu." icon="i-keyline-icons-list-checks" />
      </div>
    </AutoSkeleton>
    <UiModal :open="open" title="Tambah tugas" @close="open = false">
      <FieldsForm :schema="taskSchema" :initial="{ priority: 'medium' }" submit-label="Simpan" cancel-label="Batal" @submit="add" @cancel="open = false" />
    </UiModal>
  </div>
</template>
