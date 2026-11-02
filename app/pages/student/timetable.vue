<script setup>
import { events } from "@app/constants/mock/planner.json";
import { event as eventSchema } from "@app/constants/forms.json";
import { days } from "@app/constants/options.json";
import { timezoneLabel } from "@app/constants/site.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const { pending } = useMock("timetable", { events });
const items = ref(events.map((item) => ({ ...item })));
const day = ref((new Date().getDay() + 6) % 7);
const open = ref(false);
const forDay = (index) => items.value.filter((item) => item.day === index).sort((a, b) => a.start.localeCompare(b.start));
const remove = (item) => (items.value = items.value.filter((entry) => entry.id !== item.id));
const add = (values) => {
  items.value = [...items.value, { id: Date.now(), color: "blue", ...values }];
  open.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Jadwal" :text="`Semua waktu dalam ${timezoneLabel}.`" meta="Perencana">
      <button class="btn-primary" @click="open = true"><span class="i-keyline-icons-plus" />Tambah kelas</button>
    </UiPageHead>
    <div class="flex gap-2 overflow-x-auto md:hidden">
      <button v-for="(label, index) in days" :key="label" class="chip shrink-0 cursor-pointer" :class="day === index ? 'bg-brand-blue text-onbrand border-brand-blue' : 'bg-card border-edge text-ink'" @click="day = index">{{ label }}</button>
    </div>
    <AutoSkeleton :loading="pending" id="timetable-grid">
      <div class="grid gap-4 md:grid-cols-5 xl:grid-cols-7">
        <section v-for="(label, index) in days" :key="label" class="flex-col gap-3" :class="day === index ? 'flex' : 'hidden md:flex'">
          <h2 class="type-meta border-b border-rule pb-2">{{ label }}</h2>
          <EventItem v-for="item in forDay(index)" :key="item.id" :item="item" @remove="remove" />
          <p v-if="!forDay(index).length" class="type-small">Tidak ada kelas.</p>
        </section>
      </div>
    </AutoSkeleton>
    <UiModal :open="open" title="Tambah kelas" @close="open = false">
      <FieldsForm :schema="eventSchema" submit-label="Simpan" cancel-label="Batal" @submit="add" @cancel="open = false" />
    </UiModal>
  </div>
</template>
