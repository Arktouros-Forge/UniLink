<script setup>
import { limits } from "@app/constants/options.json";
import { helpBoard as board, mySigns as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Tanda saya" });
const { data, pending } = await useApiData("my-signs", "/student/study-match/help-signs", {
  query: { scope: "mine", limit: 50 },
  default: () => ({ signs: [] }),
});
const active = computed(() => data.value.signs.filter((item) => item.status === "open").length);
</script>

<template>
  <PageHeading :title="copy.title" :text="`${active} dari ${limits.activeSigns} tanda aktif.`">
    <UiButton icon="plus" to="/student/help-board/new">{{ board.post }}</UiButton>
  </PageHeading>
  <AutoSkeleton :loading="pending" id="my-signs-list">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
      <HelpSignCard v-for="item in data.signs" :key="item.id" :item="item" mine />
    </div>
    <UiEmpty v-if="!data.signs.length" :title="copy.emptyTitle" icon="flag"><UiButton to="/student/help-board/new" icon="plus">{{ board.post }}</UiButton></UiEmpty>
  </AutoSkeleton>
</template>
