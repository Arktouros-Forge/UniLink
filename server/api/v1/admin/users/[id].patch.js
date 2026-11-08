import { defineApi } from "@server/utils/api.js";
import { updateUser } from "@server/services/admin/admin-users.service.js";
import { adminUserBody } from "@server/validators/users.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: adminUserBody,
    message: "User updated",
  },
  ({ params, body }) => updateUser(params.id, body),
);
