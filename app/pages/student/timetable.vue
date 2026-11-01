<script setup>
import { days } from "@app/constants/options.json";
import { useTimetableStore } from "@app/stores/timetable";
import { useReferenceStore } from "@app/stores/reference";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";
import { toExportJson, downloadJson } from "@app/utils/timetable";

definePageMeta({ layout: "student" });

const timetable = useTimetableStore();
const reference = useReferenceStore();
const auth = useAuthStore();
const ui = useUiStore();
const modal = ref(false);
const editing = ref(null);

const filledDays = computed(() => days.filter((day) => timetable.byDay(day.key).length));

const openForm = (event = null) => {
  editing.value = event;
  modal.value = true;
};

const save = (data) => {
  if (editing.value) timetable.update(editing.value.id, data);
  else timetable.add(data);
  modal.value = false;
  ui.notify("Jadwal disimpan", "good");
};

const exportJson = () => downloadJson(toExportJson(auth.user, timetable.events, reference.lecturers), "unilink-timetable.json");
</script>

<template>
  <div>
    <PageHeading title="Jadwal" text="Kuliah mingguan beserta dosennya.">
      <AppButton variant="secondary" @click="exportJson"><span class="i-keyline-download" />Ekspor JSON</AppButton>
      <AppButton @click="openForm()"><span class="i-keyline-plus" />Tambah kelas</AppButton>
    </PageHeading>
    <div class="grid gap-6">
      <section v-for="day in filledDays" :key="day.key">
        <h2 class="type-h3 mb-3">{{ day.label }}</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <EventCard v-for="event in timetable.byDay(day.key)" :key="event.id" :event="event" @edit="openForm" @remove="timetable.remove" />
        </div>
      </section>
    </div>
    <AppEmpty v-if="!filledDays.length" title="Jadwal masih kosong" icon="i-keyline-calendar" />
    <AppModal v-model="modal" :title="editing ? 'Ubah kelas' : 'Tambah kelas'">
      <EventForm :key="editing?.id ?? 'new'" :initial="editing ?? {}" @save="save" />
    </AppModal>
  </div>
</template>
