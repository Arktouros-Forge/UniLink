import { defineApi } from "@server/utils/api.js";
import { getHistory } from "@server/services/study-match/study-match.service.js";
import { historyQuery } from "@server/validators/study-match.js";

export default defineApi({ query: historyQuery }, ({ user, query }) =>
  getHistory(user.id, query),
);
