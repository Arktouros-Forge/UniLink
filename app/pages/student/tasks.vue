<script setup>
import { tasks, courses } from "@app/constants/mock/planner.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Tugas kuliah" });
const { pending } = useMock("tasks", { tasks });
const list = ref(tasks.map((item) => ({ ...item })));
const status = ref("all");
const course = ref("all");
const editing = ref({ ...list.value[0] });
const statusOptions = [{ value: "all", label: "Semua status" }, { value: "active", label: "Aktif" }, { value: "done", label: "Selesai" }];
const courseOptions = [{ value: "all", label: "Semua mata kuliah" }, ...courses.map((item) => ({ value: item, label: item }))];
const shown = computed(() => list.value.filter((item) => (status.value === "all" || (status.value === "done") === item.done) && (course.value === "all" || item.course.startsWith(course.value.split(" ")[0]))));
const groups = computed(() => [...new Set(shown.value.map((item) => item.group))].map((name) => ({ name, items: shown.value.filter((item) => item.group === name) })));
const toggle = (item) => {
  list.value = list.value.map((entry) => (entry.id === item.id ? { ...entry, done: !entry.done, time: !entry.done ? "Selesai" : "23.59" } : entry));
};
const save = () => (list.value = list.value.map((item) => (item.id === editing.value.id ? { ...item, title: editing.value.title } : item)));
const addTask = () => {
  const item = { id: Date.now(), title: "Tugas baru", course: courses[0], time: "23.59", urgent: false, group: "Minggu ini · 06 Nov", done: false };
  list.value = [item, ...list.value];
  editing.value = { ...item };
};
</script>

<template>
  <PageHeading title="Tugas kuliah" text="Satu per satu, selesaikan yang paling penting hari ini.">
    <UiButton icon="plus" @click="addTask">Tambah tugas</UiButton>
  </PageHeading>
  <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap gap-3">
        <FilterSelect v-model="status" :options="statusOptions" icon="chevronDown" />
        <FilterSelect v-model="course" :options="courseOptions" icon="chevronDown" />
      </div>
      <AutoSkeleton :loading="pending" id="task-groups">
        <section v-for="group in groups" :key="group.name" class="flex flex-col gap-3 mb-4">
          <p class="t-mono-s text-ink m-0">{{ group.name }}</p>
          <TaskRow v-for="item in group.items" :key="item.id" :item="item" @toggle="toggle" @edit="editing = { ...$event }" @remove="list = list.filter((entry) => entry.id !== $event.id)" />
        </section>
        <UiEmpty v-if="!groups.length" title="Tidak ada tugas" text="Tambahkan tugas pertamamu." icon="checkCircle" />
      </AutoSkeleton>
    </div>
    <UiCard class="flex flex-col gap-4">
      <h2 class="t-d4 text-ink m-0">Edit tugas</h2>
      <FormField label="Judul tugas" v-slot="{ id }"><FormInput :id="id" v-model="editing.title" /></FormField>
      <FormField label="Mata kuliah" v-slot="{ id }"><FormSelect :id="id" v-model="editing.course" :options="courses" /></FormField>
      <FormField label="Tenggat" v-slot="{ id }"><FormInput :id="id" v-model="editing.time" icon="calendar" /></FormField>
      <FormField label="Catatan" v-slot="{ id }"><FormTextarea :id="id" v-model="editing.note" /></FormField>
      <UiButton class="self-start" @click="save">Simpan perubahan</UiButton>
      <UiButton variant="link" class="self-start">Batal</UiButton>
      <p class="t-body-s text-ink-2 m-0">Tugas hanya terlihat olehmu.</p>
    </UiCard>
  </div>
</template>
