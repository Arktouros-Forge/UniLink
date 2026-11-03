import { useMock } from "@app/composables/useMock";

export const useAdminCrud = (key, source, fields) => {
  const { pending, status, refresh } = useMock(key, source, 800);
  const rows = ref(source.map((item) => ({ ...item })));
  const search = ref("");
  const editing = ref(null);
  const modalOpen = ref(false);
  const removing = ref(null);

  const shown = computed(() => rows.value.filter((row) => JSON.stringify(row).toLowerCase().includes(search.value.toLowerCase())));
  const add = () => {
    editing.value = {};
    modalOpen.value = true;
  };
  const edit = (row) => {
    editing.value = row;
    modalOpen.value = true;
  };
  const save = (values) => {
    rows.value = values.id ? rows.value.map((row) => (row.id === values.id ? values : row)) : [{ ...values, id: Date.now(), created: "02 Nov 2026" }, ...rows.value];
    modalOpen.value = false;
  };
  const confirmRemove = () => {
    rows.value = rows.value.filter((row) => row.id !== removing.value.id);
    removing.value = null;
  };

  return { pending, status, refresh, rows, shown, search, editing, modalOpen, removing, fields, add, edit, save, confirmRemove };
};
