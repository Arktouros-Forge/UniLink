import { defineApi } from "@server/utils/api.js";
import { updateTask } from "@server/services/tasks/tasks.service.js";
import { taskPatch } from "@server/validators/tasks.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: taskPatch, message: "Task updated" },
  ({ user, params, body }) => updateTask(user.id, params.id, body),
);
