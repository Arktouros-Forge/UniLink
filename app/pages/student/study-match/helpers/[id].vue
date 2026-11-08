<script setup>
import { helper as extras } from "@app/constants/mock/detail.json";
import { university } from "@app/constants/site.json";
import { helperDetail as copy } from "@app/constants/student.json";

definePageMeta({ layout: "student", middleware: "auth", title: "Profil teman belajar" });

const route = useRoute();
const api = useApi();
const { data: helper, pending, refresh } = await useApiData(`helper-${route.params.id}`, `/student/users/${route.params.id}`, {
  default: () => ({ fullName: "", skills: [], stats: {}, relation: null, contact: null }),
});

const stats = computed(() => [
  { label: copy.stats.helped, value: String(helper.value.stats.helped ?? 0) },
  { label: copy.stats.teams, value: String(helper.value.stats.teams ?? 0) },
  { label: copy.stats.skills, value: String(helper.value.skills.length) },
  { label: copy.stats.year, value: String(helper.value.year ?? "") },
]);
const status = computed(() => helper.value.relation?.status ?? "none");
const open = ref(false);

const sent = async () => {
  open.value = false;
  await refresh();
};
const { run: cancel } = useAction(
  async () => {
    await api.patch(`/student/study-match/requests/${helper.value.relation.id}`, { action: "cancel" });
    await refresh();
  },
  { success: copy.cancelled },
);
</script>

<template>
  <PageBack to="/student/study-match">Study Match</PageBack>
  <AutoSkeleton :loading="pending" id="helper-profile">
    <DetailLayout>
      <UiCard class="flex flex-col gap-5">
        <ProfileHeader :name="helper.fullName" :meta="`${helper.major ?? ''} · Angkatan ${helper.year} · ${university}`">
          <UiChip tone="success" icon="clock">{{ extras.available }}</UiChip>
          <template #actions>
            <UiButton v-if="!['pending', 'accepted'].includes(status)" icon="userPlus" @click="open = true">Minta bantuan</UiButton>
            <template v-else-if="status === 'pending'"><UiChip tone="yellow" size="md">Menunggu jawaban</UiChip><UiButton variant="dangerLink" @click="cancel()">Batalkan</UiButton></template>
          </template>
        </ProfileHeader>
        <p class="t-body-m text-ink m-0">{{ helper.bio }}</p>
        <StatStrip :items="stats" />
        <div class="flex flex-col gap-2">
          <h2 class="t-d4 text-ink m-0">Keahlian</h2>
          <div class="flex flex-wrap gap-2"><UiChip v-for="skill in helper.skills" :key="skill.id" size="md">{{ skill.name }}</UiChip></div>
                  </div>
      </UiCard>

      
      <template #aside>
        <ContactCard :name="helper.fullName" :url="helper.contact?.whatsappUrl" />
        <UiCallout title="Etika meminta bantuan" tone="info"><ul class="m-0 pl-4 flex flex-col gap-1"><li v-for="rule in extras.guidelines" :key="rule">{{ rule }}</li></ul></UiCallout>
      </template>
    </DetailLayout>
  </AutoSkeleton>
  <RequestHelpModal :open="open" :helper="helper" @close="open = false" @sent="sent" />
</template>
