<script setup>
import { helpers, skills } from "@app/constants/mock/people.json";
import { signs } from "@app/constants/mock/study.json";
import { statusTone, limits } from "@app/constants/options.json";
import { request as requestSchema, sign as signSchema } from "@app/constants/forms.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "student", middleware: "auth" });
const tab = ref("search");
const query = ref("");
const skill = ref("");
const { pending } = useMock("study-match", { helpers });
const target = ref(null);
const signOpen = ref(false);
const sent = ref(false);
const list = computed(() =>
  helpers.filter(
    (item) =>
      item.name.toLowerCase().includes(query.value.toLowerCase()) &&
      (!skill.value || item.skills.includes(skill.value)),
  ),
);
const send = () => {
  target.value = null;
  sent.value = true;
  setTimeout(() => (sent.value = false), 2500);
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHead title="Study Match" text="Cari teman belajar, atau pasang Help Sign dan biarkan mereka datang." meta="Dua arah">
      <NuxtLink to="/student/study-match/inbox" class="btn-secondary"><span class="i-keyline-icons-inbox" />Kotak masuk</NuxtLink>
      <button class="btn-primary" @click="signOpen = true"><span class="i-keyline-icons-megaphone" />Pasang Help Sign</button>
    </UiPageHead>
    <UiTabs v-model="tab" :items="[{ value: 'search', label: 'Cari bantuan' }, { value: 'signs', label: 'Help Sign saya' }]" />
    <div v-if="sent" class="card border-good flex gap-3"><span class="i-keyline-icons-circle-check text-2xl text-good" /><p class="type-label">Permintaan terkirim. Berlaku {{ limits.requestDays }} hari.</p></div>
    <template v-if="tab === 'search'">
      <div class="flex flex-col gap-3 md:flex-row">
        <div class="relative flex-1">
          <span class="i-keyline-icons-search absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input v-model="query" class="field pl-10" placeholder="Cari nama" />
        </div>
        <select v-model="skill" class="field md:max-w-[240px]">
          <option value="">Semua keahlian</option>
          <option v-for="item in skills" :key="item.id" :value="item.name">{{ item.name }}</option>
        </select>
      </div>
      <AutoSkeleton :loading="pending" id="study-match-list">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PersonCard v-for="item in list" :key="item.id" :item="item" @request="target = $event" />
        </div>
        <UiEmpty v-if="!list.length" title="Belum ada yang cocok" text="Coba keahlian lain atau pasang Help Sign." icon="i-keyline-icons-search" />
      </AutoSkeleton>
    </template>
    <template v-else>
      <AutoSkeleton :loading="pending" id="study-match-signs">
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="item in signs" :key="item.id" class="card flex flex-col gap-3">
            <div class="flex items-center justify-between gap-2">
              <UiChip tone="blue">{{ item.skill }}</UiChip>
              <UiChip :tone="statusTone[item.status].tone">{{ statusTone[item.status].label }}</UiChip>
            </div>
            <h3 class="type-h3">{{ item.title }}</h3>
            <p class="type-meta">{{ item.responses }} tanggapan · {{ item.expires }}</p>
          </div>
        </div>
      </AutoSkeleton>
    </template>
    <UiModal :open="!!target" :title="`Ajak ${target?.name || ''} belajar`" :text="`Berlaku ${limits.requestDays} hari. Batas ${limits.perDay} per hari.`" @close="target = null">
      <FieldsForm :schema="requestSchema" submit-label="Kirim permintaan" cancel-label="Batal" @submit="send" @cancel="target = null" />
    </UiModal>
    <UiModal :open="signOpen" title="Pasang Help Sign" :text="`Aktif ${limits.signDays} hari. Maksimal ${limits.activeSigns} aktif.`" @close="signOpen = false">
      <FieldsForm :schema="signSchema" submit-label="Pasang" cancel-label="Batal" @submit="signOpen = false" @cancel="signOpen = false" />
    </UiModal>
  </div>
</template>
