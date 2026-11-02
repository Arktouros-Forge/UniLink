<script setup>
import { greeting } from "@app/constants/site.json";
import { useAuthStore } from "@app/stores/auth";
import { useMock } from "@app/composables/useMock";
import { stats, requests, signs } from "@app/constants/mock/study.json";
import { competitions, myTeams } from "@app/constants/mock/competitions.json";
import { tasks, events } from "@app/constants/mock/planner.json";
import { days, limits } from "@app/constants/options.json";

definePageMeta({ layout: "student", middleware: "auth" });
const auth = useAuthStore();
const { pending } = useMock("dashboard", { stats }, 800);
const todayIndex = (new Date().getDay() + 6) % 7;
const todayEvents = events.filter((event) => event.day === todayIndex);
const upcoming = tasks.filter((task) => !task.done).slice(0, 3);
const summary = [
  { label: "Permintaan menunggu", value: stats.pending, note: `Batas ${limits.pending}` },
  { label: "Help Sign aktif", value: stats.activeSigns, note: `Batas ${limits.activeSigns}` },
  { label: "Kecocokan", value: stats.matches },
  { label: "Tugas aktif", value: upcoming.length },
];
</script>

<template>
  <div class="flex flex-col gap-8">
    <UiPageHead :title="`${greeting}, ${auth.user.name.split(' ')[0]}`" :text="`${days[todayIndex]} · jadwal dan tugasmu hari ini`" meta="Dasbor" />
    <AutoSkeleton :loading="pending" id="dashboard-stats">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <UiStat v-for="item in summary" :key="item.label" v-bind="item" />
      </div>
    </AutoSkeleton>
    <div class="grid gap-6 md:grid-cols-2">
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between"><h2 class="type-h3">Jadwal hari ini</h2><NuxtLink to="/student/timetable" class="type-small !text-brand-blue">Lihat semua</NuxtLink></div>
        <AutoSkeleton :loading="pending" id="dashboard-events">
          <EventItem v-for="item in todayEvents" :key="item.id" :item="item" />
          <UiEmpty v-if="!todayEvents.length" title="Tidak ada kelas hari ini" icon="i-keyline-icons-calendar" />
        </AutoSkeleton>
      </section>
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between"><h2 class="type-h3">Tugas terdekat</h2><NuxtLink to="/student/tasks" class="type-small !text-brand-blue">Lihat semua</NuxtLink></div>
        <AutoSkeleton :loading="pending" id="dashboard-tasks">
          <TaskItem v-for="item in upcoming" :key="item.id" :item="item" />
        </AutoSkeleton>
      </section>
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between"><h2 class="type-h3">Permintaan masuk</h2><NuxtLink to="/student/study-match/inbox" class="type-small !text-brand-blue">Kotak masuk</NuxtLink></div>
        <AutoSkeleton :loading="pending" id="dashboard-requests">
          <RequestCard v-for="item in requests.slice(0, 2)" :key="item.id" :item="item" />
        </AutoSkeleton>
      </section>
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between"><h2 class="type-h3">Kompetisi untukmu</h2><NuxtLink to="/student/competitions" class="type-small !text-brand-blue">Jelajahi</NuxtLink></div>
        <AutoSkeleton :loading="pending" id="dashboard-competitions">
          <CompetitionCard :item="competitions[0]" />
          <div v-for="team in myTeams" :key="team.id" class="card flex items-center justify-between mt-3">
            <div><p class="type-label">{{ team.name }}</p><p class="type-meta">{{ team.competition }}</p></div>
            <UiChip tone="blue">{{ team.role }}</UiChip>
          </div>
        </AutoSkeleton>
      </section>
    </div>
  </div>
</template>
