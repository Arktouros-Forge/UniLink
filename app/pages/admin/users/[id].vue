<script setup>
import { users } from "@app/constants/mock/admin.json";
import { useMock } from "@app/composables/useMock";

definePageMeta({ layout: "admin", middleware: "auth", title: "Detail pengguna" });
const route = useRoute();
const user = computed(() => users.find((item) => item.id === Number(route.params.id)) || users[0]);
const { pending } = useMock(`admin-user-${route.params.id}`, { user: user.value });
const blocked = ref(user.value.status === "Diblokir");
</script>

<template>
  <UiButton to="/admin/users" variant="link" icon="arrowLeft" class="self-start">Pengguna</UiButton>
  <AutoSkeleton :loading="pending" id="admin-user-detail">
    <div class="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
      <UiCard class="flex flex-col gap-5">
        <div class="flex items-center gap-4">
          <UiAvatar :name="user.name" :size="56" />
          <div class="flex-1"><h1 class="t-d3 text-ink m-0">{{ user.name }}</h1><p class="t-body-s text-ink-2 m-0">{{ user.email }} · Angkatan {{ user.cohort }}</p></div>
          <UiChip :tone="blocked ? 'danger' : 'success'" size="md">{{ blocked ? "Diblokir" : "Aktif" }}</UiChip>
        </div>
        <UiDivider />
        <p class="t-mono-s text-ink-2 m-0">Bergabung · {{ user.joined }}</p>
        <div class="flex gap-3">
          <UiButton :variant="blocked ? 'secondary' : 'danger'" :icon="blocked ? 'check' : 'ban'" @click="blocked = !blocked">{{ blocked ? "Buka blokir" : "Blokir pengguna" }}</UiButton>
        </div>
      </UiCard>
      <UiCallout title="Catatan admin" tone="info">Pemblokiran mencegah pengguna masuk dan mengirim permintaan.</UiCallout>
    </div>
  </AutoSkeleton>
</template>
