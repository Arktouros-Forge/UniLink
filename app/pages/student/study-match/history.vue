<script setup>
import { useStudyMatchStore } from "@app/stores/studyMatch";

definePageMeta({ layout: "student" });

const studyMatch = useStudyMatchStore();
</script>

<template>
  <div>
    <PageHeading title="Riwayat" text="Permintaan yang sudah selesai." />
    <div class="grid gap-4 md:grid-cols-2">
      <RequestCard v-for="request in studyMatch.history" :key="request.id" :request="request" />
    </div>
    <AppEmpty v-if="!studyMatch.history.length" title="Belum ada riwayat" icon="i-keyline-clock" />
  </div>
</template>
