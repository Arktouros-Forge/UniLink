<script setup>
import { tasks as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Tugas kuliah" });
const api = useApi();
const status = ref("open");
const { data, pending, refresh } = await useApiData("tasks", "/student/tasks", {
  query: () => ({ status: status.value, limit: 100 }),
  default: () => ({ tasks: [], summary: {} }),
  watch: [status],
});

const blank = () => ({ id: null, title: "", course: "", dueDate: "", priority: "medium", notes: "" });
const editing = ref(null);
const today = new Date().toISOString().slice(0, 10);

const groups = computed(() => {
  const buckets = [
    { name: copy.groupOverdue, items: [] },
    { name: copy.groupToday, items: [] },
    { name: copy.groupUpcoming, items: [] },
    { name: copy.groupNone, items: [] },
    { name: copy.groupDone, items: [] },
  ];
  for (const task of data.value.tasks) {
    if (task.completed) buckets[4].items.push(task);
    else if (!task.dueDate) buckets[3].items.push(task);
    else if (task.dueDate < today) buckets[0].items.push(task);
    else if (task.dueDate === today) buckets[1].items.push(task);
    else buckets[2].items.push(task);
  }
  return buckets.filter((bucket) => bucket.items.length);
});

const edit = (item) => (editing.value = { ...blank(), ...item, course: item.course ?? "", dueDate: item.dueDate ?? "", notes: item.notes ?? "" });

const toggle = useAction(async (item) => {
  await api.patch(`/student/tasks/${item.id}`, { completed: !item.completed });
  await refresh();
});
const remove = useAction(
  async (item) => {
    await api.del(`/student/tasks/${item.id}`);
    if (editing.value?.id === item.id) editing.value = null;
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
  async () => {
    const payload = {
      title: editing.value.title,
      course: editing.value.course || null,
      dueDate: editing.value.dueDate || null,
      priority: editing.value.priority,
      notes: editing.value.notes || null,
    };
    if (editing.value.id) await api.patch(`/student/tasks/${editing.value.id}`, payload);
    else await api.post("/student/tasks", payload);
    editing.value = null;
    await refresh();
  },
  { success: copy.saved },
);
</script>

<template>
  <PageHeading :title="copy.title" :text="copy.text">
    <UiButton icon="plus" @click="edit(blank())">{{ copy.add }}</UiButton>
  </PageHeading>
  <div class="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <FilterSelect v-model="status" :options="copy.statuses" icon="chevronDown" />
        <UiButton v-if="data.summary.done" variant="link" size="sm" @click="clearDone.run()">{{ copy.clearDone }}</UiButton>
      </div>
      <AutoSkeleton :loading="pending" id="task-groups">
        <section v-for="group in groups" :key="group.name" class="flex flex-col gap-3 mb-4">
          <p class="t-mono-s text-ink m-0 truncate">{{ group.name }}</p>
          <TaskRow v-for="item in group.items" :key="item.id" :item="item" @toggle="toggle.run($event)" @edit="edit($event)" @remove="remove.run($event)" />
        </section>
        <UiEmpty v-if="!groups.length" :title="copy.emptyTitle" :text="copy.emptyText" icon="checkCircle" />
      </AutoSkeleton>
    </div>
    <UiCard v-if="editing" class="flex flex-col gap-4">
      <h2 class="t-d4 text-ink m-0">{{ editing.id ? copy.editTitle : copy.newTitle }}</h2>
      <FormField :label="copy.fieldTitle" :error="save.fieldErrors.value.title" v-slot="{ id }"><FormInput :id="id" v-model="editing.title" /></FormField>
      <FormField :label="copy.fieldCourse" optional v-slot="{ id }"><FormInput :id="id" v-model="editing.course" /></FormField>
      <FormField :label="copy.fieldDue" optional v-slot="{ id }"><FormInput :id="id" v-model="editing.dueDate" type="date" /></FormField>
      <FormField :label="copy.fieldPriority" v-slot="{ id }"><FormSelect :id="id" v-model="editing.priority" :options="copy.priorities" /></FormField>
      <FormField :label="copy.fieldNotes" optional v-slot="{ id }"><FormTextarea :id="id" v-model="editing.notes" /></FormField>
      <UiButton class="self-start" :loading="save.pending.value" :disabled="!editing.title" @click="save.run()">{{ editing.id ? copy.save : copy.create }}</UiButton>
      <UiButton variant="link" class="self-start" @click="editing = null">{{ copy.cancel }}</UiButton>
      <p class="t-body-s text-ink-2 m-0">{{ copy.private }}</p>
    </UiCard>
    <UiCard v-else class="flex flex-col gap-3">
      <h2 class="t-d4 text-ink m-0">{{ copy.title }}</h2>
      <p class="t-body-s text-ink m-0">{{ copy.summary.open }}: {{ data.summary.open ?? 0 }}</p>
      <p class="t-body-s text-ink m-0">{{ copy.summary.overdue }}: {{ data.summary.overdue ?? 0 }}</p>
      <p class="t-body-s text-ink m-0">{{ copy.summary.done }}: {{ data.summary.done ?? 0 }}</p>
      <p class="t-body-s text-ink-2 m-0">{{ copy.private }}</p>
    </UiCard>
  </div>
</template>
