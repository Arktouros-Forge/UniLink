import { defineApi } from "@server/utils/api.js";
import { listTasks } from "@server/services/tasks/tasks.service.js";
import { tasksQuery } from "@server/validators/tasks.js";

export default defineApi({ query: tasksQuery }, ({ user, query }) =>
  listTasks(user.id, query),
);
