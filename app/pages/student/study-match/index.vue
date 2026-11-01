<script setup>
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { useReferenceStore } from "@app/stores/reference";
import { useAuthStore } from "@app/stores/auth";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "student" });

const studyMatch = useStudyMatchStore();
const reference = useReferenceStore();
const auth = useAuthStore();
const ui = useUiStore();

const tab = ref("find");
const skillId = ref("");
const query = ref("");
const signModal = ref(false);
const offerModal = ref(false);
const offerTarget = ref(null);

const tabs = computed(() => [
  { value: "find", label: "Cari bantuan" },
  { value: "board", label: "Papan Help Sign", count: studyMatch.openSigns.filter((sign) => sign.userId !== auth.currentId).length },
  { value: "mine", label: "Help Sign saya", count: studyMatch.mySigns.length },
]);

const helpers = computed(() => studyMatch.helpersFor(skillId.value ? [skillId.value] : [], query.value));
const boardSigns = computed(() => studyMatch.openSigns.filter((sign) => sign.userId !== auth.currentId));

const saveSign = (data) => {
  studyMatch.postSign(data);
  signModal.value = false;
  ui.notify("Help Sign dipasang", "good");
};

const startOffer = (sign) => {
  offerTarget.value = sign;
  offerModal.value = true;
};

const saveOffer = ({ description }) => {
  studyMatch.offerHelp({ signId: offerTarget.value.id, message: description });
  offerModal.value = false;
  ui.notify("Tawaran bantuan terkirim", "good");
};
</script>

<template>
  <div>
    <PageHeading title="Study Match" text="Cari teman belajar, atau pasang Help Sign.">
      <AppButton to="/student/study-match/inbox" variant="secondary">Kotak masuk</AppButton>
      <AppButton to="/student/study-match/history" variant="ghost">Riwayat</AppButton>
    </PageHeading>

    <AppTabs v-model="tab" :items="tabs" class="mb-6" />

    <section v-if="tab === 'find'" class="grid gap-4">
      <div class="grid gap-3 sm:grid-cols-2">
        <AppInput v-model="skillId" as="select" :options="[{ value: '', label: 'Semua keahlian' }, ...reference.skillOptions]" />
        <AppInput v-model="query" placeholder="Cari nama" />
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <HelperCard v-for="item in helpers" :key="item.user.id" :user="item.user" :matches="item.matches" />
      </div>
      <AppEmpty v-if="!helpers.length" title="Belum ada yang cocok" text="Coba keahlian lain, atau pasang Help Sign." />
    </section>

    <section v-else-if="tab === 'board'" class="grid gap-4 md:grid-cols-2">
      <SignCard v-for="sign in boardSigns" :key="sign.id" :sign="sign">
        <AppButton size="sm" @click="startOffer(sign)">Tawarkan bantuan</AppButton>
      </SignCard>
      <AppEmpty v-if="!boardSigns.length" title="Belum ada Help Sign" class="md:col-span-2" />
    </section>

    <section v-else class="grid gap-4">
      <div><AppButton @click="signModal = true"><span class="i-keyline-plus" />Pasang Help Sign</AppButton></div>
      <div class="grid gap-4 md:grid-cols-2">
        <SignCard v-for="sign in studyMatch.mySigns" :key="sign.id" :sign="sign">
          <AppButton v-if="sign.status === 'open'" variant="secondary" size="sm" @click="studyMatch.closeSign(sign.id)">Tutup</AppButton>
        </SignCard>
      </div>
      <AppEmpty v-if="!studyMatch.mySigns.length" title="Belum ada Help Sign" text="Pasang satu agar teman bisa menawarkan bantuan." />
    </section>

    <AppModal v-model="signModal" title="Pasang Help Sign"><SignForm @save="saveSign" /></AppModal>
    <AppModal v-model="offerModal" title="Tawarkan bantuan">
      <RequestForm :subject="offerTarget?.title" submit-label="Kirim tawaran" @save="saveOffer" />
    </AppModal>
  </div>
</template>
