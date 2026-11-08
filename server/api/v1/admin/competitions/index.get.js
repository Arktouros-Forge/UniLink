import { defineApi } from "@server/utils/api.js";
import { listCompetitions } from "@server/services/competitions/competitions.service.js";
import { competitionsQuery } from "@server/validators/competitions.js";

export default defineApi(
  { auth: "admin", query: competitionsQuery },
  ({ user, query }) => listCompetitions(user, query),
);
