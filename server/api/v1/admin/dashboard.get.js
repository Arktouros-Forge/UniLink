import { defineApi } from "@server/utils/api.js";
import { getAdminDashboard } from "@server/services/dashboard/dashboard.service.js";

export default defineApi({ auth: "admin" }, () => getAdminDashboard());
