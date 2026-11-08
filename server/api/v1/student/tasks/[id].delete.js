import { defineApi } from "@server/utils/api.js";
import { deleteTask } from "@server/services/tasks/tasks.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Task deleted" },
  ({ user, params }) => deleteTask(user.id, params.id),
);
