import { defineApi } from "@server/utils/api.js";
import { deleteUser } from "@server/services/admin/admin-users.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { auth: "admin", params: idParam, message: "User deleted" },
  ({ user, params }) => deleteUser(user.id, params.id),
);
