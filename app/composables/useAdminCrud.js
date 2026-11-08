import { admin } from "@app/constants/student.json";

export const useAdminCrud = (key, endpoint, { listKey = "items", toPayload = (values) => values, toRow = (row) => row } = {}) => {
  const api = useApi();
  const search = ref("");
  const debounced = useDebounced(search);
  const page = ref(1);
  const editing = ref(null);
  const modalOpen = ref(false);
  const removing = ref(null);

  const request = useApiData(key, endpoint, {
    query: () => ({ q: debounced.value || undefined, page: page.value, limit: admin.pageSize }),
    default: () => ({ [listKey]: [], pagination: { total: 0 } }),
    watch: [debounced, page],
  });
  const { data, pending, status, refresh } = request;
  watch(debounced, () => (page.value = 1));

  const rows = computed(() => (data.value[listKey] ?? []).map(toRow));
  const total = computed(() => data.value.pagination?.total ?? 0);

  const add = () => {
    editing.value = {};
    modalOpen.value = true;
  };
  const edit = (row) => {
    editing.value = row;
    modalOpen.value = true;
  };

  const saveAction = useAction(
    async (values) => {
      const payload = toPayload(values);
      if (values.id) await api.patch(`${endpoint}/${values.id}`, payload);
      else await api.post(endpoint, payload);
      modalOpen.value = false;
      await refresh();
    },
    { success: admin.saved },
  );
  const removeAction = useAction(
    async () => {
      await api.del(`${endpoint}/${removing.value.id}`);
      removing.value = null;
      await refresh();
    },
    { success: admin.removed },
  );

  return {
    request,
    pending,
    status,
    refresh,
    rows,
    total,
    page,
    search,
    editing,
    modalOpen,
    removing,
    add,
    edit,
    save: saveAction.run,
    saving: saveAction.pending,
    errors: saveAction.fieldErrors,
    confirmRemove: removeAction.run,
    removingPending: removeAction.pending,
  };
};
