import { defineApi } from "@server/utils/api.js";
import { exportEvents } from "@server/services/timetable/timetable.service.js";
import { exportQuery } from "@server/validators/timetable.js";

export default defineApi({ query: exportQuery, raw: true }, ({ user, query }) =>
  exportEvents(user.id, query.format),
);
