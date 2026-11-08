import { defineApi } from "@server/utils/api.js";
import { listRequests } from "@server/services/study-match/study-match.service.js";
import { requestsQuery } from "@server/validators/study-match.js";

export default defineApi({ query: requestsQuery }, ({ user, query }) =>
  listRequests(user.id, query),
);
