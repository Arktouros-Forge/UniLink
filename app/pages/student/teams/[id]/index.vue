<script setup>
import { team as extras } from "@app/constants/guidance.json";
import { teamDetail as copy, teams as teamCopy } from "@app/constants/student.json";
import { useAuthStore } from "@app/stores/auth";
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "student", access: "student", title: "Detail tim" });

const route = useRoute();
const api = useApi();
const auth = useAuthStore();
const { data: team, pending, refresh } = await useApiData(`team-${route.params.id}`, `/student/teams/${route.params.id}`, {
  default: () => ({ name: "", members: [], maxMembers: 1 }),
});

const isOwner = computed(() => team.value.creatorId === auth.user?.id);
const reportOpen = ref(false);
const finished = computed(() => Boolean(team.value) && Boolean(team.value.competitionDeadline) && new Date(team.value.competitionDeadline) <= new Date());
const editOpen = ref(false);
const leaveOpen = ref(false);
const deleteOpen = ref(false);

const accepted = computed(() => team.value.members.filter((member) => member.status === "accepted"));
const capacity = computed(() => team.value.maxMembers ?? accepted.value.length);
const slotsLeft = computed(() => capacity.value - accepted.value.length);
const members = computed(() =>
  accepted.value.map((member) => ({ ...member, id: member.userId, role: member.isCreator ? teamCopy.owner : teamCopy.memberRole, you: member.userId === auth.user?.id })),
);
const owner = computed(() => members.value.find((member) => member.isCreator));
const timeline = computed(() => extras.timeline);

const saveResult = useAction(
  async (value) => {
    await api.patch(`/student/teams/${route.params.id}/result`, { result: value });
    reportOpen.value = false;
    await refresh();
  },
  { success: copy.resultSaved },
);
const saveTeam = useAction(
  async (payload) => {
    await api.patch(`/student/teams/${route.params.id}`, payload);
    editOpen.value = false;
    await refresh();
  },
  { success: copy.updated },
);
const leave = useAction(
  async () => {
    await api.del(`/student/teams/${route.params.id}/leave`);
    leaveOpen.value = false;
    await navigateTo("/student/teams");
  },
  { success: copy.left },
);
const remove = useAction(
  async () => {
    await api.del(`/student/teams/${route.params.id}`);
    deleteOpen.value = false;
    await navigateTo("/student/teams");
  },
  { success: copy.deleted },
);
</script>

<template>
  <PageBack to="/student/teams">{{ copy.back }}</PageBack>
  <PageHeading :title="team.name" :text="team.competitionTitle">
    <UiChip size="md" tone="success">{{ isOwner ? copy.youOwner : copy.youMember }}</UiChip>
    <UiButton v-if="isOwner" variant="secondary" icon="edit" @click="editOpen = true">{{ copy.edit }}</UiButton>
  </PageHeading>
  <AutoSkeleton :loading="pending" id="team-detail">
    <DetailLayout>
      <UiCard class=":uno: flex flex-col gap-4">
        <p class=":uno: t-body-m text-ink m-0">{{ team.description }}</p>
        <UiProgress :value="accepted.length" :max="capacity" :label="slotsLeft ? `${slotsLeft} ${copy.slots}` : copy.full" :tone="slotsLeft ? 'blue' : 'success'" />
        <UiDivider />
        <div class=":uno: flex items-center justify-between"><h3 class=":uno: t-d4 text-ink m-0">{{ copy.membersTitle }}</h3><RosterSlots :members="members" :capacity="capacity" :size="28" /></div>
        <MemberRow v-for="member in members" :key="member.id" :item="member" />
      </UiCard>

      <UiCard class=":uno: flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class=":uno: flex flex-col gap-2">
          <h2 class=":uno: t-d4 text-ink m-0">{{ copy.resultTitle }}</h2>
          <p class=":uno: t-body-s text-ink-2 m-0">{{ team.result === "unknown" ? extras.resultNote : copy.resultLabels[team.result] }}</p>
        </div>
        <UiButton variant="secondary" icon="flag" :disabled="!finished" @click="reportOpen = true">{{ copy.report }}</UiButton>
      </UiCard>

      <UiCard v-if="isOwner" class=":uno: flex flex-col gap-3">
        <h2 class=":uno: t-d4 text-ink m-0">{{ copy.zone }}</h2>
        <p class=":uno: t-body-s text-ink-2 m-0">{{ copy.zoneText }}</p>
        <UiButton variant="dangerLink" icon="trash" class=":uno: self-start" @click="deleteOpen = true">{{ copy.delete }}</UiButton>
      </UiCard>

      <template #aside>
        <ContactCard v-if="owner" :name="owner.fullName" :url="owner.contact?.whatsappUrl" :phone="owner.contact?.phone" :locked-text="copy.lockedText" />
        <UiCard v-if="isOwner" class=":uno: flex flex-col gap-3">
          <h2 class=":uno: t-d4 text-ink m-0">{{ copy.requestsTitle }}</h2>
          <p class=":uno: t-body-s text-ink-2 m-0">{{ copy.requestsText }}</p>
          <UiButton variant="secondary" icon-end="arrowRight" :to="`/student/teams/${team.id}/requests`" class=":uno: self-start">{{ copy.open }}{{ team.pendingCount ? ` (${team.pendingCount})` : "" }}</UiButton>
        </UiCard>
        <UiCard class=":uno: flex flex-col gap-2"><h2 class=":uno: t-d4 text-ink m-0">{{ copy.journey }}</h2><UiTimeline :items="timeline" /></UiCard>
        <UiCard class=":uno: flex flex-col gap-3">
          <p class=":uno: t-mono-s text-ink m-0">{{ copy.deadline }} · {{ formatDate(team.competitionDeadline) }}</p>
          <UiButton variant="link" icon="trophy" :to="`/student/competitions/${team.competitionId}`" class=":uno: self-start">{{ copy.viewCompetition }}</UiButton>
          <UiButton v-if="!isOwner" variant="dangerLink" icon="logout" class=":uno: self-start" @click="leaveOpen = true">{{ copy.leave }}</UiButton>
        </UiCard>
        <UiCallout :title="copy.whatsappTitle">{{ copy.whatsappText }}</UiCallout>
      </template>
    </DetailLayout>
  </AutoSkeleton>
  <ResultReportModal :open="reportOpen" :pending="saveResult.pending.value" @close="reportOpen = false" @save="saveResult.run($event)" />
  <TeamFormModal :open="editOpen" :title="copy.edit" :initial="{ name: team.name, description: team.description, capacity: team.maxMembers }" :max-size="team.competitionMaxTeamSize ?? 50" :min-size="accepted.length" :pending="saveTeam.pending.value" :errors="saveTeam.fieldErrors.value" @close="editOpen = false" @save="saveTeam.run($event)" />
  <ConfirmModal :open="leaveOpen" :title="copy.leaveTitle" :text="copy.leaveText" :action="copy.leave" @close="leaveOpen = false" @confirm="leave.run()" />
  <ConfirmModal :open="deleteOpen" :title="copy.deleteTitle" :text="copy.deleteText" :action="copy.delete" @close="deleteOpen = false" @confirm="remove.run()" />
</template>
