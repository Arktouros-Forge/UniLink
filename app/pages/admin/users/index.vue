<script setup>
import { admin } from "@app/constants/student.json";
import { formatDate } from "@app/utils/format";

const copy = admin.users;
definePageMeta({ layout: "admin", access: "admin", title: "Pengguna" });
const api = useApi();
const status = ref("all");
const statusOptions = [
  { value: "all", label: "Semua status" },
  { value: "active", label: copy.active },
  { value: "blocked", label: copy.blocked },
];
const columns = [
  { key: "fullName", label: "Nama", width: "1.2fr" },
  { key: "email", label: "Email", width: "1.4fr" },
  { key: "year", label: "Angkatan" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Bergabung" },
];
const { query: search, debounced, page } = useSearchPage([status]);
const request = useApiData("admin-users", "/admin/users", {
  query: () => ({ q: debounced.value || undefined, status: status.value === "all" ? undefined : status.value, role: "student", page: page.value, limit: admin.pageSize }),
  default: () => ({ users: [], pagination: { total: 0 } }),
  watch: [() => debounced.value, status, () => page.value],
});
const { data, pending, status: fetchStatus, refresh } = request;
await request;

const target = ref(null);
const blockTarget = ref(null);
const toggle = useAction(
  async (payload) => {
    await api.patch(`/admin/users/${payload.user.id}/status`, payload.body);
    blockTarget.value = null;
    await refresh();
  },
  { success: (payload) => (payload.body.status === "blocked" ? copy.blockedToast : copy.unblockedToast) },
);
</script>

<template>
  <AdminList
    id="admin-users-table" v-model:search="search" v-model:page="page" :title="copy.title" :text="copy.text" :noun="copy.noun" :columns="columns"
    :remove-label="copy.block" :rows="data.users" :total="data.pagination.total" :loading="pending" :failed="fetchStatus === 'error'"
    @edit="navigateTo(`/admin/users/${$event.id}`)" @remove="blockTarget = $event" @retry="refresh"
  >
    <template #filters><FilterSelect v-model="status" :options="statusOptions" icon="filter" /></template>
    <template #cell-status="{ value }"><UiChip :tone="value === 'active' ? 'success' : 'danger'" size="md">{{ value === "active" ? copy.active : copy.blocked }}</UiChip></template>
    <template #cell-createdAt="{ value }"><span class=":uno: t-mono-s">{{ formatDate(value) }}</span></template>
    <template #cell-year="{ value }">{{ value ?? "-" }}</template>
  </AdminList>
  <ReasonModal :open="!!blockTarget" :title="copy.blockTitle" :label="copy.blockLabel" :action="copy.block" @close="blockTarget = null" @confirm="toggle.run({ user: blockTarget, body: { status: 'blocked', reason: $event } })" />
</template>
