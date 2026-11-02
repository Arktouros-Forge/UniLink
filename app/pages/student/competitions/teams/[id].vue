<script setup>
import { teams } from "@app/constants/mock/competitions.json";
import { report as reportSchema } from "@app/constants/forms.json";
import { useAuthStore } from "@app/stores/auth";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const route = useRoute();
const auth = useAuthStore();
const team = computed(() => teams.find((entry) => entry.id === Number(route.params.id)) || teams[0]);
const { pending } = useMock(`team-${route.params.id}`, { team: team.value });
const requests = ref([...team.value.requests]);
const isLeader = computed(() => team.value.leader === auth.user.name);
const reportOpen = ref(false);
const decide = (id) => (requests.value = requests.value.filter((item) => item.id !== id));
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[800px]">
    <NuxtLink :to="`/student/competitions/${team.competition}`" class="btn-ghost self-start"><span class="i-keyline-icons-arrow-left" />Kompetisi</NuxtLink>
    <AutoSkeleton :loading="pending" id="team-detail">
      <div class="card flex flex-col gap-4">
        <div class="flex items-center justify-between gap-2"><h1 class="type-h2">{{ team.name }}</h1><UiChip tone="green">{{ team.members.length }}/{{ team.max }}</UiChip></div>
        <p class="type-body">{{ team.idea }}</p>
        <div class="flex flex-col gap-2">
          <div v-for="member in team.members" :key="member" class="flex items-center gap-3"><UiAvatar :name="member" size="size-9" /><span class="type-label">{{ member }}</span><UiChip v-if="member === team.leader" tone="blue">Ketua</UiChip></div>
        </div>
        <div class="flex gap-3">
          <button v-if="!isLeader" class="btn-primary">Ajukan bergabung</button>
          <button v-else class="btn-secondary" @click="reportOpen = true">Laporkan hasil</button>
        </div>
      </div>
    </AutoSkeleton>
    <template v-if="isLeader">
      <h2 class="type-h3">Permintaan bergabung</h2>
      <div v-for="item in requests" :key="item.id" class="card !p-4 flex items-center gap-3">
        <UiAvatar :name="item.name" /><div class="flex-1"><p class="type-label">{{ item.name }}</p><p class="type-meta">{{ item.skill }}</p></div>
        <button class="btn-primary btn-sm" @click="decide(item.id)">Terima</button>
        <button class="btn-secondary btn-sm" @click="decide(item.id)">Tolak</button>
      </div>
      <UiEmpty v-if="!requests.length" title="Tidak ada permintaan" icon="i-keyline-icons-users" />
    </template>
    <UiModal :open="reportOpen" title="Laporkan hasil" @close="reportOpen = false">
      <FieldsForm :schema="reportSchema" submit-label="Kirim laporan" cancel-label="Batal" @submit="reportOpen = false" @cancel="reportOpen = false" />
    </UiModal>
  </div>
</template>
