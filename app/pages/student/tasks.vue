<script setup>
import { taskFilters } from "@app/constants/options.json";
import { useTasksStore } from "@app/stores/tasks";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const tasks = useTasksStore();
const ui = useUiStore();
const filter = ref("all");
const modal = ref(false);
const editing = ref(null);

const tabs = taskFilters.map((item) => ({ value: item.key, label: item.label }));
const list = computed(() => tasks.list(filter.value));

const openForm = (task = null) => {
  editing.value = task;
  modal.value = true;
};

const save = (data) => {
  if (editing.value) tasks.update(editing.value.id, data);
  else tasks.add({ ...data, completed: false });
  modal.value = false;
  ui.notify("Tugas disimpan", "good");
};
</script>

<template>
  <div>
    <PageHeading title="Tugas" text="Pantau tenggat dan prioritasmu.">
      <AppButton @click="openForm()"><span class="i-keyline-plus" />Tambah tugas</AppButton>
    </PageHeading>
    <AppTabs v-model="filter" :items="tabs" class="mb-6" />
    <div class="grid gap-3">
      <TaskCard v-for="task in list" :key="task.id" :task="task" @toggle="tasks.toggle" @edit="openForm" @remove="tasks.remove" />
    </div>
    <AppEmpty v-if="!list.length" title="Tidak ada tugas" icon="i-keyline-list-checks" />
    <AppModal v-model="modal" :title="editing ? 'Ubah tugas' : 'Tambah tugas'">
      <TaskForm :key="editing?.id ?? 'new'" :initial="editing ?? {}" @save="save" />
    </AppModal>
  </div>
</template>
