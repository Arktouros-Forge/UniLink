import { defineApi } from "@server/utils/api.js";
import { clearEvents } from "@server/services/timetable/timetable.service.js";
import { clearQuery } from "@server/validators/timetable.js";

export default defineApi(
  { query: clearQuery, message: "Timetable cleared" },
  ({ user, query }) => clearEvents(user.id, query.source),
);
