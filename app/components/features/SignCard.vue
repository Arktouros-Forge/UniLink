<script setup>
import { useReferenceStore } from "@app/stores/reference";
import { useUsersStore } from "@app/stores/users";
import { formatDate } from "@app/utils/format";

defineProps({
  sign: { type: Object, required: true },
});

const reference = useReferenceStore();
const users = useUsersStore();
</script>

<template>
  <AppCard class="grid gap-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <AppAvatar :name="users.byId[sign.userId]?.fullName" size="sm" />
        <span class="type-small font-medium">{{ users.byId[sign.userId]?.fullName }}</span>
      </div>
      <StatusChip group="signStatus" :value="sign.status" />
    </div>
    <h3 class="type-h3">{{ sign.title }}</h3>
    <p class="type-small text-mute">{{ sign.description }}</p>
    <div class="flex flex-wrap items-center gap-2">
      <AppChip tone="brand">{{ reference.skillsById[sign.skillId]?.name }}</AppChip>
      <span v-if="sign.preferredTime" class="type-meta text-mute">{{ sign.preferredTime }}</span>
      <span class="type-meta text-mute">Berakhir {{ formatDate(sign.expiresAt) }}</span>
    </div>
    <div class="flex flex-wrap gap-2"><slot /></div>
  </AppCard>
</template>
