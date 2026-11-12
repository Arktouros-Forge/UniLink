<script setup>
import { tasks as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", access: "student", title: "Tugas kuliah" });
const api = useApi();
const status = ref("open");
const { data, pending, refresh } = await useApiData("tasks", "/student/tasks", {
  query: () => ({ status: status.value, limit: 100 }),
  default: () => ({ tasks: [], summary: {} }),
  watch: [status],
});

const editing = ref(null);
const modalOpen = ref(false);
const openModal = (item = {}) => {
  editing.value = item;
  modalOpen.value = true;
};

const tabs = computed(() => [
  { value: "open", label: copy.tabs.open, count: data.value.summary.open ?? 0 },
  { value: "overdue", label: copy.tabs.overdue, count: data.value.summary.overdue ?? 0 },
  { value: "done", label: copy.tabs.done, count: data.value.summary.done ?? 0 },
  { value: "all", label: copy.tabs.all },
]);

const toggle = useAction(async (item) => {
  await api.patch(`/student/tasks/${item.id}`, { completed: !item.completed });
  await refresh();
});
const remove = useAction(
  async (item) => {
    await api.del(`/student/tasks/${item.id}`);
    await refresh();
  },
  { success: copy.removed },
);
const clearDone = useAction(
  async () => {
    await api.del("/student/tasks/completed");
    await refresh();
  },
  { success: copy.cleared },
);
const save = useAction(
  async (payload) => {
    if (editing.value?.id) await api.patch(`/student/tasks/${editing.value.id}`, payload);
    else await api.post("/student/tasks", payload);
    modalOpen.value = false;
    await refresh();
  },
  { success: copy.saved },
);
</script>

<template>
  <PageHeading :title="copy.title" :text="copy.text">
    <UiButton icon="plus" @click="openModal()">{{ copy.add }}</UiButton>
  </PageHeading>
  <UiTabs v-model="status" :items="tabs" />
  <AutoSkeleton :loading="pending" id="task-list">
    <UiCard v-if="data.tasks.length" padding="p-0" class=":uno: overflow-hidden">
      <ul class=":uno: m-0 p-0 list-none flex flex-col divide-y divide-hairline">
        <TaskRow v-for="item in data.tasks" :key="item.id" :item="item" @toggle="toggle.run($event)" @edit="openModal($event)" @remove="remove.run($event)" />
      </ul>
    </UiCard>
    <UiEmpty v-else :title="copy.emptyTitle" :text="copy.emptyText" icon="checkCircle" />
    <div v-if="status === 'done' && data.tasks.length" class=":uno: flex justify-end">
      <UiButton variant="link" size="sm" @click="clearDone.run()">{{ copy.clearDone }}</UiButton>
    </div>
  </AutoSkeleton>
  <TaskModal :open="modalOpen" :initial="editing ?? {}" :pending="save.pending.value" :errors="save.fieldErrors.value" @close="modalOpen = false" @save="save.run($event)" />
</template>
