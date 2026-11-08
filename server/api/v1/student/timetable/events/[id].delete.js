import { defineApi } from "@server/utils/api.js";
import { deleteEvent } from "@server/services/timetable/timetable.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Event deleted" },
  ({ user, params }) => deleteEvent(user.id, params.id),
);
