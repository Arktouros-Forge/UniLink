<script setup>
import { stats, weekly, accepted, review } from "@app/constants/mock/admin.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth", title: "Dasbor admin" });
const { pending } = useMock("admin-dashboard", { stats }, 800);
</script>

<template>
  <PageHeading title="Dasbor admin" text="Ringkasan operasional · seluruh angka merupakan data contoh." />
  <AutoSkeleton :loading="pending" id="admin-stats">
    <div class="grid gap-4 md:grid-cols-3 md:gap-6">
      <StatCard v-for="item in stats" :key="item.label" v-bind="item" />
    </div>
  </AutoSkeleton>
  <AutoSkeleton :loading="pending" id="admin-charts">
    <div class="grid gap-6 md:grid-cols-2">
      <UiCard class="flex flex-col gap-6">
        <div class="flex items-center justify-between"><h2 class="t-d4 text-ink m-0">Aktivitas mingguan</h2><UiChip>Data ilustratif</UiChip></div>
        <ChartBars :rows="weekly" />
      </UiCard>
      <UiCard class="flex flex-col gap-6">
        <div class="flex items-center justify-between"><h2 class="t-d4 text-ink m-0">Permintaan diterima</h2><UiChip>Data ilustratif</UiChip></div>
        <ChartStep :rows="accepted" />
      </UiCard>
    </div>
  </AutoSkeleton>
  <UiCard class="flex flex-col gap-4">
    <h2 class="t-d4 text-ink m-0">{{ review.title }}</h2>
    <p class="t-body-s text-ink m-0">{{ review.text }}</p>
    <UiButton variant="link" icon-end="arrowRight" to="/admin/competitions" class="self-start">{{ review.action }}</UiButton>
  </UiCard>
</template>
