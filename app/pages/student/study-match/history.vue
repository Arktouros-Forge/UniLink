<script setup>
import { history } from "@app/constants/mock/study.json";
import { statusTone } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const { pending } = useMock("history", { history });
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Riwayat" text="Semua permintaan yang pernah kamu kirim atau terima." meta="Study Match" />
    <AutoSkeleton :loading="pending" id="history-list">
      <div class="flex flex-col gap-3 max-w-[720px]">
        <div v-for="item in history" :key="item.id" class="card !p-4 flex items-center gap-3">
          <UiAvatar :name="item.with" />
          <div class="flex-1 min-w-0"><p class="type-label truncate">{{ item.with }}</p><p class="type-meta">{{ item.topic }} · {{ item.date }}</p></div>
          <UiChip :tone="statusTone[item.status].tone">{{ statusTone[item.status].label }}</UiChip>
        </div>
        <UiEmpty v-if="!history.length" title="Belum ada riwayat" icon="i-keyline-icons-history" />
      </div>
    </AutoSkeleton>
  </div>
</template>
