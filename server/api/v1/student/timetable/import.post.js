import { defineApi, ok } from "@server/utils/api.js";
import { importEvents } from "@server/services/timetable/timetable.service.js";
import { importBody } from "@server/validators/timetable.js";

export default defineApi({ body: importBody }, async ({ user, body }) =>
  ok(await importEvents(user.id, body), "Timetable imported", 201),
);
