import { defineApi } from "@server/utils/api.js";
import { getStudentDashboard } from "@server/services/dashboard/dashboard.service.js";

export default defineApi({}, ({ user }) => getStudentDashboard(user.id));
