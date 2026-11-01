<script setup>
import { useCompetitionsStore } from "@app/stores/competitions";
import { formatDate } from "@app/utils/format";
import { useUiStore } from "@app/stores/ui";

definePageMeta({ layout: "admin" });

const competitions = useCompetitionsStore();
const ui = useUiStore();
const modal = ref(false);
const editing = ref(null);

const columns = [
  { key: "title", label: "Kompetisi" },
  { key: "host", label: "Penyelenggara" },
  { key: "deadline", label: "Batas" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const open = (row = null) => {
  editing.value = row;
  modal.value = true;
};

const save = (data) => {
  if (editing.value) competitions.update(editing.value.id, data);
  else competitions.add({ ...data, createdByRole: "admin" });
  modal.value = false;
  ui.notify("Kompetisi disimpan", "good");
};
</script>

<template>
  <div>
    <PageHeading title="Kompetisi" text="Kelola kompetisi yang tampil di aplikasi.">
      <AppButton @click="open()"><span class="i-keyline-plus" />Tambah</AppButton>
    </PageHeading>
    <AppTable :columns="columns" :rows="competitions.competitions">
      <template #deadline="{ row }">{{ formatDate(row.deadline) }}</template>
      <template #status="{ row }"><StatusChip group="competitionStatus" :value="row.status" /></template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Ubah" @click="open(row)"><span class="i-keyline-pen" /></button>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Hapus" @click="competitions.remove(row.id)"><span class="i-keyline-bin" /></button>
        </div>
      </template>
    </AppTable>
    <AppModal v-model="modal" :title="editing ? 'Ubah kompetisi' : 'Tambah kompetisi'">
      <CompetitionForm :key="editing?.id ?? 'new'" :initial="editing ?? {}" @save="save" />
    </AppModal>
  </div>
</template>
