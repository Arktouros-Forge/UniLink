<script setup>
import { years } from "@app/constants/options.json";
import { admin } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

const copy = admin.userDetail;
definePageMeta({ layout: "admin", access: "admin", title: "Detail pengguna" });

const route = useRoute();
const api = useApi();
const { data: user, pending, refresh } = await useApiData(`admin-user-${route.params.id}`, `/admin/users/${route.params.id}`, {
  default: () => ({ fullName: "", skills: [], activity: {}, recentTeams: [], recentRequests: [] }),
});

const blocked = computed(() => user.value.status === "blocked");
const skills = ref(user.value.skills.map((skill) => skill.id));
watch(() => user.value.skills, (value) => (skills.value = value.map((skill) => skill.id)));
const tab = ref("overview");
const blockOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);

const tabs = computed(() => [
  { value: "overview", label: copy.tabs.overview },
  { value: "teams", label: copy.tabs.teams, count: user.value.recentTeams.length },
  { value: "requests", label: copy.tabs.requests, count: user.value.recentRequests.length },
]);
const fields = [
  { key: "fullName", label: "Nama lengkap", required: true },
  { key: "nim", label: "NIM", required: true },
  { key: "major", label: "Program studi" },
  { key: "year", label: "Angkatan", options: years.map(String), required: true },
  { key: "phone", label: "Nomor WhatsApp" },
  { key: "bio", label: "Bio", multiline: true },
];
const stats = computed(() => Object.entries(copy.stats).map(([key, label]) => ({ label, value: String(user.value.activity[key] ?? 0) })));
const meta = computed(() => [
  { icon: "mail", label: copy.email, value: user.value.email },
  { icon: "calendar", label: copy.joined, value: formatDate(user.value.createdAt), mono: true },
  { icon: "graduation", label: copy.year, value: String(user.value.year ?? "-") },
  { icon: "clock", label: copy.lastLogin, value: user.value.lastLoginAt ? formatDate(user.value.lastLoginAt) : "-", mono: true },
]);
const teamItems = computed(() => user.value.recentTeams.map((team) => ({ icon: "users", title: team.name, meta: team.competitionTitle, tone: "blue", status: team.status, statusTone: "success" })));
const requestItems = computed(() => user.value.recentRequests.map((item) => ({ icon: "userPlus", title: item.subject, meta: formatDate(item.createdAt), tone: "yellow", status: item.status, statusTone: item.status === "accepted" ? "success" : "yellow" })));

const status = useAction(
  async (body) => {
    await api.patch(`/admin/users/${route.params.id}/status`, body);
    blockOpen.value = false;
    await refresh();
  },
  { success: admin.saved },
);
const block = (reason) => status.run({ status: "blocked", reason });
const unblock = () => status.run({ status: "active" });
const save = useAction(
  async (values) => {
    await api.patch(`/admin/users/${route.params.id}`, { fullName: values.fullName, nim: values.nim, major: values.major || null, year: String(values.year), phone: values.phone, bio: values.bio || null });
    editOpen.value = false;
    await refresh();
  },
  { success: copy.updated },
);
const saveSkills = useAction(
  async () => {
    await api.patch(`/admin/users/${route.params.id}`, { skills: skills.value });
    await refresh();
  },
  { success: copy.skillsSaved },
);
const remove = useAction(
  async () => {
    await api.del(`/admin/users/${route.params.id}`);
    deleteOpen.value = false;
    await navigateTo("/admin/users");
  },
  { success: "Pengguna dihapus." },
);
</script>

<template>
  <PageBack to="/admin/users">{{ copy.back }}</PageBack>
  <AutoSkeleton :loading="pending" id="admin-user-detail">
    <DetailLayout>
      <UiCard class=":uno: flex flex-col gap-5">
        <ProfileHeader :name="user.fullName" :meta="`${user.email} · Angkatan ${user.year ?? '-'}`" :size="56">
          <UiChip :tone="blocked ? 'danger' : 'success'" size="md">{{ blocked ? admin.users.blocked : admin.users.active }}</UiChip>
          <template #actions>
            <UiButton variant="secondary" icon="edit" @click="editOpen = true">{{ copy.edit }}</UiButton>
            <UiButton v-if="blocked" variant="secondary" icon="check" @click="unblock">Buka blokir</UiButton>
            <UiButton v-else variant="danger" icon="ban" @click="blockOpen = true">Blokir</UiButton>
          </template>
        </ProfileHeader>
        <UiCallout v-if="blocked && user.blockedReason" :title="copy.reasonTitle" tone="info">{{ user.blockedReason }}</UiCallout>
        <StatStrip :items="stats" />
      </UiCard>

      <UiCard class=":uno: flex flex-col gap-4">
        <UiTabs v-model="tab" :items="tabs" />
        <template v-if="tab === 'overview'">
          <h2 class=":uno: t-d4 text-ink m-0">{{ copy.skills }}</h2>
          <SkillPicker v-model="skills" />
          <div class=":uno: flex"><UiButton icon="check" size="sm" :loading="saveSkills.pending.value" @click="saveSkills.run()">{{ copy.saveSkills }}</UiButton></div>
        </template>
        <ActivityList v-else-if="tab === 'teams'" :items="teamItems" :empty="copy.emptyTeams" />
        <ActivityList v-else :items="requestItems" :empty="copy.emptyRequests" />
      </UiCard>

      <template #aside>
        <UiCard class=":uno: flex flex-col gap-4"><h2 class=":uno: t-d4 text-ink m-0">{{ copy.info }}</h2><MetaList :items="meta" /></UiCard>
        <UiCard class=":uno: flex flex-col gap-3">
          <h2 class=":uno: t-d4 text-ink m-0">{{ copy.danger }}</h2>
          <p class=":uno: t-body-s text-ink-2 m-0">{{ copy.dangerText }}</p>
          <UiButton variant="dangerLink" icon="trash" class=":uno: self-start" @click="deleteOpen = true">{{ copy.delete }}</UiButton>
        </UiCard>
      </template>
    </DetailLayout>
  </AutoSkeleton>
  <ReasonModal :open="blockOpen" :title="admin.users.blockTitle" :text="`${user.fullName} tidak akan bisa masuk atau mengirim permintaan.`" :label="admin.users.blockLabel" :action="admin.users.block" @close="blockOpen = false" @confirm="block" />
  <EntityModal :open="editOpen" :title="copy.editTitle" :fields="fields" :initial="{ fullName: user.fullName, nim: user.nim, major: user.major, year: user.year, phone: user.phone, bio: user.bio }" :pending="save.pending.value" :errors="save.fieldErrors.value" @close="editOpen = false" @save="save.run" />
  <ConfirmModal :open="deleteOpen" :title="copy.deleteTitle" :text="copy.deleteText" action="Hapus" @close="deleteOpen = false" @confirm="remove.run()" />
</template>
