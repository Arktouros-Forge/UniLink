<script setup>
import { helpers } from "@app/constants/mock/people.json";
import { university } from "@app/constants/site.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth", title: "Profil teman belajar" });
const route = useRoute();
const helper = computed(() => helpers.find((item) => item.id === Number(route.params.id)) || helpers[0]);
const { pending } = useMock(`helper-${route.params.id}`, { helper: helper.value });
const open = ref(false);
</script>

<template>
  <UiButton to="/student/study-match" variant="link" icon="arrowLeft" class="self-start">Study Match</UiButton>
  <AutoSkeleton :loading="pending" id="helper-profile">
    <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
      <UiCard class="flex flex-col gap-5">
        <div class="flex items-center gap-4">
          <UiAvatar :name="helper.name" :size="72" />
          <div>
            <h1 class="t-d3 text-ink m-0">{{ helper.name }}</h1>
            <p class="t-body-s text-ink-2 m-0">{{ helper.major }} · Angkatan {{ helper.cohort }} · {{ university }}</p>
          </div>
        </div>
        <p class="t-body-m text-ink m-0">{{ helper.bio }}</p>
        <div class="flex flex-wrap gap-2"><UiChip v-for="skill in helper.skills" :key="skill" size="md">{{ skill }}</UiChip></div>
        <UiButton icon="userPlus" class="self-start" @click="open = true">Minta bantuan</UiButton>
      </UiCard>
      <UiCallout title="Nomor tetap privat" tone="info">Nomor WhatsApp hanya terbuka setelah permintaanmu diterima.</UiCallout>
    </div>
  </AutoSkeleton>
  <RequestHelpModal :open="open" :helper="helper" @close="open = false" @sent="open = false" />
</template>
