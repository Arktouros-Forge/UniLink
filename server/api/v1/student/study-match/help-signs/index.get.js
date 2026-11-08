import { defineApi } from "@server/utils/api.js";
import { listSigns } from "@server/services/study-match/study-match.service.js";
import { signsQuery } from "@server/validators/study-match.js";

export default defineApi({ query: signsQuery }, ({ user, query }) =>
  listSigns(user.id, query),
);
