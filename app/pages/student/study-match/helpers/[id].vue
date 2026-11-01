<script setup>
import { useUsersStore } from "@app/stores/users";
import { useReferenceStore } from "@app/stores/reference";
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const route = useRoute();
const users = useUsersStore();
const reference = useReferenceStore();
const studyMatch = useStudyMatchStore();
const ui = useUiStore();

const user = computed(() => users.byId[route.params.id]);
const modal = ref(false);

if (!user.value) throw createError({ statusCode: 404, statusMessage: "Pengguna tidak ditemukan" });

const save = (data) => {
  studyMatch.send({ helperId: user.value.id, ...data });
  modal.value = false;
  ui.notify("Permintaan terkirim", "good");
};
</script>

<template>
  <div class="grid max-w-2xl gap-6">
    <NuxtLink to="/student/study-match" class="type-small flex items-center gap-1 text-mute"><span class="i-keyline-arrow-left" />Kembali</NuxtLink>
    <AppCard strong class="grid gap-4">
      <div class="flex items-center gap-4">
        <AppAvatar :name="user.fullName" size="lg" />
        <div>
          <h1 class="type-h1">{{ user.fullName }}</h1>
          <p class="type-small text-mute">@{{ user.username }} · Angkatan {{ user.year }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <AppChip v-for="id in user.skillIds" :key="id" tone="brand">{{ reference.skillsById[id]?.name }}</AppChip>
      </div>
      <a v-if="user.website" :href="user.website" target="_blank" rel="noopener" class="type-small flex items-center gap-1 text-brand-blue">
        <span class="i-keyline-globe" />{{ user.website }}
      </a>
      <div>
        <AppButton :disabled="!studyMatch.canSend" @click="modal = true">Kirim permintaan</AppButton>
        <p v-if="!studyMatch.canSend" class="type-small mt-2 text-brand-red">Batas permintaan tertunda tercapai.</p>
      </div>
    </AppCard>
    <AppModal v-model="modal" title="Kirim permintaan"><RequestForm @save="save" /></AppModal>
  </div>
</template>
