import { defineApi, ok } from "@server/utils/api.js";
import { createTask } from "@server/services/tasks/tasks.service.js";
import { taskBody } from "@server/validators/tasks.js";

export default defineApi({ body: taskBody }, async ({ user, body }) =>
  ok(await createTask(user.id, body), "Task created", 201),
);
