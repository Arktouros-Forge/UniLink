import { defineApi, ok } from "@server/utils/api.js";
import { createEvent } from "@server/services/timetable/timetable.service.js";
import { eventBody } from "@server/validators/timetable.js";

export default defineApi({ body: eventBody }, async ({ user, body }) =>
  ok(await createEvent(user.id, body), "Event created", 201),
);
