import { defineApi } from "@server/utils/api.js";
import { listMyTeams } from "@server/services/teams/teams.service.js";

export default defineApi({}, ({ user }) => listMyTeams(user.id));
