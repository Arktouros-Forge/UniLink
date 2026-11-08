import { defineApi } from "@server/utils/api.js";
import { getStudentProfile } from "@server/services/users/users.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  getStudentProfile(params.id, user.id),
);
