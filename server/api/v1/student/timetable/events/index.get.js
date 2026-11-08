import { defineApi } from "@server/utils/api.js";
import { listEvents } from "@server/services/timetable/timetable.service.js";
import { dayQuery } from "@server/validators/timetable.js";

export default defineApi({ query: dayQuery }, ({ user, query }) =>
  listEvents(user.id, query),
);
