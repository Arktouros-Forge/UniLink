<script setup>
import { useUsersStore } from "@app/stores/users";
import { useUiStore } from "@app/stores/ui";
import { formatDate } from "@app/utils/format";

definePageMeta({ layout: "admin" });

const users = useUsersStore();
const ui = useUiStore();
const query = ref("");
const blockModal = ref(false);
const target = ref(null);
const reason = ref("");

const columns = [
  { key: "fullName", label: "Nama" },
  { key: "nim", label: "NIM" },
  { key: "year", label: "Angkatan" },
  { key: "status", label: "Status" },
  { key: "lastLoginAt", label: "Terakhir masuk" },
  { key: "actions", label: "" },
];

const rows = computed(() => users.students.filter((user) => `${user.fullName} ${user.nim} ${user.username}`.toLowerCase().includes(query.value.toLowerCase())));

const startBlock = (user) => {
  target.value = user;
  reason.value = "";
  blockModal.value = true;
};

const confirmBlock = () => {
  users.block(target.value.id, reason.value);
  blockModal.value = false;
  ui.notify("Pengguna diblokir");
};
</script>

<template>
  <div>
    <PageHeading title="Pengguna" text="Kelola akun mahasiswa." />
    <AppInput v-model="query" placeholder="Cari nama, NIM, atau username" class="mb-4 max-w-sm" />
    <AppTable :columns="columns" :rows="rows">
      <template #fullName="{ row }">
        <div class="flex items-center gap-3">
          <AppAvatar :name="row.fullName" size="sm" />
          <div>
            <p class="font-medium">{{ row.fullName }}</p>
            <p class="type-meta text-mute">@{{ row.username }}</p>
          </div>
        </div>
      </template>
      <template #status="{ row }"><StatusChip group="userStatus" :value="row.status" /></template>
      <template #lastLoginAt="{ row }">{{ formatDate(row.lastLoginAt) }}</template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <AppButton v-if="row.status === 'blocked'" variant="secondary" size="sm" @click="users.unblock(row.id)">Buka blokir</AppButton>
          <AppButton v-else variant="secondary" size="sm" @click="startBlock(row)"><span class="i-keyline-ban" />Blokir</AppButton>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Hapus" @click="users.remove(row.id)"><span class="i-keyline-bin" /></button>
        </div>
      </template>
    </AppTable>
    <AppModal v-model="blockModal" title="Blokir pengguna">
      <form class="grid gap-4" @submit.prevent="confirmBlock">
        <p class="type-body text-mute">{{ target?.fullName }} tidak akan bisa masuk sampai blokir dibuka.</p>
        <AppInput v-model="reason" label="Alasan" as="textarea" :rows="3" required />
        <AppButton type="submit" variant="danger" block>Blokir</AppButton>
      </form>
    </AppModal>
  </div>
</template>
