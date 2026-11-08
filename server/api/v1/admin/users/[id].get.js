import { defineApi } from "@server/utils/api.js";
import { getUser } from "@server/services/admin/admin-users.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ auth: "admin", params: idParam }, ({ params }) =>
  getUser(params.id),
);
