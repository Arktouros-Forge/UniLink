<script setup>
import { events, weekDays, weekRange, hours } from "@app/constants/mock/planner.json";
import { eventTypes } from "@app/constants/options.json";
import { semesterFull } from "@app/constants/site.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Jadwal mingguan" });
const { pending } = useMock("timetable", { events });
const list = ref(events.map((item) => ({ ...item })));
const addOpen = ref(false);
const detail = ref(null);
const form = reactive({ title: "", day: 0, start: "08:00", end: "09:40", room: "", type: "kuliah" });
const toneOf = { blue: "blue", red: "red", yellow: "yellow", success: "success" };
const add = () => {
  const [sh, sm] = form.start.split(":").map(Number);
  const [eh, em] = form.end.split(":").map(Number);
  list.value = [...list.value, { id: Date.now(), title: form.title, day: Number(form.day), start: sh + sm / 60, end: eh + em / 60, label: `${form.start.replace(":", ".")}-${form.end.replace(":", ".")}`, type: form.type, code: "", room: form.room, lecturer: "" }];
  addOpen.value = false;
};
</script>

<template>
  <PageHeading title="Jadwal mingguan" :text="`${semesterFull} · ${weekRange}`">
    <UiButton icon="plus" @click="addOpen = true">Tambah acara</UiButton>
  </PageHeading>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <UiButton variant="link" icon="chevronLeft">Pekan lalu</UiButton>
      <UiButton variant="secondary" size="sm" icon="calendar">Hari ini</UiButton>
      <UiButton variant="link" icon-end="chevronRight">Pekan depan</UiButton>
    </div>
    <div class="flex items-center gap-4"><UiButton variant="link" icon="upload">Impor</UiButton><UiButton variant="link" icon="download">Ekspor</UiButton></div>
  </div>
  <AutoSkeleton :loading="pending" id="timetable-grid">
    <TimetableGrid :days="weekDays" :hours="hours" :events="list" @select="detail = $event" />
  </AutoSkeleton>
  <div class="flex flex-wrap gap-3"><UiChip v-for="type in eventTypes" :key="type.value" :tone="type.value === 'kuliah' ? 'neutral' : toneOf[type.tone]" size="md">{{ type.label }}</UiChip></div>
  <UiModal :open="!!detail" :title="detail?.title || ''" @close="detail = null">
    <p class="t-mono-s text-ink m-0">{{ detail?.label }} · {{ detail?.code }}</p>
    <p class="t-body-s text-ink m-0">Ruang {{ detail?.room }}</p>
    <p v-if="detail?.lecturer" class="t-body-s text-ink-2 m-0">{{ detail.lecturer }}</p>
    <template #footer>
      <UiButton variant="dangerLink" @click="list = list.filter((item) => item.id !== detail.id); detail = null">Hapus</UiButton>
      <UiButton variant="secondary" @click="detail = null">Tutup</UiButton>
    </template>
  </UiModal>
  <UiModal :open="addOpen" title="Tambah acara" @close="addOpen = false">
    <FormField label="Nama acara" v-slot="{ id }"><FormInput :id="id" v-model="form.title" /></FormField>
    <FormField label="Jenis" v-slot="{ id }"><FormSelect :id="id" v-model="form.type" :options="eventTypes" /></FormField>
    <FormField label="Hari" v-slot="{ id }"><FormSelect :id="id" v-model="form.day" :options="weekDays.map((day, index) => ({ value: index, label: day.label }))" /></FormField>
    <div class="grid grid-cols-2 gap-3">
      <FormField label="Mulai" v-slot="{ id }"><FormInput :id="id" v-model="form.start" type="time" /></FormField>
      <FormField label="Selesai" v-slot="{ id }"><FormInput :id="id" v-model="form.end" type="time" /></FormField>
    </div>
    <FormField label="Ruang" optional v-slot="{ id }"><FormInput :id="id" v-model="form.room" /></FormField>
    <template #footer>
      <UiButton :disabled="!form.title" @click="add">Simpan</UiButton>
      <UiButton variant="link" @click="addOpen = false">Batal</UiButton>
    </template>
  </UiModal>
</template>
