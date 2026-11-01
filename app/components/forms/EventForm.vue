<script setup>
import { days, eventColors } from "@app/constants/options.json";
import { useReferenceStore } from "@app/stores/reference";
import { useTimetableStore } from "@app/stores/timetable";

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save"]);

const reference = useReferenceStore();
const timetable = useTimetableStore();
const form = reactive({ courseCode: "", title: "", dayOfWeek: 1, start: "08:00", end: "10:00", room: "", lecturerId: "", color: eventColors[0], ...props.initial });

const dayOptions = days.map((day) => ({ value: day.key, label: day.label }));
const colorOptions = eventColors.map((color) => ({ value: color, label: color }));
const conflicts = computed(() => timetable.conflictsWith({ ...form, dayOfWeek: Number(form.dayOfWeek) }));
</script>

<template>
  <form class="grid gap-4" @submit.prevent="emit('save', { ...form, dayOfWeek: Number(form.dayOfWeek) })">
    <div class="grid gap-4 sm:grid-cols-2">
      <AppInput v-model="form.courseCode" label="Kode mata kuliah" required />
      <AppInput v-model="form.title" label="Nama mata kuliah" required />
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <AppInput v-model="form.dayOfWeek" label="Hari" as="select" :options="dayOptions" />
      <AppInput v-model="form.start" label="Mulai" type="time" required />
      <AppInput v-model="form.end" label="Selesai" type="time" required />
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <AppInput v-model="form.room" label="Ruangan" />
      <AppInput v-model="form.lecturerId" label="Dosen" as="select" placeholder="Pilih dosen" :options="reference.lecturerOptions" />
    </div>
    <AppInput v-model="form.color" label="Warna" as="select" :options="colorOptions" />
    <p v-if="conflicts.length" class="type-small text-brand-red">Bentrok dengan {{ conflicts.map((item) => item.title).join(", ") }}.</p>
    <AppButton type="submit" block>Simpan</AppButton>
  </form>
</template>
