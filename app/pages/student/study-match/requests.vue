<script setup>
import { incoming, outgoing } from "@app/constants/mock/study.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Permintaan belajar" });
const { pending } = useMock("requests", { incoming });
const tab = ref("in");
const rows = ref(incoming.map((item) => ({ ...item })));
const tabs = computed(() => [
  { value: "in", label: "Masuk", count: rows.value.filter((item) => item.status === "pending").length },
  { value: "out", label: "Keluar", count: outgoing.length },
]);
const setStatus = (item, status) => (rows.value = rows.value.map((row) => (row.id === item.id ? { ...row, status } : row)));
</script>

<template>
  <PageHeading title="Permintaan belajar" text="Tanggapi dengan jelas. Belajar yang baik dimulai dari persetujuan.">
    <UiButton variant="secondary" to="/student/study-match/history">Lihat riwayat</UiButton>
  </PageHeading>
  <UiTabs v-model="tab" :items="[...tabs, { value: 'history', label: 'Riwayat' }]" @update:model-value="tab === 'history' && navigateTo('/student/study-match/history')" />
  <AutoSkeleton :loading="pending" id="requests-list">
    <div class="flex flex-col gap-4">
      <template v-if="tab === 'in'">
        <RequestRow v-for="item in rows" :key="item.id" :item="item" actions @accept="setStatus($event, 'accepted')" @decline="setStatus($event, 'declined')" />
      </template>
      <RequestRow v-for="item in tab === 'out' ? outgoing : []" :key="item.id" :item="item" />
    </div>
  </AutoSkeleton>
  <UiCallout title="Tidak ada chat di UniLink.">Setelah diterima, diskusikan kebutuhan dan waktu belajar melalui WhatsApp. Nomor tidak dibuka untuk permintaan yang ditolak.</UiCallout>
</template>
