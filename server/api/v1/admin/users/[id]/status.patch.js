import { defineApi } from "@server/utils/api.js";
import { setUserStatus } from "@server/services/admin/admin-users.service.js";
import { statusBody } from "@server/validators/users.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: statusBody,
    message: "User status updated",
  },
  ({ user, params, body }) => setUserStatus(user.id, params.id, body),
);
