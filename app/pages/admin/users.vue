<script setup>
import { adminUsers } from "@app/constants/mock/people.json";
import { user as schema } from "@app/constants/forms.json";
import { userFilters } from "@app/constants/options.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth" });
const { pending } = useMock("admin-users", { rows: adminUsers });
const rows = ref(adminUsers.map((item) => ({ ...item })));
const filter = ref("all");
const shown = computed(() => rows.value.filter((item) => filter.value === "all" || item.status === filter.value));
const columns = [
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "cohort", label: "Angkatan" },
  { key: "status", label: "Status", chip: true },
];
const save = (row) => (rows.value = rows.value.map((item) => (item.id === row.id ? row : item)));
const remove = (row) => (rows.value = rows.value.map((item) => (item.id === row.id ? { ...item, status: item.status === "blocked" ? "active" : "blocked" } : item)));
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiTabs v-model="filter" :items="userFilters" />
    <AdminCrud id="admin-users-table" title="Pengguna" text="Blokir atau buka blokir akun." :columns="columns" :rows="shown" :schema="schema" :loading="pending" @save="save" @remove="remove" />
  </div>
</template>
