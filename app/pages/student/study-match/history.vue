<script setup>
import { history } from "@app/constants/mock/study.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Riwayat belajar" });
const { pending } = useMock("history", { history });
</script>

<template>
  <PageHeading title="Riwayat belajar" text="Semua permintaan yang pernah kamu kirim atau terima.">
    <UiButton variant="secondary" to="/student/study-match/requests">Kembali ke permintaan</UiButton>
  </PageHeading>
  <AutoSkeleton :loading="pending" id="history-list">
    <div class="flex flex-col gap-4">
      <RequestRow v-for="item in history" :key="item.id" :item="item" />
      <UiEmpty v-if="!history.length" title="Belum ada riwayat" icon="clock" />
    </div>
  </AutoSkeleton>
</template>
