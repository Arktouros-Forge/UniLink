<script setup>
import { requests } from "@app/constants/mock/study.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const items = ref(requests.map((item) => ({ ...item })));
const { pending } = useMock("inbox", { requests });
const setStatus = (item, status) => (items.value = items.value.map((entry) => (entry.id === item.id ? { ...entry, status } : entry)));
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Kotak masuk" text="Permintaan belajar dari mahasiswa lain." meta="Study Match">
      <NuxtLink to="/student/study-match/history" class="btn-secondary"><span class="i-keyline-icons-history" />Riwayat</NuxtLink>
    </UiPageHead>
    <AutoSkeleton :loading="pending" id="inbox-list">
      <div class="flex flex-col gap-4 max-w-[720px]">
        <RequestCard v-for="item in items" :key="item.id" :item="item" @accept="setStatus($event, 'accepted')" @decline="setStatus($event, 'declined')" />
        <UiEmpty v-if="!items.length" title="Kotak masuk kosong" text="Permintaan baru akan muncul di sini." />
      </div>
    </AutoSkeleton>
  </div>
</template>
