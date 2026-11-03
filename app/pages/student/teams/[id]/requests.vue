<script setup>
import { joinRequests } from "@app/constants/mock/competitions.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Permintaan bergabung" });
const { pending } = useMock("join-requests", { joinRequests });
const rows = ref(joinRequests.map((item) => ({ ...item })));
</script>

<template>
  <PageHeading title="Permintaan bergabung" text="Terima anggota yang melengkapi kebutuhan keahlian tim." />
  <AutoSkeleton :loading="pending" id="join-requests">
    <div class="flex flex-col gap-4">
      <UiCard v-for="item in rows" :key="item.id" class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-4">
          <UiAvatar :name="item.name" :size="40" />
          <div class="flex flex-col gap-1">
            <p class="t-label text-ink m-0">{{ item.name }}</p>
            <p class="t-body-s text-ink-2 m-0">{{ item.meta }}</p>
            <p class="t-body-s text-ink m-0">{{ item.message }}</p>
            <div class="flex gap-2 pt-1"><UiChip v-for="skill in item.skills" :key="skill">{{ skill }}</UiChip></div>
          </div>
        </div>
        <div class="flex gap-3">
          <UiButton variant="secondary" @click="rows = rows.filter((row) => row.id !== item.id)">Tolak</UiButton>
          <UiButton @click="rows = rows.filter((row) => row.id !== item.id)">Terima</UiButton>
        </div>
      </UiCard>
      <UiEmpty v-if="!rows.length" title="Tidak ada permintaan" icon="users" />
    </div>
  </AutoSkeleton>
</template>
