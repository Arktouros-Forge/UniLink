import { defineApi } from "@server/utils/api.js";
import { listUsers } from "@server/services/admin/admin-users.service.js";
import { adminUsersQuery } from "@server/validators/users.js";

export default defineApi(
  { auth: "admin", query: adminUsersQuery },
  ({ query }) => listUsers(query),
);
