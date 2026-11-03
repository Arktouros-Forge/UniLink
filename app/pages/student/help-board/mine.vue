<script setup>
import { signs } from "@app/constants/mock/study.json";
import { limits } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Tanda saya" });
const { pending } = useMock("my-signs", { signs });
const mine = signs.filter((item) => item.owner === "Ayu Pramesti");
</script>

<template>
  <PageHeading title="Tanda saya" :text="`${mine.length} dari ${limits.activeSigns} tanda aktif.`">
    <UiButton icon="plus" to="/student/help-board/new">Pasang tanda</UiButton>
  </PageHeading>
  <AutoSkeleton :loading="pending" id="my-signs-list">
    <div class="grid gap-6 md:grid-cols-2">
      <HelpSignCard v-for="item in mine" :key="item.id" :item="item" mine />
    </div>
    <UiEmpty v-if="!mine.length" title="Belum ada tanda" icon="flag"><UiButton to="/student/help-board/new" icon="plus">Pasang tanda</UiButton></UiEmpty>
  </AutoSkeleton>
</template>
