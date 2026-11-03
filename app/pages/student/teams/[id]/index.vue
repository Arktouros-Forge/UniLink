<script setup>
import { teams } from "@app/constants/mock/competitions.json";
import { whatsappBase } from "@app/constants/site.json";
import { whatsappUrl } from "@app/utils/format";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Tim Garuda" });
const route = useRoute();
const team = computed(() => teams.find((entry) => entry.id === Number(route.params.id)) || teams[0]);
const { pending } = useMock(`team-${route.params.id}`, { team: team.value });
const reportOpen = ref(false);
const result = ref("");
</script>

<template>
  <PageHeading :title="team.name" :text="`${team.competition} / ${team.track}`">
    <UiChip size="md">Kamu adalah anggota</UiChip>
  </PageHeading>
  <AutoSkeleton :loading="pending" id="team-detail">
    <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
      <div class="flex flex-col gap-6">
        <UiCard class="flex flex-col gap-4">
          <h2 class="t-d4 text-ink m-0">{{ team.title }}</h2>
          <p class="t-body-m text-ink m-0">{{ team.description }}</p>
          <div class="flex gap-2"><UiChip tone="yellow" filled>{{ team.members.length }} dari {{ team.capacity }} anggota</UiChip><UiChip>Menerima permintaan</UiChip></div>
          <h3 class="t-d4 text-ink m-0">Keahlian yang masih dibutuhkan</h3>
          <div class="flex flex-wrap gap-2"><UiChip v-for="need in team.needs" :key="need">{{ need }}</UiChip></div>
          <UiDivider />
          <h3 class="t-d4 text-ink m-0">Anggota tim</h3>
          <MemberRow v-for="member in team.members" :key="member.name" :item="member" />
        </UiCard>
        <UiCard class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-2"><h2 class="t-d4 text-ink m-0">Hasil kompetisi</h2><p class="t-body-s text-ink-2 m-0">Belum dilaporkan. Catat pencapaian tim setelah pengumuman.</p></div>
          <UiButton variant="secondary" icon="flag" @click="reportOpen = true">Laporkan hasil</UiButton>
        </UiCard>
      </div>
      <div class="flex flex-col gap-4">
        <UiCard class="flex flex-col gap-3">
          <h2 class="t-d4 text-ink m-0">Permintaan bergabungmu</h2>
          <UiChip class="self-start">Diterima · {{ team.joinedAt }}</UiChip>
          <p class="t-body-s text-ink m-0">Bima menerima permintaanmu. Kamu sekarang anggota {{ team.name }}.</p>
          <UiButton icon="external" :href="whatsappUrl(whatsappBase, team.ownerPhone)" class="self-start">WhatsApp Bima</UiButton>
          <p class="t-mono-s text-ink m-0">{{ team.ownerPhone }}</p>
          <p class="t-body-s text-ink-2 m-0">WhatsApp hanya terbuka bagi anggota yang diterima.</p>
        </UiCard>
        <UiCallout title="Koordinasi di WhatsApp">UniLink tidak menyediakan chat tim. Sepakati pembagian peran langsung bersama anggota.</UiCallout>
        <UiCard class="flex flex-col gap-3">
          <p class="t-mono-s text-ink m-0">Tenggat · {{ team.deadline }}</p>
          <UiButton variant="link" to="/student/competitions/1" class="self-start">Lihat kompetisi</UiButton>
          <UiButton variant="link" to="/student/teams/1/requests" class="self-start">Permintaan bergabung</UiButton>
        </UiCard>
      </div>
    </div>
  </AutoSkeleton>
  <UiModal :open="reportOpen" title="Laporkan hasil" @close="reportOpen = false">
    <FormField label="Hasil" v-slot="{ id }"><FormSelect :id="id" v-model="result" :options="['Juara', 'Berpartisipasi']" placeholder="Pilih hasil" /></FormField>
    <template #footer>
      <UiButton icon="check" :disabled="!result" @click="reportOpen = false">Kirim laporan</UiButton>
      <UiButton variant="link" @click="reportOpen = false">Batal</UiButton>
    </template>
  </UiModal>
</template>
