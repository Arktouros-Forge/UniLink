<script setup>
import { greeting } from "@app/constants/site.json";
import { days } from "@app/constants/options.json";
import { useAuthStore } from "@app/stores/auth";
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { useTasksStore } from "@app/stores/tasks";
import { useTimetableStore } from "@app/stores/timetable";
import { useCompetitionsStore } from "@app/stores/competitions";

definePageMeta({ layout: "student" });

const auth = useAuthStore();
const studyMatch = useStudyMatchStore();
const tasks = useTasksStore();
const timetable = useTimetableStore();
const competitions = useCompetitionsStore();

const today = new Date().getDay() || 7;
const todayLabel = days.find((day) => day.key === today)?.label;
const pendingTasks = computed(() => tasks.list("pending").slice(0, 3));
const openCompetitions = computed(() => competitions.published().filter((item) => !competitions.isClosed(item)).slice(0, 2));
</script>

<template>
  <div>
    <PageHeading :title="`${greeting.replace('teman kampus', firstName(auth.user.fullName))}`" text="Ringkasan harimu." />

    <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <AppStat label="Permintaan masuk" :value="studyMatch.incoming.length" icon="i-keyline-inbox" to="/student/study-match/inbox" />
      <AppStat label="Tugas berjalan" :value="tasks.list('pending').length" icon="i-keyline-list-checks" to="/student/tasks" />
      <AppStat :label="`Kelas ${todayLabel}`" :value="timetable.byDay(today).length" icon="i-keyline-calendar" to="/student/timetable" />
      <AppStat label="Kompetisi terbuka" :value="openCompetitions.length" icon="i-keyline-trophy" to="/student/competitions" />
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <section>
        <SectionTitle title="Tugas terdekat" to="/student/tasks" />
        <div class="grid gap-3">
          <TaskCard v-for="task in pendingTasks" :key="task.id" :task="task" @toggle="tasks.toggle" />
          <AppEmpty v-if="!pendingTasks.length" title="Semua tugas selesai" icon="i-keyline-circle-check" />
        </div>
      </section>
      <section>
        <SectionTitle :title="`Jadwal ${todayLabel}`" to="/student/timetable" />
        <div class="grid gap-3">
          <EventCard v-for="event in timetable.byDay(today)" :key="event.id" :event="event" />
          <AppEmpty v-if="!timetable.byDay(today).length" title="Tidak ada kelas hari ini" icon="i-keyline-calendar" />
        </div>
      </section>
    </div>

    <section class="mt-8">
      <SectionTitle title="Kompetisi untukmu" to="/student/competitions" />
      <div class="grid gap-4 md:grid-cols-2">
        <CompetitionCard v-for="item in openCompetitions" :key="item.id" :competition="item" />
      </div>
    </section>
  </div>
</template>
