import { defineApi } from "@server/utils/api.js";
import { clearCompleted } from "@server/services/tasks/tasks.service.js";

export default defineApi({ message: "Completed tasks cleared" }, ({ user }) =>
  clearCompleted(user.id),
);
