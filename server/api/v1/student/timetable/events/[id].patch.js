import { defineApi } from "@server/utils/api.js";
import { updateEvent } from "@server/services/timetable/timetable.service.js";
import { eventPatch } from "@server/validators/timetable.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: eventPatch, message: "Event updated" },
  ({ user, params, body }) => updateEvent(user.id, params.id, body),
);
