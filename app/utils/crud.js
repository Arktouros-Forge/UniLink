export const createCrud = (list, prefix) => ({
  add(item) {
    const row = { id: `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`, ...item };
    list.value = [row, ...list.value];
    return row;
  },
  update(id, patch) {
    list.value = list.value.map((row) => (row.id === id ? { ...row, ...patch } : row));
  },
  remove(id) {
    list.value = list.value.filter((row) => row.id !== id);
  },
});

export const indexById = (list) => Object.fromEntries(list.map((row) => [row.id, row]));
