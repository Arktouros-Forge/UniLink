<script setup>
import { teamRequests as copy } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "student", access: "student", title: "Permintaan bergabung" });

const route = useRoute();
const api = useApi();
const { data: team, refresh: refreshTeam } = await useApiData(`team-${route.params.id}`, `/student/teams/${route.params.id}`, {
  default: () => ({ name: "", members: [], maxMembers: 1, acceptedCount: 0 }),
});
const { data: rows, pending, refresh } = await useApiData(`team-requests-${route.params.id}`, `/student/teams/${route.params.id}/requests`, { default: () => [] });

const capacity = computed(() => team.value.maxMembers ?? team.value.acceptedCount);
const full = computed(() => team.value.acceptedCount >= capacity.value);
const accepted = computed(() => team.value.members.filter((member) => member.status === "accepted"));

const respond = (decision, message) =>
  useAction(
    async (item) => {
      await api.patch(`/student/teams/${route.params.id}/members/${item.userId}`, { decision });
      await Promise.all([refresh(), refreshTeam()]);
    },
    { success: (item) => (message ? `${item?.fullName ?? ""} ${message}`.trim() : "") },
  );
const accept = respond("accept", copy.accepted);
const decline = respond("decline", copy.declined);
</script>

<template>
  <PageBack :to="`/student/teams/${route.params.id}`">{{ team.name }}</PageBack>
  <PageHeading :title="copy.back" :text="copy.text" />
  <AutoSkeleton :loading="pending" id="join-requests">
    <DetailLayout>
      <div class=":uno: flex flex-col gap-4">
        <UiCard v-for="item in rows" :key="item.memberId" class=":uno: flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class=":uno: flex gap-4 min-w-0">
            <UiAvatar :name="item.fullName" :size="40" />
            <div class=":uno: flex flex-col gap-1 min-w-0">
              <p class=":uno: t-label text-ink m-0">{{ item.fullName }}</p>
              <p class=":uno: t-body-s text-ink-2 m-0">{{ item.major }} · Angkatan {{ item.year }} · {{ formatDate(item.requestedAt) }}</p>
              <p v-if="item.bio" class=":uno: t-body-s text-ink m-0">{{ item.bio }}</p>
              <div class=":uno: flex flex-wrap gap-2 pt-1"><UiChip v-for="skill in item.skills" :key="skill.id" tone="blue">{{ skill.name }}</UiChip></div>
            </div>
          </div>
          <div class=":uno: flex gap-3 shrink-0">
            <UiButton variant="secondary" @click="decline.run(item)">{{ copy.decline }}</UiButton>
            <UiButton icon="check" :disabled="full" @click="accept.run(item)">{{ copy.accept }}</UiButton>
          </div>
        </UiCard>
        <UiEmpty v-if="!rows.length" :title="copy.emptyTitle" :text="copy.emptyText" icon="users" />
      </div>
      <template #aside>
        <UiCard class=":uno: flex flex-col gap-3">
          <h2 class=":uno: t-d4 text-ink m-0">{{ copy.capacity }}</h2>
          <UiProgress :value="team.acceptedCount" :max="capacity" :label="full ? copy.full : `${capacity - team.acceptedCount} slot tersisa`" :tone="full ? 'success' : 'blue'" />
          <RosterSlots :members="accepted.map((member) => ({ id: member.userId, fullName: member.fullName }))" :capacity="capacity" />
        </UiCard>
      </template>
    </DetailLayout>
  </AutoSkeleton>
</template>
