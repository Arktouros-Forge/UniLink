<script setup>
import { dayShort, eventTypes, timetableHours } from "@app/constants/options.json";
import { semesterFull } from "@app/constants/site.json";
import { timetable as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Jadwal mingguan" });
const api = useApi();
const { data, pending, refresh } = await useApiData("timetable", "/student/timetable/events", { default: () => ({ events: [] }) });
const { data: lecturers } = await useApiData("lecturer-options", "/student/lecturers", {
  transform: (rows) => rows.map(({ id, name }) => ({ value: id, label: name })),
  default: () => [],
});

const toHours = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour + minute / 60;
};
const monday = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return start;
};
const week = monday();
const todayIndex = (new Date().getDay() + 6) % 7;
const weekDays = dayShort.map((label, index) => {
  const date = new Date(week);
  date.setDate(week.getDate() + index);
  return { label: `${label} ${String(date.getDate()).padStart(2, "0")}`, today: index === todayIndex };
});
const weekRange = computed(() => {
  const end = new Date(week);
  end.setDate(week.getDate() + 6);
  const month = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(end);
  return `${week.getDate()}–${end.getDate()} ${month}`;
});

const events = computed(() =>
  data.value.events.map((event) => ({
    id: event.id,
    title: event.title,
    code: event.courseCode,
    room: event.room,
    lecturer: event.lecturerName,
    day: event.dayOfWeek - 1,
    start: toHours(event.startTime),
    end: toHours(event.endTime),
    label: `${event.startTime.replace(":", ".")}-${event.endTime.replace(":", ".")}`,
    type: event.courseCode ? "kuliah" : "pribadi",
  })),
);

const addOpen = ref(false);
const importOpen = ref(false);
const detail = ref(null);
const blank = () => ({ title: "", courseCode: "", day: 0, start: "08:00", end: "09:40", room: "", lecturerId: "" });
const form = reactive(blank());
const importForm = reactive({ content: "", replace: false, name: "" });

const add = useAction(
  async () => {
    await api.post("/student/timetable/events", {
      title: form.title,
      courseCode: form.courseCode || null,
      dayOfWeek: Number(form.day) + 1,
      startTime: form.start,
      endTime: form.end,
      room: form.room || null,
      lecturerId: form.lecturerId || null,
      recurrence: "weekly",
    });
    Object.assign(form, blank());
    addOpen.value = false;
    await refresh();
  },
  { success: copy.added },
);
const remove = useAction(
  async () => {
    await api.del(`/student/timetable/events/${detail.value.id}`);
    detail.value = null;
    await refresh();
  },
  { success: copy.removed },
);
const readFile = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  importForm.name = file.name;
  importForm.content = await file.text();
};
const doImport = useAction(
  async () => {
    await api.post("/student/timetable/import", { format: "ics", content: importForm.content, replace: importForm.replace });
    importOpen.value = false;
    importForm.content = "";
    importForm.name = "";
    await refresh();
  },
  { success: copy.imported },
);
const exportIcs = () => window.open("/api/v1/student/timetable/export?format=ics", "_blank");
const toneOf = { blue: "blue", red: "red", yellow: "yellow", success: "success" };
const dayOptions = weekDays.map((day, index) => ({ value: index, label: day.label }));
const lecturerOptions = computed(() => [{ value: "", label: copy.lecturerNone }, ...lecturers.value]);
</script>

<template>
  <PageHeading :title="copy.title" :text="`${semesterFull} · ${weekRange}`">
    <UiButton icon="plus" @click="addOpen = true">{{ copy.add }}</UiButton>
  </PageHeading>
  <div class="flex flex-wrap items-center justify-end gap-4">
    <UiButton variant="link" icon="upload" @click="importOpen = true">{{ copy.import }}</UiButton>
    <UiButton variant="link" icon="download" @click="exportIcs">{{ copy.export }}</UiButton>
  </div>
  <AutoSkeleton :loading="pending" id="timetable-grid">
    <TimetableGrid :days="weekDays" :hours="timetableHours" :events="events" @select="detail = $event" />
    <UiEmpty v-if="!events.length" :title="copy.emptyTitle" :text="copy.emptyText" icon="calendar" />
  </AutoSkeleton>
  <div class="flex flex-wrap gap-3"><UiChip v-for="type in eventTypes" :key="type.value" :tone="type.value === 'kuliah' ? 'neutral' : toneOf[type.tone]" size="md">{{ type.label }}</UiChip></div>
  <UiModal :open="!!detail" :title="detail?.title || ''" @close="detail = null">
    <p class="t-mono-s text-ink m-0">{{ detail?.label }}{{ detail?.code ? ` · ${detail.code}` : "" }}</p>
    <p v-if="detail?.room" class="t-body-s text-ink m-0">{{ copy.roomPrefix }} {{ detail.room }}</p>
    <p v-if="detail?.lecturer" class="t-body-s text-ink-2 m-0">{{ detail.lecturer }}</p>
    <template #footer>
      <UiButton variant="dangerLink" :loading="remove.pending.value" @click="remove.run()">{{ copy.delete }}</UiButton>
      <UiButton variant="secondary" @click="detail = null">{{ copy.close }}</UiButton>
    </template>
  </UiModal>
  <UiModal :open="addOpen" :title="copy.add" @close="addOpen = false">
    <FormField :label="copy.eventName" :error="add.fieldErrors.value.title" v-slot="{ id }"><FormInput :id="id" v-model="form.title" /></FormField>
    <FormField :label="copy.code" optional v-slot="{ id }"><FormInput :id="id" v-model="form.courseCode" /></FormField>
    <FormField :label="copy.day" v-slot="{ id }"><FormSelect :id="id" v-model="form.day" :options="dayOptions" /></FormField>
    <div class="grid grid-cols-2 gap-3">
      <FormField :label="copy.start" :error="add.fieldErrors.value.startTime" v-slot="{ id }"><FormInput :id="id" v-model="form.start" type="time" /></FormField>
      <FormField :label="copy.end" :error="add.fieldErrors.value.endTime" v-slot="{ id }"><FormInput :id="id" v-model="form.end" type="time" /></FormField>
    </div>
    <FormField :label="copy.room" optional v-slot="{ id }"><FormInput :id="id" v-model="form.room" /></FormField>
    <FormField :label="copy.lecturer" optional v-slot="{ id }"><FormSelect :id="id" v-model="form.lecturerId" :options="lecturerOptions" /></FormField>
    <template #footer>
      <UiButton :loading="add.pending.value" :disabled="!form.title" @click="add.run()">{{ copy.save }}</UiButton>
      <UiButton variant="link" @click="addOpen = false">{{ copy.cancel }}</UiButton>
    </template>
  </UiModal>
  <UiModal :open="importOpen" :title="copy.importTitle" @close="importOpen = false">
    <FormField :label="copy.importHint" v-slot="{ id }"><input :id="id" type="file" accept=".ics,text/calendar" class="t-body-s" @change="readFile"></FormField>
    <UiCheckbox v-model="importForm.replace" :label="copy.importReplace" />
    <template #footer>
      <UiButton :loading="doImport.pending.value" :disabled="!importForm.content" @click="doImport.run()">{{ copy.importSubmit }}</UiButton>
      <UiButton variant="link" @click="importOpen = false">{{ copy.cancel }}</UiButton>
    </template>
  </UiModal>
</template>
