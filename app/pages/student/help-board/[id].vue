<script setup>
import { signs } from "@app/constants/mock/study.json";
import { helpers } from "@app/constants/mock/people.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Detail tanda bantuan" });
const route = useRoute();
const sign = computed(() => signs.find((item) => item.id === Number(route.params.id)) || signs[0]);
const { pending } = useMock(`sign-${route.params.id}`, { sign: sign.value });
const open = ref(false);
</script>

<template>
  <UiButton to="/student/help-board" variant="link" icon="arrowLeft" class="self-start">Papan bantuan</UiButton>
  <AutoSkeleton :loading="pending" id="sign-detail">
    <UiCard class="flex flex-col gap-4 max-w-[800px]">
      <div class="flex items-center gap-2"><UiChip tone="blue">{{ sign.skill }}</UiChip><UiChip tone="success">Dibuka</UiChip></div>
      <h1 class="t-d3 text-ink m-0">{{ sign.title }}</h1>
      <p class="t-body-m text-ink m-0">{{ sign.detail }}</p>
      <p class="t-mono-s text-ink-2 m-0">{{ sign.owner }} · {{ sign.expires }}</p>
      <UiButton icon="userPlus" class="self-start" @click="open = true">Tawarkan bantuan</UiButton>
    </UiCard>
  </AutoSkeleton>
  <RequestHelpModal :open="open" :helper="helpers[0]" @close="open = false" @sent="open = false" />
</template>
