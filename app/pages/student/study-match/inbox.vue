<script setup>
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const studyMatch = useStudyMatchStore();
const ui = useUiStore();
const tab = ref("incoming");

const tabs = computed(() => [
  { value: "incoming", label: "Masuk", count: studyMatch.incoming.length },
  { value: "outgoing", label: "Terkirim", count: studyMatch.outgoing.length },
]);
const rows = computed(() => (tab.value === "incoming" ? studyMatch.incoming : studyMatch.outgoing));

const respond = (id, status) => {
  studyMatch.respond(id, status);
  ui.notify(status === "accepted" ? "Permintaan diterima" : "Permintaan diperbarui");
};
</script>

<template>
  <div>
    <PageHeading title="Kotak masuk" text="Permintaan Study Match yang menunggu.">
      <AppButton to="/student/study-match/history" variant="ghost">Riwayat</AppButton>
    </PageHeading>
    <AppTabs v-model="tab" :items="tabs" class="mb-6" />
    <div class="grid gap-4 md:grid-cols-2">
      <RequestCard v-for="request in rows" :key="request.id" :request="request">
        <template v-if="tab === 'incoming'">
          <AppButton size="sm" @click="respond(request.id, 'accepted')">Terima</AppButton>
          <AppButton variant="secondary" size="sm" @click="respond(request.id, 'declined')">Tolak</AppButton>
        </template>
        <AppButton v-else variant="ghost" size="sm" @click="respond(request.id, 'cancelled')">Batalkan</AppButton>
      </RequestCard>
    </div>
    <AppEmpty v-if="!rows.length" title="Tidak ada permintaan" icon="i-keyline-inbox" />
  </div>
</template>
