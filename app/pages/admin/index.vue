<script setup>
import { stats, weekly, topSkills, cohorts } from "@app/constants/mock/analytics.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("analytics", { stats }, 800);
const charts = [
  { title: "Permintaan per hari", rows: weekly, color: "bg-brand-blue" },
  { title: "Keahlian teratas", rows: topSkills, color: "bg-brand-red" },
  { title: "Pengguna per angkatan", rows: cohorts, color: "bg-brand-yellow" },
];
const peak = (rows) => Math.max(...rows.map((row) => row.value));
</script>

<template>
  <div class="flex flex-col gap-8">
    <UiPageHead title="Analitik" text="Ringkasan aktivitas UniLink." meta="Admin" />
    <AutoSkeleton :loading="pending" id="admin-stats">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <UiStat v-for="item in stats" :key="item.label" :label="item.label" :value="item.value" :note="item.delta" />
      </div>
    </AutoSkeleton>
    <AutoSkeleton :loading="pending" id="admin-charts">
      <div class="grid gap-4 md:grid-cols-3">
        <section v-for="chart in charts" :key="chart.title" class="card flex flex-col gap-4">
          <h2 class="type-h3">{{ chart.title }}</h2>
          <div v-for="row in chart.rows" :key="row.label" class="flex items-center gap-3">
            <span class="type-meta w-20 shrink-0 truncate">{{ row.label }}</span>
            <span class="flex-1 h-3 bg-soft rounded-sm overflow-hidden"><span class="block h-full" :class="chart.color" :style="{ width: `${(row.value / peak(chart.rows)) * 100}%` }" /></span>
            <span class="type-small w-9 text-right !text-ink">{{ row.value }}</span>
          </div>
        </section>
      </div>
    </AutoSkeleton>
  </div>
</template>
