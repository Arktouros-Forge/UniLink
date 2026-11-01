<script setup>
import { useUsersStore } from "@app/stores/users";

const props = defineProps({
  member: { type: Object, required: true },
});

const users = useUsersStore();
const user = computed(() => users.byId[props.member.userId]);
</script>

<template>
  <div class="flex items-center justify-between gap-3 py-2">
    <div class="flex items-center gap-3">
      <AppAvatar :name="user?.fullName" size="sm" />
      <div>
        <p class="type-small font-medium">{{ user?.fullName }}</p>
        <p class="type-meta text-mute">@{{ user?.username }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <AppChip :tone="member.status === 'accepted' ? 'good' : 'yellow'">{{ member.status === "accepted" ? "Anggota" : "Menunggu" }}</AppChip>
      <slot />
    </div>
  </div>
</template>
