import { defineStore } from "pinia";
import { ref } from "vue";
import tasksData from "@app/constants/mock/tasks.json";
import { createCrud } from "@app/utils/crud";

const weight = { high: 0, medium: 1, low: 2 };

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref([...tasksData]);
  const crud = createCrud(tasks, "k");

  const list = (filter = "all") =>
    tasks.value
      .filter((task) => filter === "all" || (filter === "done" ? task.completed : !task.completed))
      .sort((a, b) => (a.dueDate || "9").localeCompare(b.dueDate || "9") || weight[a.priority] - weight[b.priority]);

  const toggle = (id) => {
    const task = tasks.value.find((item) => item.id === id);
    if (task) crud.update(id, { completed: !task.completed });
  };

  return { tasks, list, toggle, ...crud };
});
