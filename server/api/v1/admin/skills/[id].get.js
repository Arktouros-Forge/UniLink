import { defineApi } from "@server/utils/api.js";
import { skillRef } from "@server/services/reference/reference.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ auth: "admin", params: idParam }, ({ params }) =>
  skillRef.get(params.id),
);
