<script setup>
import { helpers } from "@app/constants/mock/people.json";
import { request as requestSchema } from "@app/constants/forms.json";
import { limits } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const route = useRoute();
const helper = computed(() => helpers.find((item) => item.id === Number(route.params.id)) || helpers[0]);
const { pending } = useMock(`helper-${route.params.id}`, { helper: helper.value });
const open = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[720px]">
    <NuxtLink to="/student/study-match" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />Study Match</NuxtLink>
    <AutoSkeleton :loading="pending" id="helper-detail">
      <div class="card flex flex-col gap-5">
        <div class="flex items-center gap-4">
          <UiAvatar :name="helper.name" size="size-16" />
          <div class="flex-1"><h1 class="type-h2">{{ helper.name }}</h1><p class="type-small">{{ helper.major }} · Angkatan {{ helper.cohort }}</p></div>
          <UiChip tone="yellow">{{ helper.match }}%</UiChip>
        </div>
        <p class="type-body">{{ helper.bio }}</p>
        <div class="flex flex-wrap gap-2"><UiChip v-for="skill in helper.skills" :key="skill" tone="blue">{{ skill }}</UiChip></div>
        <button class="btn-primary btn-lg self-start" @click="open = true">Ajak belajar</button>
      </div>
    </AutoSkeleton>
    <UiModal :open="open" :title="`Ajak ${helper.name} belajar`" :text="`Berlaku ${limits.requestDays} hari.`" @close="open = false">
      <FieldsForm :schema="requestSchema" submit-label="Kirim permintaan" cancel-label="Batal" @submit="open = false" @cancel="open = false" />
    </UiModal>
  </div>
</template>
